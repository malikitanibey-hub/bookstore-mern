const express = require("express");
const app = express();

const cors = require("cors");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser")

const connectDB = require("./config/db")
app.use(cookieParser())
connectDB();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json())

app.use("/users", require("./routes/users"))
app.use("/books", require("./routes/books"))
app.use("/category", require("./routes/category"))
app.use("/admin", require("./routes/admin"))
app.use("/carts", require("./routes/carts"))
app.use("/contact", require("./routes/contact"));
app.use("/images", express.static("images"))


const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;