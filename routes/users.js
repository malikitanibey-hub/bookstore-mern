const express = require("express");
const router = express.Router();
const User = require("../models/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { cookieAuth, adminOnly  } = require("../auth/middleware");

router.post("/register", async (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({
      message: "Email and Name and Password are required",
    });
  }

  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      message: "User Already Exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    email,
    name,
    password: hashedPassword,
    role: "user",
  });
  await newUser.save();

  let token = jwt.sign(
    {
      email,
      id: newUser._id,
      role: newUser.role,
    },
    process.env.SECRET_KEY,
    { expiresIn: "1w" },
  );

  //خزيين tokens inside cookies inside httpOnly and its more secure
  //  make user if he exit and return to website to still login until 1 week
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    message: "User registered Successfully",
    user: newUser,
    token,
    role: newUser.role,
  });
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and Password are required",
    });
  }

  let user = await User.findOne({ email });

if (user && (await bcrypt.compare(password, user.password))) {

  // Check if account is suspended
  if (user.status === "suspended") {
    return res.status(403).json({
      message: "Your account has been suspended.",
    });
  }

  const role = (user.role || "user").trim();
    let token = jwt.sign(
      {
        email,
        id: user._id,
        role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1w" },
    );

    //خزيين tokens inside cookies inside httpOnly and its more secure
    //  make user if he exit and return to website to still login until 1 week
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // see if admin go to page admin otherwise if user go to home page
    const redirectPath = role === "admin" ? "/admin" : "/";

    return res.status(201).json({
      message: "User SignIn Successfully",
      user,
      token,
      role,
      redirect: redirectPath,
    });
  } else {
    return res.status(400).json({
      message: "Invalid Email or Password",
    });
  }
});

router.get("/verify", cookieAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "User Not Found",
      });
    }

    res.status(200).json({
      message: "Token Valid",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status
      },
    });
  } catch (error) {
    res.status(401).json({
      message: "Invalid Token",
    });
  }
});

router.post("/logout", async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.status(200).json({
    message: "Logged Out Successfully",
  });
});

router.get("/admin/all", cookieAuth, adminOnly, async (req, res) => {
  
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);

    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
  
});

router.put(
  "/admin/:id/suspend",
  cookieAuth,
  adminOnly,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          message: "User Not Found",
        });
      }

      if (user.role === "admin") {
        return res.status(403).json({
          message: "Admin accounts cannot be suspended.",
        });
      }

      user.status = "suspended";

      await user.save();

      res.status(200).json({
        message: "User suspended successfully",
        user: {
          id: user._id,
          status: user.status,
        },
      });
    } catch (error) {
      console.error("Error suspending user:", error);

      res.status(500).json({
        message: "Failed to suspend user",
      });
    }
  }
);

router.put(
  "/admin/:id/activate",
  cookieAuth,
  adminOnly,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          message: "User Not Found",
        });
      }

      if (user.role === "admin") {
        return res.status(403).json({
          message: "Admin accounts cannot be activated here.",
        });
      }

      user.status = "active";

      await user.save();

      res.status(200).json({
        message: "User activated successfully",
        user: {
          id: user._id,
          status: user.status,
        },
      });
    } catch (error) {
      console.error("Error activating user:", error);

      res.status(500).json({
        message: "Failed to activate user",
      });
    }
  }
);

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      message: "User Not Found",
    });
  }

  return res.status(200).json({ user });
});

module.exports = router;
