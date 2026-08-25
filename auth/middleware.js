const jwt = require('jsonwebtoken');

const auth = (requireRole = null) => {

    return async(req, res, next) => {
        let token = req.headers["authorization"]
        if(!token){
            return res.status(401).json({
                message: 'Access denied. No token provided.'
            })
        }
        token = token.split(" ")[1]
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if(err){
            return res.status(401).json({
                message: 'Invalid Token.'
            })
        }
        else{
            console.log(decoded)
            req.user = decoded
            if(requireRole && decoded.role !== requireRole){
                return res.status(403).json({
                   message: 'Access Denied. Insufficient Permissions.'
                })
            }
            next();
        }
        })
    }
}

const cookieAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "No Token Provided",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const User = require("../models/UserSchema");

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User Not Found",
      });
    }

    // Check if account is suspended
    if (user.status === "suspended") {
      res.clearCookie("token", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      return res.status(403).json({
        message: "Your account has been suspended.",
      });
    }

    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access Denied. Admins Only.",
    });
  }

  next();
};

module.exports = {auth, cookieAuth, adminOnly}