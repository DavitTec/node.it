# ISSUE

- [Issue 002 - error with ENV](#Issue-002) 
- [Issue 004 - Fix Structure](#Issue 004 - Fix Structure)

## Issue 002

Your .env file and app.js snippet are close, but there are a couple of issues to address for robustness and correctness. Let’s refine them.

------

#### Issues and Fixes

.env File

Your .env file has a trailing comma after "reading,gaming,hiking", which is invalid syntax. The .env format doesn’t support trailing commas like JavaScript objects do. Here’s the corrected version:

```bash
# env settings
USER_NAME="joe bloggs"
USER_ID="239482"
USER_KEY="reading,gaming,hiking"
```

- **Fix**: Removed the trailing comma after USER_KEY="reading,gaming,hiking".

------

app.js

In your app.js snippet:

1. **Missing dotenv Setup**: You’re using process.env, but dotenv isn’t imported or configured, so the .env file won’t load.
2. **Error Handling for split()**: If process.env.USER_KEY is undefined (e.g., .env file is missing or not loaded), calling .split() will throw an error. You need a fallback.
3. **Incomplete Code**: The snippet is partial, so I’ll provide a complete working version.

Here’s the corrected and complete app.js:

app.js

javascript

```javascript
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Set up EJS as the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Add Profile View
app.get('/profile', (req, res) => {
  const user = {
    name: process.env.USER_NAME || 'Joe Bloggs', // Fallback if env var is missing
    id: process.env.USER_ID || '239482',         // Keep as string or parseInt if needed
    key: process.env.USER_KEY ? process.env.USER_KEY.split(',') : ['reading', 'gaming', 'hiking'] // Safe split with fallback
  };

  // Render the profile template with the user object
  res.render('profile', { user });
});

// Error handling for 404
app.use((req, res) => {
  res.status(404).render('pages/404', { 
    title: '404 - Page Not Found',
    message: 'Page not found.'
  });
});

// Error handling for 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('pages/500', { 
    title: '500 - Server Error',
    message: 'Something went wrong.'
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

------

Key Improvements

1. **Added dotenv**:
   - Imported dotenv and called dotenv.config() to load the .env file.
   - Install it with npm install dotenv if not already done.
2. **Safe split()**:
   - Changed process.env.USER_KEY.split(',') to a conditional check: process.env.USER_KEY ? process.env.USER_KEY.split(',') : ['reading', 'gaming', 'hiking'].
   - This prevents a runtime error if USER_KEY is undefined (e.g., if .env isn’t loaded).
3. **Complete Setup**:
   - Included the full Express setup with EJS and error handling for context.

------

Example EJS Template (views/profile.ejs)

To match your user object:

html

```html
<!DOCTYPE html>
<html>
<head>
  <title><%= user.name %>'s Profile</title>
</head>
<body>
  <h1><%= user.name %>'s Profile</h1>
  <p>ID: <%= user.id %></p>
  <h2>Keys</h2>
  <ul>
    <% user.key.forEach(item => { %>
      <li><%= item %></li>
    <% }); %>
  </ul>
</body>
</html>
```

------

Testing

1. **Setup**:

   - Ensure .env is in your project root.
   - Create a views/ folder with profile.ejs (and optionally pages/404.ejs, pages/500.ejs).
   - Install dependencies: npm install express ejs dotenv.

2. **Run**:

   bash

   ```bash
   node app.js
   ```

3. **Visit**: http://localhost:3000/profile

------

Output

With your .env file, the rendered HTML will be:

html

```html
<!DOCTYPE html>
<html>
<head>
  <title>joe bloggs's Profile</title>
</head>
<body>
  <h1>joe bloggs's Profile</h1>
  <p>ID: 239482</p>
  <h2>Keys</h2>
  <ul>
    <li>reading</li>
    <li>gaming</li>
    <li>hiking</li>
  </ul>
</body>
</html>
```

------

Additional Suggestions

- **Trim Whitespace**: If USER_KEY might have extra spaces (e.g., "reading, gaming, hiking"), use:

  javascript

  ```javascript
  key: process.env.USER_KEY ? process.env.USER_KEY.split(',').map(item => item.trim()) : ['reading', 'gaming', 'hiking']
  ```

  This ensures clean array items ("gaming" instead of " gaming").

- **Numeric ID**: If id should be a number, use:

  javascript

  ```javascript
  id: parseInt(process.env.USER_ID) || 239482
  ```

- **Case Consistency**: .env values are case-sensitive. USER_NAME="joe bloggs" will render as lowercase unless you capitalize it in the template (e.g., <%= user.name.toUpperCase() %>).

Let me know if you need more tweaks or have additional requirements!

---

## Issue 004 - Fix Structure

Let's reorganize your project to use EJS for all views, consolidate pages/views into one folder, and set up custom error handling. Here's how we can restructure it:

1. **First, let's create a new file structure:**

```text
├── node_modules
├── package.json
├── pnpm-lock.yaml
├── README.md
├── src
│   ├── app.js
│   ├── bin
│   │   └── www
│   ├── components
│   │   ├── footer.mjs
│   │   ├── header.mjs
│   │   ├── main.mjs
│   │   └── nav.mjs
│   ├── public
│   │   ├── images
│   │   ├── javascripts
│   │   └── stylesheets
│   │       └── style.css
│   ├── routes
│   │   ├── index.js
│   │   └── users.js
│   └── views
│       ├── about.ejs
│       ├── contact.ejs
│       ├── index.ejs
│       ├── profile.ejs
│       ├── partials
│       │   ├── header.ejs
│       │   ├── footer.ejs
│       │   └── nav.ejs
│       └── error.ejs
└── test
    ├── car.js
    └── index.js
```

1. **Update your src/app.js:**

```javascript
const express = require('express');
const createError = require('http-errors');
const path = require('path');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Custom 404 handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error', {
    title: 'Error',
    status: err.status || 500,
    message: err.message
  });
});

module.exports = app;
```

1. **Update src/routes/index.js:**

```javascript
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

router.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact' });
});

router.get('/profile', (req, res) => {
  res.render('profile', { title: 'Profile' });
});

module.exports = router;
```

1. **Create a basic src/views/error.ejs:**

```html
<!DOCTYPE html>
<html>
<head>
  <title><%= title %> - <%= status %></title>
  <link rel="stylesheet" href="/stylesheets/style.css">
</head>
<body>
  <%- include('partials/header') %>
  <%- include('partials/nav') %>
  
  <main>
    <h1>Error <%= status %></h1>
    <p><%= message %></p>
    <% if (error.stack) { %>
      <pre><%= error.stack %></pre>
    <% } %>
  </main>
  
  <%- include('partials/footer') %>
</body>
</html>
```

1. **Example src/views/index.ejs:**

```html
<!DOCTYPE html>
<html>
<head>
  <title><%= title %></title>
  <link rel="stylesheet" href="/stylesheets/style.css">
</head>
<body>
  <%- include('partials/header') %>
  <%- include('partials/nav') %>
  
  <main>
    <h1>Welcome</h1>
    <p>This is the home page</p>
  </main>
  
  <%- include('partials/footer') %>
</body>
</html>
```

1. Convert your components to EJS partials in src/views/partials/:

#### header.ejs:

```html
<header>
  <h1>My Website</h1>
</header>
```

#### nav.ejs:

```html
<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
  <a href="/profile">Profile</a>
</nav>
```

#### footer.ejs:

```html
<footer>
  <p>&copy; 2025 My Website</p>
</footer>
```

Steps to implement:

1. Move all page files from src/pages/ to src/views/
2. Convert any .js or .jade files to .ejs
3. Create a partials folder under views/ for reusable components
4. Update your routes to use res.render() with the EJS files
5. Remove the old pages folder and any Jade/Pug references
6. Ensure all your view files use EJS syntax (<% %>) instead of Jade/Pug syntax

This setup:

- Uses EJS exclusively as the view engine
- Consolidates all views in the views folder
- Implements custom error handling with http-errors
- Maintains your modular component structure (now as EJS partials)
- Works with Node.js 22 and Express 4.21
- Uses CommonJS modules as requested

You can create similar EJS files for about.ejs, contact.ejs, and profile.ejs following the same pattern as index.ejs, adjusting the content as needed. The error handling will catch 404s and other errors, rendering them through your custom error.ejs template.

## Issue 005 - Fix profile.ejs

There is an issue with profile.ejs and index.js and app.js Current profile.ejs 

I can see a few issues in the code. Let's fix profile.ejs, index.js, and app.js:

1. **profile.ejs**: There's a syntax error in the forEach loop
2. **index.js**: The title object is incorrectly structured in the profile route
3. **app.js**: Has some commented-out code we can clean up

Here are the corrected versions:

1. **src/views/profile.ejs**:

html

```html
<!DOCTYPE html>
<html>
  <head>
    <title><%= user.name %>'s Profile</title>
    <link rel="stylesheet" href="/stylesheets/style.css">
  </head>
  <body>
    <%- include('partials/header') %>
    <%- include('partials/nav') %>
    
    <main>
      <h1><%= user.name %>'s Profile</h1>
      <p>ID: <%= user.id %></p>
      <h2>Hobbies</h2>
      <ul>
        <% user.key.forEach(function(item) { %>
          <li><%= item %></li>
        <% }); %>
      </ul>
    </main>
    
    <%- include('partials/footer') %>
  </body>
</html>
```

Fix: Changed the arrow function syntax to a traditional function since EJS doesn't support arrow functions in this context. Also added partials for consistency with your other views.

1. **src/routes/index.js**:

javascript

```javascript
const express = require("express");
const router = express.Router();
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

router.get("/profile", (req, res) => {
  const user = {
    name: process.env.USER_NAME || "Joe Bloggs",
    id: process.env.USER_ID || "239482",
    key: process.env.USER_KEY
      ? process.env.USER_KEY.split(",")
      : ["reading", "gaming", "hiking"]
  };

  res.render("profile", { user: user }); // Fixed the object structure
});

module.exports = router;
```

Fixes:

- Removed duplicate express import
- Fixed the render object structure (was { title: { user } }, now { user: user })
- Kept the title separate from user object for consistency

1. **src/app.js**:

javascript

```javascript
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

dotenv.config();

const app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);

// Custom 404 handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error", {
    title: "Error",
    status: err.status || 500,
    message: err.message
  });
});

module.exports = app;
```

Fixes:

- Removed commented-out code
- Kept the structure clean and consistent
- Note: The server startup code is typically in bin/www, which is why it's not here

Additional notes:

1. Make sure you have a .env file in your project root with:

```text
USER_NAME=YourName
USER_ID=12345
USER_KEY=reading,gaming,hiking
```

1. The bin/www file should handle the server startup:

javascript

```javascript
#!/usr/bin/env node
const app = require('../app');
const http = require('http');

const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

These changes should resolve:

- The syntax error in profile.ejs's forEach loop
- The incorrect data structure being passed to the profile view
- Clean up unnecessary code in app.js
- Maintain consistency with your partials structure

Try running this now, and the profile page should render correctly with the user data.

---

## Issue 006 - Fix error handler 

The 404 error indicates that Express can't find a route handler for the requested URL or there's an issue with serving static files or rendering views. Looking at the stack trace, the error originates from app.js:33:8, which corresponds to your custom 404 handler being triggered. This means the request isn't being caught by any of your defined routes.

Let's troubleshoot and fix this step-by-step:

Possible Causes

1. **Route Not Matching**: The URL you're trying to access (e.g., /profile, /, etc.) isn't being handled by the routes in index.js.
2. **View File Missing**: The EJS file being rendered (e.g., profile.ejs, index.ejs) might not exist in the views directory.
3. **Static File Issue**: If you're getting a 404 for /stylesheets/style.css, the static file middleware might not be serving it correctly.
4. **Typo or Path Issue**: There could be a mismatch in file names, paths, or directory structure.

Debugging Steps and Fixes

1. Verify Routes in index.js

Your index.js defines routes for /, /about, /contact, and /profile. Ensure you're accessing one of these URLs (e.g., http://localhost:3000/profile). If you're trying a different URL (e.g., /something-else), the 404 is expected because no route matches.

- **Test**: Visit http://localhost:3000/, http://localhost:3000/about, http://localhost:3000/contact, and http://localhost:3000/profile in your browser.
- **Fix**: If you're trying a different URL, add a corresponding route in index.js.
- Check View Files

Ensure all required EJS files exist in src/views/:

- index.ejs
- about.ejs
- contact.ejs
- profile.ejs
- error.ejs
- partials/header.ejs
- partials/footer.ejs
- partials/nav.ejs

From your error, it seems the request reaches the 404 handler, but we should verify the views are present:

- **Test**: Check your src/views/ directory matches this structure.
- **Fix**: If any file is missing, create it. For example, if profile.ejs is missing, use the version I provided earlier.
- Fix Static File Serving

The <link rel="stylesheet" href="/stylesheets/style.css"> in your EJS files assumes style.css is in src/public/stylesheets/. The 404 could occur if:

- The file doesn’t exist at that path.
- The public directory structure is incorrect.

Your app.js has:

javascript

```javascript
app.use(express.static(path.join(__dirname, 'public')));
```

This expects src/public/stylesheets/style.css to exist.

- **Test**: Check if src/public/stylesheets/style.css exists.

- **Fix**: If it’s missing, create it or adjust the path:

  bash

  ```bash
  mkdir -p src/public/stylesheets
  touch src/public/stylesheets/style.css
  ```

  Add some basic CSS to test:

  css

  ```css
  body {
    font-family: Arial, sans-serif;
  }
  ```

- **Alternative Fix**: If your CSS is in src/public/styles/ (from your original structure), update the EJS link to:

  html

  ```html
  <link rel="stylesheet" href="/styles/style.css">
  ```

  And ensure app.js serves the correct directory.

- Verify Directory Structure

Your current structure should be:

```text
src/
├── app.js
├── bin/
│   └── www
├── public/
│   └── stylesheets/
│       └── style.css
├── routes/
│   ├── index.js
│   └── users.js
└── views/
    ├── about.ejs
    ├── contact.ejs
    ├── error.ejs
    ├── index.ejs
    ├── profile.ejs
    └── partials/
        ├── footer.ejs
        ├── header.ejs
        └── nav.ejs
```

- **Test**: Run ls -R src/ (or dir src\ on Windows) to confirm.
- **Fix**: If any files are in the wrong location (e.g., profile.ejs in src/pages/), move them to src/views/.
- Check app.js Configuration

Your app.js looks mostly correct, but let’s ensure the view engine is working:

- The line app.set('views', path.join(__dirname, 'views')); assumes views is directly under src/.

- **Test**: Add a console.log to verify the path:

  javascript

  ```javascript
  console.log('Views directory:', path.join(__dirname, 'views'));
  app.set('views', path.join(__dirname, 'views'));
  ```

  Restart the server and check the output (should be something like /home/github.com/DavitTec/node.it/src/views).

- **Fix**: If the path is incorrect, adjust it to the absolute path of your views folder.

- Test the Server Startup

Since app.js exports the app and bin/www starts the server, ensure bin/www is correct:

javascript

```javascript
#!/usr/bin/env node
const app = require('../app');
const http = require('http');

const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

- **Test**: Run node src/bin/www and visit http://localhost:3000/profile.
- **Fix**: If it doesn’t start, check for syntax errors or missing dependencies (npm install).
- Add Debug Logging

To pinpoint where the 404 occurs, add logging to index.js:

javascript

```javascript
router.get("/profile", (req, res) => {
  console.log('Profile route hit');
  const user = {
    name: process.env.USER_NAME || "Joe Bloggs",
    id: process.env.USER_ID || "239482",
    key: process.env.USER_KEY
      ? process.env.USER_KEY.split(",")
      : ["reading", "gaming", "hiking"]
  };
  console.log('Rendering profile with user:', user);
  res.render("profile", { user: user });
});
```

- **Test**: Restart the server, visit /profile, and check the console. If you don’t see these logs, the route isn’t being reached.

Likely Fix

Based on the error, the most likely issue is:

- **Missing View File**: Ensure profile.ejs exists in src/views/ with the content I provided.
- **Static File 404**: The browser might be requesting /stylesheets/style.css, but it’s not found. Create the file or fix the path.

Final Steps

1. Ensure all files are in place as per the structure above.
2. Run npm install to ensure all dependencies (express, http-errors, dotenv) are installed.
3. Start the server: node src/bin/www.
4. Test all routes: /, /about, /contact, /profile.

If you still get a 404, please tell me:

- The exact URL you’re visiting (e.g., http://localhost:3000/profile).
- The console output after adding the debug logs.
- The contents of src/views/ and src/public/.

This should resolve the 404 error!

---

## Issue 006 - Fix the stack tracing messages on Errors

To customize the 404 error response so that it only shows "Error 404 Not Found" without the stack trace or additional error details, we need to modify the error handler in src/app.js. Currently, it’s rendering the error.ejs template with the full error message and stack trace (in development mode). We can simplify this by either:

1. Updating the error handler to render a minimal message directly.
2. Modifying error.ejs to show only what you want.

Since you’re not seeing the full error.ejs template rendered (just the raw error text), it seems the issue might be that error.ejs isn’t rendering properly, or the response is being sent incorrectly. Let’s fix this by ensuring a clean, minimal 404 response.

Solution

Option 1: Modify app.js Error Handler

Update src/app.js to send a plain text response for 404 errors instead of rendering a template with extra details:

javascript

```javascript
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

dotenv.config();

const app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);

// Custom 404 handler
app.use((req, res, next) => {
  res.status(404).send("Error 404 Not Found");
});

// Error handler (for non-404 errors)
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render("error", {
    title: "Error",
    status: err.status || 500,
    message: err.message
  });
});

module.exports = app;
```

**Changes:**

- Replaced next(createError(404)) with res.status(404).send("Error 404 Not Found").
- This sends a plain text response directly for 404 errors, bypassing the error.ejs template for 404s.
- Kept the general error handler for non-404 errors (e.g., 500 errors).

Option 2: Update error.ejs for Minimal Output

If you prefer to keep using the template, update src/views/error.ejs to only show the minimal message:

html

```html
<!DOCTYPE html>
<html>
<head>
  <title>Error <%= status %></title>
  <link rel="stylesheet" href="/stylesheets/style.css">
</head>
<body>
  <h1>Error <%= status %> Not Found</h1>
</body>
</html>
```

Then keep app.js as it was (using next(createError(404))):

javascript

```javascript
// Custom 404 handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render("error", {
    title: "Error",
    status: err.status || 500,
    message: err.message
  });
});
```

**Changes:**

- Simplified error.ejs to only show "Error 404 Not Found" (or the appropriate status code).
- Removed stack trace and extra details.

Why You’re Seeing Raw Text

The current behavior (showing NotFoundError: Not Found with a stack trace) suggests:

- error.ejs might be missing or malformed, causing Express to fall back to sending the raw error object.
- Or, the response is being intercepted before the template renders.

Option 1 (plain text response) is simpler and guarantees you’ll only see "Error 404 Not Found". Option 2 gives you more control over the HTML structure if you want to style it later.

Steps to Apply

1. **Choose Option 1 or 2**:
   - For Option 1: Replace app.js with the first version above.
   - For Option 2: Update error.ejs and keep the original app.js error handling.
2. **Restart the Server**: Run node src/bin/www.
3. **Test**: Visit http://localhost:3000/missing in your browser.

Expected Result

For either option, when you visit http://localhost:3000/missing, you should see only:

```text
Error 404 Not Found
```

With no stack trace or additional text.

Verification

If you still see the stack trace:

- Check if src/views/error.ejs exists and is valid (for Option 2).
- Confirm no other middleware is interfering with the response.
- Add a console.log('404 handler triggered') in the 404 handler to ensure it’s being hit.

Let me know if this works or if you need further adjustments!

---

## Issue 007 - FEATURE to add the stack tracing option 

To toggle the display of the error.stack in error.ejs based on a DEBUG environment variable, we need to:

1. Pass the DEBUG status from the environment to the error.ejs template via app.js.
2. Update error.ejs to conditionally show the stack trace based on that variable.

Here’s how to implement this:

Step 1: Update src/app.js

Modify the error handler in app.js to pass the DEBUG environment variable to the template:

javascript

```javascript
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

dotenv.config();

const app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);

// Custom 404 handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error", {
    title: "Error",
    status: err.status || 500,
    message: err.message,
    error: err, // Pass the full error object
    debug: process.env.DEBUG === "true" // Pass DEBUG as a boolean
  });
});

module.exports = app;
```

**Changes:**

- Added debug: process.env.DEBUG === "true" to the res.render options. This converts the DEBUG env variable (a string) to a boolean (true or false).
- Kept error: err to pass the full error object (including the stack trace) to the template.

Step 2: Update src/views/error.ejs

Modify error.ejs to use the debug variable to conditionally show the stack trace:

html

```html
<!DOCTYPE html>
<html>
  <head>
    <title><%= title %> - <%= status %></title>
    <link rel="stylesheet" href="/stylesheets/style.css" />
  </head>
  <body>
    <%- include('partials/header') %>
    <%- include('partials/nav') %>

    <main>
      <h1>Error <%= status %></h1>
      <p><%= message %></p>
      <% if (debug && error.stack) { %>
        <pre><%= error.stack %></pre>
      <% } %>
    </main>

    <%- include('partials/footer') %>
  </body>
</html>
```

**Changes:**

- Changed the CSS link to /stylesheets/style.css to match your project structure (adjust if it’s still /styles/style.css).
- Added a conditional <% if (debug && error.stack) %> to only show the stack trace when DEBUG=true and there’s a stack trace available.

Step 3: Set Up the Environment Variable

Create or update your .env file in the project root:

```text
# .env
DEBUG=true  # Set to "true" to show stack trace, "false" or anything else to hide it
USER_NAME=Joe Bloggs
USER_ID=239482
USER_KEY=reading,gaming,hiking
PORT=3000
```

Alternatively, you can set it when running the server:

bash

```bash
DEBUG=true node src/bin/www  # Show stack trace
DEBUG=false node src/bin/www # Hide stack trace
```

How It Works

- When DEBUG=true in your .env file (or environment):
  - process.env.DEBUG === "true" evaluates to true.
  - The debug variable in the template is true.
  - The stack trace shows in the browser (e.g., for http://localhost:3000/missing).
- When DEBUG=false or unset:
  - process.env.DEBUG === "true" evaluates to false.
  - The stack trace is hidden, and you only see "Error 404 Not Found".

Testing

1. **With Stack Trace**:

   - Set DEBUG=true in .env or run DEBUG=true node src/bin/www.

   - Visit http://localhost:3000/missing.

   - You should see:

     ```text
     Error 404
     Not Found
     [stack trace here]
     ```

2. **Without Stack Trace**:

   - Set DEBUG=false in .env or run DEBUG=false node src/bin/www.

   - Visit http://localhost:3000/missing.

   - You should see only:

     ```text
     Error 404
     Not Found
     ```

Notes

- **Case Sensitivity**: DEBUG must be exactly "true" (lowercase) to enable the stack trace. Any other value ("off", "false", or unset) will disable it.
- **CSS Path**: If your CSS is still in src/public/styles/ instead of src/public/stylesheets/, update the link in error.ejs to <link rel="stylesheet" href="/styles/style.css" />.
- **Security**: Hiding the stack trace in production is a good practice to avoid exposing internal details. You could also tie this to NODE_ENV (e.g., only show stack in development), but DEBUG gives you more explicit control.

Let me know if you need further tweaks!

---

## Issue 008 -  Add head.ejs and avoid repeated code 

To manage the <head> section in a separate head.ejs partial file and avoid repeating it across your views (like index.ejs, about.ejs, contact.ejs, error.ejs, and profile.ejs), you can create views/partials/head.ejs and include it in each page. This approach keeps your code DRY (Don't Repeat Yourself) and makes it easier to update the <head> section globally.

Here’s how to do it:

Step 1: Create views/partials/head.ejs

Move the <head> content from index.ejs into a new file, views/partials/head.ejs:

html

```html
<!-- views/partials/head.ejs -->
<head>
  <title><%= title %></title>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="/styles/global.css" />
  <link rel="stylesheet" href="/styles/style.css" />
</head>
```

**Notes:**

- The <%= title %> variable is preserved so each page can set its own title dynamically.
- Adjust the stylesheet paths (/styles/global.css and /styles/style.css) if your public directory structure differs (e.g., /stylesheets/style.css).

Step 2: Update index.ejs

Modify index.ejs to include the head.ejs partial:

html

```html
<!-- views/index.ejs -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <%- include('partials/head') %>

  <body>
    <%- include('partials/header') %>
    <%- include('partials/nav') %>

    <main>
      <h1>Welcome</h1>
      <p>This is the home page</p>
      <section>
        <h2>Main Content</h2>
        <p>This is the main content of the page.</p>
      </section>
    </main>

    <%- include('partials/footer') %>
  </body>
</html>
```

**Changes:**

- Replaced the entire <head> section with <%- include('partials/head') %>.
- The title variable will still work because it’s passed from the route handler (e.g., res.render("index", { title: "Home" })).

Step 3: Update Other Views

Apply the same change to all other view files (about.ejs, contact.ejs, error.ejs, profile.ejs). Here’s an example for each:

views/about.ejs

html

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <%- include('partials/head') %>

  <body>
    <%- include('partials/header') %>
    <%- include('partials/nav') %>

    <main>
      <h1>About Us</h1>
      <p>This is the about page</p>
    </main>

    <%- include('partials/footer') %>
  </body>
</html>
```

views/contact.ejs

html

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <%- include('partials/head') %>

  <body>
    <%- include('partials/header') %>
    <%- include('partials/nav') %>

    <main>
      <h1>Contact Us</h1>
      <p>This is the contact page</p>
    </main>

    <%- include('partials/footer') %>
  </body>
</html>
```

views/error.ejs

html

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <%- include('partials/head') %>

  <body>
    <%- include('partials/header') %>
    <%- include('partials/nav') %>

    <main>
      <h1>Error <%= status %></h1>
      <p><%= message %></p>
      <% if (debug && error.stack) { %>
        <pre><%= error.stack %></pre>
      <% } %>
    </main>

    <%- include('partials/footer') %>
  </body>
</html>
```

views/profile.ejs

html

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <%- include('partials/head') %>

  <body>
    <%- include('partials/header') %>
    <%- include('partials/nav') %>

    <main>
      <h1><%= user.name %>'s Profile</h1>
      <p>ID: <%= user.id %></p>
      <h2>Hobbies</h2>
      <ul>
        <% user.key.forEach(function(item) { %>
          <li><%= item %></li>
        <% }); %>
      </ul>
    </main>

    <%- include('partials/footer') %>
  </body>
</html>
```

Step 4: Verify Route Data

Ensure all your routes in src/routes/index.js pass the title variable (and other necessary data) to the views:

javascript

```javascript
const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

router.get("/", (req, res) => {
  res.render("itoryindex", { title: "Home" });
});

router.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

router.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact" });
});

router.get("/profile", (req, res) => {
  const user = {
    name: process.env.USER_NAME || "Joe Bloggs",
    id: process.env.USER_ID || "239482",
    key: process.env.USER_KEY
      ? process.env.USER_KEY.split(",")
      : ["reading", "gaming", "hiking"]
  };
  res.render("profile", { user: user, title: `${user.name}'s Profile` });
});

module.exports = router;
```

**Notes:**

- The title for profile is set dynamically based on the user’s name.
- There’s a typo in your original index.js (res.render("itoryindex"...) should be res.render("index", ...)), which I’ve assumed was a copy-paste error.

Step 5: Test

1. Restart your server: node src/bin/www.
2. Visit each page:
   - http://localhost:3000/
   - http://localhost:3000/about
   - http://localhost:3000/contact
   - http://localhost:3000/profile
   - http://localhost:3000/missing (to test the error page)
3. Verify that:
   - The <head> section is consistent across all pages.
   - The title changes appropriately for each page.
   - Stylesheets load correctly.

Additional Considerations

- **Customizing <head> Per Page**: If a specific page needs additional <head> content (e.g., a unique <script> or <meta> tag), you can pass extra variables to head.ejs or add a section after the include. For example:

  html

  ```html
  <!-- views/index.ejs -->
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
    <%- include('partials/head') %>
    <script src="/javascripts/custom.js"></script> <!-- Page-specific addition -->
  
    <body>
      <!-- rest of the page -->
    </body>
  </html>
  ```

- **DOCTYPE Consistency**: You’re using XHTML 1.0 Transitional. Ensure all partials (e.g., header.ejs, nav.ejs) are compatible with this DOCTYPE if they contain markup.

Your updated structure will now be:

```text
└── views
    ├── about.ejs
    ├── contact.ejs
    ├── error.ejs
    ├── index.ejs
    ├── partials
    │   ├── footer.ejs
    │   ├── head.ejs  <!-- New file -->
    │   ├── header.ejs
    │   └── nav.ejs
    └── profile.ejs
```

This approach centralizes your <head> management and keeps your views cleaner! Let me know if you need help with additional customizations.

---

## Issue 009 -  Add capitalise function

```bash
console.log(`Node.js version: ${process.version}`);
console.log(`Project version: ${version}\n`);


function capitalize(s) {
  return s.toLowerCase().replace(/\b./g, (a) => a.toUpperCase());
}

let myName = args[0];

if (!myName) {
  myName = process.env.USER_NAME.split(" ")[0];
}

console.log(`Hello ${capitalize(myName)}, \n`);
```

---

## Issue 010 -Fix and amend capitalise

> summary: fix and amend capitalise function and feature for profile.ejs

There are a few syntax and logical errors in your code related to capitalizing firstName and user.name. Here's how we can fix it:

1. **Syntax Error**: The line const firstName = capitalize(process.env.USER_NAME)} has an extra closing brace and is outside the route handler, which doesn’t make sense in this context.
2. **Undefined args**: The code references args[0], but args isn’t defined anywhere (possibly a leftover from a script context).
3. **Capitalization**: You want to capitalize user.name and potentially a firstName, but the current implementation is incomplete.

Let’s clean this up and ensure user.name (and optionally a separate firstName) is capitalized correctly.

Fixed Code: src/routes/index.js

javascript

```javascript
const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

// Capitalize function
function capitalize(str) {
  if (!str) return ""; // Handle null/undefined case
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
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

router.get("/profile", (req, res) => {
  // Get and capitalize the full name
  const rawName = process.env.USER_NAME || "Joe Bloggs";
  const capitalizedName = capitalize(rawName);

  // Optionally extract and capitalize just the first name
  const firstName = capitalize(rawName.split(" ")[0]);

  const user = {
    name: capitalizedName, // Capitalized full name
    id: process.env.USER_ID || "239482",
    key: process.env.USER_KEY
      ? process.env.USER_KEY.split(",")
      : ["reading", "gaming", "hiking"]
  };

  res.render("profile", {
    user: user,
    title: `${user.name}'s Profile` // Uses capitalized name
  });
});

module.exports = router;
```

Changes Made

1. **Fixed capitalize Function**:
   - Improved it to handle full names (e.g., "joe bloggs" → "Joe Bloggs") by splitting on spaces and capitalizing each word.
   - Added a check for null/empty strings to avoid errors.
   - Replaced the regex approach with a simpler, more readable method using split, map, and join.
2. **Moved firstName Logic**:
   - Removed the standalone const firstName = capitalize(process.env.USER_NAME) line, as it was misplaced.
   - Added firstName inside the /profile route handler if you need it separately (e.g., to display just "Joe" from "Joe Bloggs").
   - If you don’t need firstName separately, you can remove that line.
3. **Applied Capitalization**:
   - user.name is now set to the capitalized version of process.env.USER_NAME.
   - The title uses user.name directly, so it’s automatically capitalized (e.g., "Joe Bloggs's Profile").
4. **Removed Unused Code**:
   - Deleted let myName = args[0] and the related if block, as args isn’t defined (likely a copy-paste error from a different context).

Verification

- If .env has USER_NAME="joe bloggs":
  - user.name becomes "Joe Bloggs".
  - title becomes "Joe Bloggs's Profile".
  - firstName (if used) becomes "Joe".
- If USER_NAME is unset:
  - Falls back to "Joe Bloggs" (capitalized from "joe bloggs").

Updated profile.ejs (If Needed)

Your profile.ejs already uses <%= user.name %>, so it will automatically reflect the capitalized name:

html

```html
<!-- views/profile.ejs -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <%- include('partials/head') %>

  <body>
    <%- include('partials/header') %>
    <%- include('partials/nav') %>

    <main>
      <h1><%= user.name %>'s Profile</h1> <!-- Will show "Joe Bloggs" -->
      <p>ID: <%= user.id %></p>
      <h2>Hobbies</h2>
      <ul>
        <% user.key.forEach(function(item) { %>
          <li><%= item %></li>
        <% }); %>
      </ul>
    </main>

    <%- include('partials/footer') %>
  </body>
</html>
```

Optional: Using firstName

If you want to display just the first name somewhere in profile.ejs, pass it separately and use it:

Updated Route

javascript

```javascript
router.get("/profile", (req, res) => {
  const rawName = process.env.USER_NAME || "Joe Bloggs";
  const capitalizedName = capitalize(rawName);
  const firstName = capitalize(rawName.split(" ")[0]);

  const user = {
    name: capitalizedName,
    id: process.env.USER_ID || "239482",
    key: process.env.USER_KEY
      ? process.env.USER_KEY.split(",")
      : ["reading", "gaming", "hiking"]
  };

  res.render("profile", {
    user: user,
    firstName: firstName, // Pass firstName separately
    title: `${user.name}'s Profile`
  });
});
```

Updated profile.ejs

html

```html
<main>
  <h1><%= firstName %>'s Profile</h1> <!-- Shows "Joe" -->
  <p>Full Name: <%= user.name %></p> <!-- Shows "Joe Bloggs" -->
  <p>ID: <%= user.id %></p>
  <h2>Hobbies</h2>
  <ul>
    <% user.key.forEach(function(item) { %>
      <li><%= item %></li>
    <% }); %>
  </ul>
</main>
```

Testing

1. Update your .env:

   ```text
   USER_NAME="john doe"
   ```

2. Restart the server: node src/bin/www.

3. Visit http://localhost:3000/profile.

4. Expected output:

   - Title: "John Doe's Profile"
   - Heading: "John Doe's Profile" (or "John's Profile" if using firstName).

This should resolve the capitalization issue and clean up the code. Let me know if you need further adjustments!

---

## Issue 011 -Adding "firstname"

To add user.firstname to the user object in your route handler, you can simply include it alongside name, id, and key. Since you’re already extracting and capitalizing the first name with const firstName = capitalize(rawName.split(" ")[0]), you can assign it directly to user.firstname. This way, it becomes part of the user object and can be accessed in your profile.ejs template as <%= user.firstname %>.

Here’s how to modify your code:

Updated src/routes/index.js

javascript

```javascript
const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

// Capitalize function
function capitalize(str) {
  if (!str) return ""; // Handle null/undefined case
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
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

router.get("/profile", (req, res) => {
  // Get and capitalize the full name
  const rawName = process.env.USER_NAME || "Joe Bloggs";
  const capitalizedName = capitalize(rawName);

  // Extract and capitalize just the first name
  const firstName = capitalize(rawName.split(" ")[0]);

  const user = {
    name: capitalizedName,      // Full name: "Joe Bloggs"
    firstname: firstName,       // First name: "Joe"
    id: process.env.USER_ID || "239482",
    key: process.env.USER_KEY
      ? process.env.USER_KEY.split(",")
      : ["reading", "gaming", "hiking"]
  };

  res.render("profile", {
    user: user,
    title: `${user.name}'s Profile`
  });
});

module.exports = router;
```

Changes Made

- Added firstname: firstName to the user object.
- Kept firstName as a separate variable to compute it, then assigned it to user.firstname.
- The user object now has four properties: name, firstname, id, and key.

Update views/profile.ejs

You can now use <%= user.firstname %> in your template alongside user.name, user.id, and user.key:

html

```html
<!-- views/profile.ejs -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <%- include('partials/head') %>

  <body>
    <%- include('partials/header') %>
    <%- include('partials/nav') %>

    <main>
      <h1><%= user.firstname %>'s Profile</h1> <!-- Displays "Joe" -->
      <p>Full Name: <%= user.name %></p>      <!-- Displays "Joe Bloggs" -->
      <p>ID: <%= user.id %></p>               <!-- Displays "239482" -->
      <h2>Hobbies</h2>
      <ul>
        <% user.key.forEach(function(item) { %>
          <li><%= item %></li>                <!-- Displays "reading", "gaming", "hiking" -->
        <% }); %>
      </ul>
    </main>

    <%- include('partials/footer') %>
  </body>
</html>
```

Testing

1. Ensure your .env file has:

   ```text
   USER_NAME="joe bloggs"
   USER_ID=239482
   USER_KEY=reading,gaming,hiking
   ```

2. Restart the server: node src/bin/www.

3. Visit http://localhost:3000/profile.

4. Expected output:

   ```text
   Joe's Profile
   Full Name: Joe Bloggs
   ID: 239482
   Hobbies
   - reading
   - gaming
   - hiking
   ```

Additional Notes

- **Consistency**: I used firstname (lowercase) to match the style of user.name, user.id, and user.key. If you prefer firstName (camelCase), just change it to user.firstName: firstName in the user object and <%= user.firstName %> in the template.
- **Fallback**: If USER_NAME is unset, it falls back to "Joe Bloggs", so user.firstname will be "Joe" and user.name will be "Joe Bloggs".
- **Edge Cases**: The capitalize function handles multi-word names correctly. For example, "mary jane doe" becomes:
  - user.name: "Mary Jane Doe"
  - user.firstname: "Mary"

This should give you exactly what you need: a user.firstname property in the user object, derived from USER_NAME. Let me know if you want to tweak it further!

---

## Issue 012 -Fixing stylesheets

Let’s clean up and modernize your CSS, remove unnecessary whitespace and padding, and add responsive design for two screen settings:

1. **Mobile** (up to 767px)
2. **Desktop** (up to 1120px max-width for full screen)

I’ll also implement a **sticky footer** and **sticky nav** while keeping the styles concise and efficient. Here’s the updated structure combining globals.css and styles.css into a single, optimized file (you can split them if preferred).

**Updated src/public/stylesheets/style.cs**

```css
/* Reset and Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
header {
  background: #333;
  color: #fff;
  text-align: center;
  padding: 1rem;
}

/* Navigation */
nav {
  background: #f4f4f4;
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 1000;
}

nav ul {
  list-style: none;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

nav a {
  color: #333;
  text-decoration: none;
}

nav a:hover {
  color: #00b7ff;
}

/* Main Content */
main {
  flex: 1;
  padding: 1rem;
}

/* Footer */
footer {
  background: #333;
  color: #fff;
  text-align: center;
  padding: 1rem;
  position: sticky;
  bottom: 0;
  width: 100%;
}

/* Links */
a {
  color: #00b7ff;
  text-decoration: none;
}

/* Mobile (up to 767px) */
@media (max-width: 767px) {
  nav ul {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  header, nav, main, footer {
    padding: 0.5rem;
  }

  main {
    min-height: 50vh;
  }
}

/* Desktop (768px to 1120px) */
@media (min-width: 768px) {
  body {
    max-width: 1120px;
    margin: 0 auto;
  }

  nav ul {
    gap: 2rem;
  }

  main {
    padding: 2rem;
  }
}
```

Changes and Improvements

1. Cleaned Up Formatting

- **Removed Whitespace**: Condensed rules by removing unnecessary line breaks and spacing.
- **Simplified Selectors**: Combined overlapping styles (e.g., removed duplicate body rules from styles.css).
- **Consistent Units**: Used rem consistently for padding and spacing (1rem ≈ 16px by default).
- Sticky Footer and Nav

- **Sticky Footer**:
  - Set body to display: flex; flex-direction: column; min-height: 100vh.
  - Set main to flex: 1 to push the footer to the bottom.
  - Used position: sticky; bottom: 0 on footer for it to stick to the bottom when content is short.
- **Sticky Nav**:
  - Added position: sticky; top: 0; z-index: 1000 to nav so it stays at the top when scrolling.
- Responsive Design

- **Mobile (max-width: 767px)**:
  - Collapses nav ul into a vertical list for better mobile usability.
  - Reduces padding to 0.5rem across all sections to save space.
  - Adjusts main’s min-height to 50vh for shorter screens.
- **Desktop (min-width: 768px)**:
  - Caps the body width at 1120px and centers it with margin: 0 auto.
  - Increases nav ul gap to 2rem for better spacing.
  - Restores main padding to 2rem for a more spacious layout.
- Removed Unnecessary Styles

- Dropped "Lucida Grande", Helvetica from the font stack since Arial, sans-serif is sufficient and widely supported.
- Removed redundant min-height: 70vh from main (handled by flex: 1).
- Simplified nav a by moving the color to the base a rule and adding a hover effect.
- File Consolidation

- Combined globals.css and styles.css into one file (style.css) since they’re small and overlapping. If you prefer separate files:
  - Keep reset/base styles (*, body) in globals.css.
  - Move component styles (header, nav, etc.) to styles.css.

Updated File Structure

```text
src/
├── public/
│   └── stylesheets/
│       └── style.css  <!-- Updated file -->
└── views/
    └── partials/
        └── head.ejs  <!-- Update CSS path if needed -->
```

Update head.ejs

Ensure the CSS path matches your structure:

html

```html
<!-- views/partials/head.ejs -->
<head>
  <title><%= title %></title>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="/stylesheets/style.css" />
</head>
```

Testing

1. Replace your old globals.css and styles.css with this new style.css in src/public/stylesheets/.
2. Restart the server: node src/bin/www.
3. Test on:
   - **Mobile**: Resize browser to < 767px or use a mobile device/emulator.
   - **Desktop**: View at 768px–1120px to see the max-width effect.
4. Scroll on pages (e.g., /profile) to confirm the nav sticks to the top and the footer sticks to the bottom.

Expected Results

- **Mobile**: Compact layout, vertical nav, minimal padding.
- **Desktop**: Centered layout up to 1120px wide, horizontal nav, more padding in main.
- **Sticky Elements**: Nav stays at the top, footer at the bottom (or below content if it’s longer than the viewport).

Let me know if you need further refinements, like additional breakpoints or specific styling tweaks!
