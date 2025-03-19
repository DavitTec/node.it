var createError = require("http-errors");
const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, "..")));

// Set up EJS as the view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Import and use routes
const routes = require("./routes/index");
app.use("/", routes);

// Add Profile View
// catch 404 and forward to error handler
// error handler
// set locals, only providing error in development
// render the error page

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
