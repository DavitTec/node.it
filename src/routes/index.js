var express = require("express");
var router = express.Router();

const header = require("../components/header.mjs").default;
const nav = require("../components/nav.mjs").default;
const main = require("../components/main.mjs").default;
const footer = require("../components/footer.mjs").default;

/* GET home page. */
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

<header>my header</header>
  <nav>
  My Nav here
  </nav>
    <main>
/*    ${header()}
   ${nav()}
   ${main()}
   ${footer()} */
    <h1>Main content</h1>
      <p> New Main content</p>
    </main>
    <footer>My footer here</footer>
</body>
</html>
`;
  res.send(html);
});

module.exports = router;
