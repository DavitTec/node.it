const express = require("express");
const router = express.Router();
// setting congiurations
const dotenv = require("dotenv");
dotenv.config();

router.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

router.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

router.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact" });
});
// Add Profile View
router.get("/profile", (req, res) => {
  const user = {
    name: process.env.USER_NAME || "Joe Bloggs", // Fallback if env var is missing
    id: process.env.USER_ID || "239482", // Keep as string or parseInt if needed
    key: process.env.USER_KEY
      ? process.env.USER_KEY.split(",")
      : ["reading", "gaming", "hiking"], // Safe split with fallback
  };

  // Render the profile template with the user object
  res.render("profile", { user: user }); // Fixed the object structure
});

module.exports = router;
