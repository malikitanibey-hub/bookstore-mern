const express = require("express");
const router = express.Router();
const Book = require("../models/BookSchema");
const multer = require("multer");
const path = require("path");
const { auth } = require("../auth/middleware");

//this code from multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './images')
//   },
//   filename: function (req, file, cb) {
//     const extension = file.originalname.split('.').pop()
//     const filename = Date.now() + '-' + file.fieldname + '.' + extension
//     cb(null, filename)
//   }
// })
// const upload = multer({ storage: storage })

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const filename = `${Date.now()}-coverImage${extension}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

router.post(
  "/createBook",
  auth("admin"),
  upload.single("coverImage"),
  async (req, res) => {
    console.log("CREATE BOOK REQUEST RECEIVED");
    console.log("FILE:", req.file);
    try {
      const {
        title,
        author,
        description,
        price,
        stock,
        isFeatured,
        category,
        isOnSale,
        discountPercent,
      } = req.body;

      if (!title || !author || !description || !price || !stock) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }

      const coverImage = req.file ? req.file.filename : null;

      const newBook = new Book({
        title,
        author,
        description,
        price,
        stock,
        isFeatured,
        category,
        isOnSale,
        discountPercent,
        coverImage,
      });

      await newBook.save();
      res.status(201).json({
        message: "Book created Successfully",
        book: newBook,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

router.get("/getBooks", async (req, res) => {
  try {
    const books = await Book.find().populate("category", "name");
    return res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      "category",
      "name",
    );
    if (!book) {
      return res.status(404).json({
        message: "Book Not Found",
      });
    }
    return res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/updateBook/:id", upload.single("coverImage"), async (req, res) => {
  try {
    const {
      title,
      author,
      description,
      price,
      stock,
      category,
      isFeatured,
      isOnSale,
      discountPercent,
    } = req.body;

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not Found",
      });
    }

    // Update normal fields
    book.title = title;
    book.author = author;
    book.description = description;
    book.price = price;
    book.stock = stock;
    book.category = category || null;
    book.isFeatured = isFeatured === "true";
    book.isOnSale = isOnSale === "true";
    book.discountPercent = discountPercent || "";

    // Upload new image only if user selected one
    if (req.file) {
      book.coverImage = req.file.filename;
    }

    await book.save();

    await book.populate("category", "name");

    res.json({
      message: "Book Updated Successfully",
      book,
    });
  } catch (error) {
    console.error("UPDATE BOOK ERROR:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});

router.delete("/deleteBook/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not Found",
      });
    }
    res.json({ message: "Book Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
