const express = require("express");
const router = express.Router();
const Cart = require("../models/CartSchema");
const Book = require("../models/BookSchema");
const { cookieAuth } = require("../auth/middleware");

/* =========================
   GET CART
========================= */
router.get("/", cookieAuth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.book",
      "title price coverImage stock",
    );

    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: [],
        totalItems: 0,
        totalAmount: 0,
      });

      await cart.save();
    }

    // Remove broken cart items where the book no longer exists
    cart.items = cart.items.filter((item) => item.book);

    cart.totalItems = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart Retrieved Successfully",
      cart,
    });
  } catch (error) {
    console.error("Error retrieving cart:", error);

    return res.status(500).json({
      success: false,
      message: "Error Retrieving Cart",
      error: error.message,
    });
  }
});

/* =========================
   ADD TO CART
========================= */
router.post("/add", cookieAuth, async (req, res) => {
  try {
    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: "Book ID is required",
      });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (book.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: "Book is out of stock",
      });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: [],
      });
    }

    // Remove broken/null items
    cart.items = cart.items.filter((item) => item.book);

    const itemIndex = cart.items.findIndex(
      (item) => item.book.toString() === bookId,
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({
        book: bookId,
        price: book.price,
        quantity: 1,
      });
    }

    // Decrease stock
    book.stock -= 1;
    await book.save();

    // Recalculate cart totals
    cart.totalItems = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.book",
      "title price coverImage stock",
    );

    return res.status(200).json({
      success: true,
      message: "Book added to cart",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);

    return res.status(500).json({
      success: false,
      message: "Error Adding to Cart",
      error: error.message,
    });
  }
});

/* =========================
   UPDATE CART
========================= */
router.put("/update", cookieAuth, async (req, res) => {
  try {
    const { bookId, quantity } = req.body;

    if (!bookId || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart information",
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.book && item.book.toString() === bookId,
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Book not found in cart",
      });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    const difference = quantity - item.quantity;

    // Increasing quantity
    if (difference > 0) {
      if (book.stock < difference) {
        return res.status(400).json({
          success: false,
          message: "Not Enough Stock",
        });
      }

      book.stock -= difference;
    }

    // Decreasing quantity
    else if (difference < 0) {
      book.stock += Math.abs(difference);
    }

    item.quantity = quantity;

    await book.save();

    cart.totalItems = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.book",
      "title price coverImage stock",
    );

    return res.status(200).json({
      success: true,
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Error updating cart:", error);

    return res.status(500).json({
      success: false,
      message: "Error Updating Cart",
      error: error.message,
    });
  }
});

/* =========================
   REMOVE FROM CART
========================= */
router.delete("/remove/:bookId", cookieAuth, async (req, res) => {
  try {
    const { bookId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.book && item.book.toString() === bookId,
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Book not found in cart",
      });
    }

    const item = cart.items[itemIndex];

    const book = await Book.findById(bookId);

    // Restore ALL copies that were in the cart
    if (book) {
      book.stock += item.quantity;
      await book.save();
    }

    cart.items.splice(itemIndex, 1);

    cart.totalItems = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.book",
      "title price coverImage stock",
    );

    return res.status(200).json({
      success: true,
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Error removing item:", error);

    return res.status(500).json({
      success: false,
      message: "Error Removing Item",
      error: error.message,
    });
  }
});

module.exports = router;