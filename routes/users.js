const express = require("express");
const router = express.Router();
const User = require("../models/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { cookieAuth } = require("../auth/middleware");

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
    role: "user"
  });
  await newUser.save();

  let token = jwt.sign(
    {
      email,
      id: newUser._id,
      role: newUser.role
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
  })

  res.status(201).json({
    message: "User registered Successfully",
    user: newUser,
    token,
    role: newUser.role
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
    const role = (user.role || "user").trim()
    let token = jwt.sign(
      {
        email,
        id: user._id,
        role
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
  })

    // see if admin go to page admin otherwise if user go to home page
    const redirectPath = role === "admin" ? "/admin" : "/"

    return res.status(201).json({
      message: "User SignIn Successfully",
      user,
      token,
      role, 
      redirect : redirectPath
    });
  } else {
    return res.status(400).json({
      message: "Invalid Email or Password",
    });
  }
});

router.get("/verify", cookieAuth, async(req, res) => {
  try{
    const user = await User.findById(req.user.id).select("-password")
    if(!user){
       return res.status(401).json({
        message: "User Not Found"
       })
    }

    res.status(200).json({
      message: "Token Valid",
      user:{
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  }
  catch(error){
     res.status(401).json({
      message: "Invalid Token"
     })
  }
})

router.post("/logout", async(req, res)=>{
  res.clearCookie("token", {
    httpOnly: true,
sameSite: "none",
secure: true,
  })
    res.status(200).json({
      message: "Logged Out Successfully"
    })
    
})


router.get("/:id", async (req, res)=> {
    const user = await User.findById(req.params.id);
    
    if(!user){
        return res.status(404).json({
            message: "User Not Found"
        })
    }
    
    return res.status(200).json({user})
    
})

module.exports = router;
