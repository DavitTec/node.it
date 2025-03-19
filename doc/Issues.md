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
