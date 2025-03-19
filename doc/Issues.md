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
