var createError = require("http-errors");
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

// setting congiurations
dotenv.config();

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, "..")));

// Set up EJS as the view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Import and use routes
const routes = require("./routes/index");
app.use("/", routes);

// Add Profile View
app.get("/profile", (req, res) => {
  const user = {
    name: process.env.USER_NAME || "Joe Bloggs", // Fallback if env var is missing
    id: process.env.USER_ID || "239482", // Keep as string or parseInt if needed
    key: process.env.USER_KEY.split(","), // Split into array if comma-separated, else default
  };

  // Render the profile template with the user object
  res.render("profile", { user });
});

// catch 404 and forward to error handler
// error handler
// set locals, only providing error in development
// render the error page

// Start the server
/**
 * Get port from environment and store in Express.
 */
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOSTNAME || "localhost";

app.listen(PORT, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
