var createError = require("http-errors");
const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, "..")));

// Import and use routes
const routes = require("./routes/index");
app.use("/", routes);

// catch 404 and forward to error handler
// error handler
// set locals, only providing error in development
// render the error page

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
