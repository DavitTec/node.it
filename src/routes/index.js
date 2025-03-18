var express = require("express");
var router = express.Router();

const header = require("../components/header.mjs").default;
const nav = require("../components/nav.mjs").default;
const main = require("../components/main.mjs").default;
const footer = require("../components/footer.mjs").default;

// Import pages
const about = require("../pages/about.js");
const contact = require("../pages/contact.js");

/* GET home page. */
// Home page route
router.get("/", function (req, res, next) {
  //  res.render('index', { title: 'Express' });
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    <link rel="stylesheet" href="/styles/global.css">
    <link rel="stylesheet" href="/styles/style.css">
</head>
 <body>
   ${header()}
   ${nav()}
   ${main()}
   ${footer()} 
 </body>
</html>
`;
  res.send(html);
});

// About page route
router.get("/about", (req, res) => {
  const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>About - My Website</title>
          <link rel="stylesheet" href="/styles/global.css">
          <link rel="stylesheet" href="/styles/style.css">
      </head>
      <body>
          ${header()}
          ${nav()}
          ${about()}
          ${footer()}
      </body>
      </html>
  `;
  res.send(html);
});

// Contact page route
router.get("/contact", (req, res) => {
  const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Contact - My Website</title>
          <link rel="stylesheet" href="/styles/global.css">
          <link rel="stylesheet" href="/styles/style.css">
      </head>
      <body>
          ${header()}
          ${nav()}
          ${contact()}
          ${footer()}
      </body>
      </html>
  `;
  res.send(html);
});

module.exports = router;
