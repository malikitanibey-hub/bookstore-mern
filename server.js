const express = require("express");
const app = express();

const cors = require("cors");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser")
const path = require("path");

const connectDB = require("./config/db")
app.use(cookieParser())

const allowedOrigins = [
  "http://localhost:3000",
  "https://bookstore-mern-oesn.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json())

// Connect on demand in a serverless function. A failed MongoDB connection now
// returns JSON with CORS headers instead of crashing the entire Vercel function.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    res.status(503).json({
      message: "Database connection failed. Check MONGO_URI and MongoDB Atlas Network Access.",
    });
  }
});

app.use("/users", require("./routes/users"))
app.use("/books", require("./routes/books"))
app.use("/category", require("./routes/category"))
app.use("/admin", require("./routes/admin"))
app.use("/carts", require("./routes/carts"))
app.use("/contact", require("./routes/contact"));

app.use("/images", express.static(path.join(__dirname, "images")));


const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
