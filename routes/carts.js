const express = require("express");
const router = express.Router();
const Cart = require("../models/CartSchema");
const Book = require("../models/BookSchema");
const { cookieAuth } = require("../auth/middleware");

router.get("/", cookieAuth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.book",
      "title price coverImage stock",
    );

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
      await cart.save();
    }

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

router.post("/add", cookieAuth, async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);

    let cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.book",
      "title price coverImage stock",
    );

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        (item.book._id ? item.book._id.toString() : item.book.toString()) ===
        bookId,
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({ book: bookId, price: book.price, quantity: 1 });
    }
    book.stock -= 1;
    book.save();
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    cart.save();

    const populateCart = await Cart.findById(cart._id).populate(
      "items.book",
      "title price coverImage stock",
    );

    res.json({ success: true, cart: populateCart });
  } catch (error) {
    res.status(500).json({
      message: "Error Adding to Cart",
      error: error.message,
    });
  }
});

router.put("/update", cookieAuth, async (req, res) => {
  try {
    const { bookId, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.book",
      "title price coverImage stock",
    );

    if (!cart) {
      return res.status(404).json({ message: "Crt Not Found" });
    }

    const item = cart.items.find((item) => item.book._id.toString() === bookId);

    const book = await Book.findById(bookId);

    const difference = quantity - item.quantity;
    if (difference > 0) {
      if (book.stock < difference) {
        return res.status(400).json({
          message: "Not Enough Stock",
        });
      }
      book.stock -= difference;
    } else {
      book.stock += Math.abs(difference);
    }

    item.quantity = quantity;
    await book.save();

    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    await cart.save();

    const populateCart = await Cart.findById(cart._id).populate(
      "items.book",
      "title price coverImage stock",
    );

    res.json({ success: true, cart: populateCart });
  } catch (error) {
    res.status(500).json({
      message: "Error Updating Cart",
      error: error.message,
    });
  }
});

router.delete("/remove/:bookId", cookieAuth, async (req, res) => {
  try {
    const { bookId } = req.params;
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.book.toString() === bookId,
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Cart not found in cart" });
    }

    const item = cart.items[itemIndex];
    const book = await Book.findById(bookId);

    if (book) {
      book.stock += 1;
      await book.save();
    }

    cart.items.splice(itemIndex, 1);
    
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    await cart.save();

    const populateCart = await Cart.findById(cart._id).populate(
      "items.book",
      "title price coverImage stock",
    );

    res.json({ success: true, cart: populateCart });
  } catch (error) {
    res.status(500).json({
      message: "Error Removing Item",
      error: error.message,
    });
  }
});

module.exports = router;
