const express = require("express");
const router = express.Router();
// setting congiurations
const dotenv = require("dotenv");
dotenv.config();

// Capitalize function
function capitalize(str) {
  if (!str) return ""; // Handle null/undefined case
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

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
  // Get and capitalize the full name
  const rawName = process.env.USER_NAME || "Joe Bloggs";
  const capitalizedName = capitalize(rawName);

  // Optionally extract and capitalize just the first name
  const firstName = capitalize(rawName.split(" ")[0]);

  const user = {
    name: capitalizedName, // Capitalized full name
    firstname: firstName, // First name: "Joe"
    id: process.env.USER_ID || "239482", // Keep as string or parseInt if needed
    key: process.env.USER_KEY
      ? process.env.USER_KEY.split(",")
      : ["reading", "gaming", "hiking"], // Safe split with fallback
  };

  // Render the profile template with the user object
  res.render("profile", {
    user: user,
    title: `${user.name}'s Profile`, // Uses capitalized name
  }); // Fixed the object structure
});

module.exports = router;
