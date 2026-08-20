const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },

  author: {
    type: String,
    require: true,
  },

  description: {
    type: String,
    require: true,
  },

  price: {
    type: Number,
    require: true,
  },

  stock: {
    type: Number,
    require: true,
    default: 0,
  },

  isFeatured: {
    type: Boolean,
    default: false,
  },

  isOnSale: {
    type: Boolean,
    default: false,
  },

  discountPercent: {
    type: String,
    default: false,
  },

  // Connecting the book to a category using a reference to the Category model
   category:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
   },

  coverImage: {
    type: String,
  },
});

module.exports = mongoose.model("Book", BookSchema);
