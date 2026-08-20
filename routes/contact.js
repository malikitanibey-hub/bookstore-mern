const express = require("express");
const router = express.Router();

const Contact = require("../models/ContactSchema");

// GET - Get all contact messages
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      contacts,
    });
  } catch (error) {
    console.error("Get contacts error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get contact messages.",
    });
  }
});

// POST - Create a contact message
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Create contact message
    const contact = new Contact({
      name,
      email,
      subject,
      message,
    });

    // Save to MongoDB
    await contact.save();

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully.",
      contact,
    });
  } catch (error) {
    console.error("Contact error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
});

module.exports = router;