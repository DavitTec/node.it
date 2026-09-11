const express = require("express");
const router = express.Router();
const config = require("../config");
const { getDisplayUser } = require("../lib/user");

// The live app is served from its own domain root — config.site.basePath is
// the GitHub Pages project-site prefix used only by the static build.
const basePath = "";

router.get("/", (req, res) => {
  res.render("index", { title: "Home", basePath });
});

router.get("/about", (req, res) => {
  res.render("about", { title: "About", basePath });
});

router.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact", basePath });
});

// Add Profile View
router.get("/profile", (req, res) => {
  const user = getDisplayUser(config);

  // Render the profile template with the user object
  res.render("profile", {
    user: user,
    title: `${user.name}'s Profile`, // Uses capitalized name
    basePath,
  });
});

module.exports = router;
