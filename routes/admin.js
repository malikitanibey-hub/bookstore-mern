const express = require("express");
const router = express.Router();
const Book = require("../models/BookSchema");
const multer = require("multer");
const supabase = require("../config/supabase");
const {auth, cookieAuth} = require("../auth/middleware")

 //this code from multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './images')
//   },
// filename: function (req, file, cb) {
//   const extension = file.originalname.split(".").pop();
//   const filename = Date.now() + "-" + file.fieldname + "." + extension;
//   cb(null, filename);
// }
// })
// const upload = multer({ storage: storage })

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/createBook", cookieAuth, upload.single("coverImage"), async (req, res) => {
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

    let coverImageUrl = null;

    if (req.file) {
      const extension = req.file.originalname.split(".").pop();
      const fileName = `${Date.now()}-coverImage.${extension}`;

      const { data: uploadData, error: uploadError } =
        await supabase.storage
          .from("book-images")
          .upload(fileName, req.file.buffer, {
            contentType: req.file.mimetype,
            upsert: false,
          });

      if (uploadError) {
        return res.status(500).json({
          message: "Image upload failed",
          error: uploadError.message,
        });
      }

      const { data: publicUrlData } = supabase.storage
        .from("book-images")
        .getPublicUrl(fileName);

      coverImageUrl = publicUrlData.publicUrl;
    }

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
      coverImage: coverImageUrl,
    });

    await newBook.save();

    res.status(201).json({
      message: "Book created Successfully",
      book: newBook,
    });
  } catch (error) {
    console.error("CREATE BOOK ERROR:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});

router.get("/getBooks", cookieAuth, async (req, res) => {
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

router.put("/updateBook/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("category", "name");

    if (!book) {
      return res.status(404).json({
        message: "Book not Found",
      });
    }
    res.json({ message: "Book Updated Successfully", book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete("/deleteBook/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id)

    if (!book) {
      return res.status(404).json({
        message: "Book not Found",
      });
    }
    res.json({ message: "Book Deleted Successfully"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
