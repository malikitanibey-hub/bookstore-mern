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
        jwt.verify(token.process.env.SECRET_KEY, (err, decoded) => {
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

const cookieAuth = (req, res, next) => {
    try{
       const token = req.cookies.token
       if(!token){
        return res.status(401).json({
            message: "No Token Provided"
        })
       }

       const decoded = jwt.verify(token, process.env.SECRET_KEY)
       req.user = decoded
       next() 
    }
    catch(error){
       return res.status(401).json({
        message: "Invalid Token"
       })
    }
}

module.exports = {auth, cookieAuth}