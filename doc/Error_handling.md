# Error Handling

> Instead of using  jade like // view engine setup
> app.set("views", path.join(__dirname, "views"));
> app.set("view engine", "jade");now redundant what is a better code to catch errors

I assume you meant to reference catching errors in a Node.js/Express application, and it seems like you're transitioning away from Jade (now called Pug) as a view engine. If you're looking for a modern alternative to set up your Express app and handle errors effectively, here’s a cleaner and more robust approach.

Instead of focusing solely on replacing Jade/Pug, I'll provide a general example of setting up an Express app with a modern view engine (like ejs or hbs) and proper error handling middleware. Here's an improved setup:

Example Code with Error Handling

javascript

```javascript
const express = require('express');
const path = require('path');
const app = express();

// View engine setup (using EJS as an example instead of Jade/Pug)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // You can also use 'hbs' for Handlebars or another engine

// Middleware for parsing requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Example route
app.get('/', (req, res, next) => {
  try {
    // Simulate some logic that might throw an error
    const data = someFunctionThatMightFail(); // Replace with your logic
    res.render('index', { title: 'Home', data });
  } catch (err) {
    next(err); // Pass the error to the error-handling middleware
  }
});

// 404 handler - Catch undefined routes
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Centralized error-handling middleware
app.use((err, req, res, next) => {
  // Set locals, only providing error details in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

  // Render an error page or send a JSON response
  const status = err.status || 500;
  res.status(status);

  // You can customize this based on your needs
  res.render('error', { 
    title: 'Error', 
    status: status, 
    message: err.message 
  });
  // Or for an API: res.json({ error: err.message });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Dummy function to simulate an error
function someFunctionThatMightFail() {
  throw new Error('Something went wrong!');
}
```

Why This is Better

1. **Modern View Engine**: Replaces Jade/Pug with ejs (or you could use hbs for Handlebars). These are widely supported, actively maintained, and simpler to work with in modern Express apps.
2. **Error Handling**: 
   - Uses try/catch in routes to catch synchronous errors.
   - Passes errors to next(err) for centralized handling.
   - Includes a custom 404 handler and a general error middleware to catch all errors gracefully.
3. **Environment Awareness**: Shows detailed errors only in development (via process.env.NODE_ENV), which is safer for production.
4. **Flexibility**: Easily adaptable to render an error page or return JSON for APIs.

If You Meant Something Else

If you were asking specifically about catching errors in a different context (e.g., file parsing, async operations, or something unrelated to view engines), please clarify! For async operations, you'd typically use async/await with try/catch, like this:

javascript

```javascript
app.get('/async-route', async (req, res, next) => {
  try {
    const result = await someAsyncFunction();
    res.render('index', { data: result });
  } catch (err) {
    next(err);
  }
});
```

Let me know if you'd like me to tweak this further!

### Alternative to Jade

Since Jade has been renamed to Pug, I'll show you a modern error-handling approach using Express with Pug that works with CommonJS and keeps error pages in a ./pages folder. Here's a comprehensive solution:

javascript

```javascript
const express = require('express');
const path = require('path');
const app = express();

// View engine setup with Pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Serve static files (for styles)
app.use(express.static(path.join(__dirname, 'public')));

// Your routes would go here
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

// Catch 404 - Place this after all other routes
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handling middleware
app.use((err, req, res, next) => {
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

    // Render the appropriate error page
    const status = err.status || 500;
    res.status(status);

    // Render error page from ./views/errors folder
    res.render(`errors/${status}`, {
        title: `${status} Error`,
        status: status
    }, (renderErr, html) => {
        if (renderErr) {
            // Fallback if error page fails to render
            res.send(`Error ${status}: ${err.message}`);
        } else {
            res.send(html);
        }
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

Directory structure:

```text
your-project/
├── public/
│   └── css/
│       └── styles.css
├── views/
│   ├── errors/
│   │   ├── 404.pug
│   │   └── 500.pug
│   └── index.pug
└── app.js
```

Example views/errors/404.pug:

pug

```pug
html
  head
    title= title
    link(rel='stylesheet', href='/css/styles.css')
  body
    h1 404 - Page Not Found
    p The page you are looking for doesn't exist.
    p.status Error Code: #{status}
    a(href='/') Return to Home
```

Example views/errors/500.pug:

pug

```pug
html
  head
    title= title
    link(rel='stylesheet', href='/css/styles.css')
  body
    h1 500 - Server Error
    p Something went wrong on our end.
    p.status Error Code: #{status}
    if error && error.stack
      pre= error.stack
    a(href='/') Return to Home
```

Key features of this solution:

1. Uses Pug instead of Jade (modern replacement)
2. Works with CommonJS module system
3. Maintains styles through static file serving
4. Catches 404 errors with a middleware
5. Handles all other errors (500, etc.) with a final error handler
6. Keeps error pages in a structured way (views/errors/)
7. Includes fallback rendering if error pages fail
8. Shows detailed errors only in development mode
9. Preserves your CSS styles from the public folder

To use this:

1. Install required dependencies:

bash

```bash
npm install express pug
```

1. Create the directory structure as shown
2. Add your CSS in public/css/styles.css
3. Customize the error templates as needed

This setup will:

- Catch 404s for undefined routes
- Handle 500 errors for server issues
- Maintain consistent styling with your other pages
- Work with your existing ./pages structure (assuming you meant ./views)
- Be compatible with CommonJS

You can add more error-specific templates (403, 401, etc.) in the views/errors/ folder and the middleware will automatically use them based on the status code.



---

Since you're moving away from Jade (now Pug) and want a modern error-handling setup for CommonJS with error pages stored in a ./pages folder, I'll assume you're using Express.js and want to serve custom error pages (e.g., HTML or another templating engine like EJS). Here's a clean, updated approach:

Suggested Code for Error Handling in Express (CommonJS)

javascript

```javascript
const express = require('express');
const path = require('path');
const app = express();

// View engine setup (using EJS as an example instead of Jade/Pug)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // Use EJS or your preferred engine

// Serve static files (e.g., CSS, JS, images) from a 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Your routes go here
app.get('/', (req, res) => {
  res.render('index'); // Example route
});

// Catch 404 - Page Not Found
app.use((req, res, next) => {
  res.status(404).render('pages/404', { 
    title: '404 - Page Not Found',
    message: 'Sorry, the page you’re looking for doesn’t exist.'
  });
});

// Catch 500 - Internal Server Error (and other errors)
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging
  res.status(500).render('pages/500', { 
    title: '500 - Server Error',
    message: 'Something went wrong on our end. Please try again later.'
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Folder Structure

To keep error pages in ./pages with consistent styles:

```text
project/
├── public/
│   └── styles.css       // Shared styles for all pages
├── views/
│   ├── pages/
│   │   ├── 404.ejs     // 404 error page
│   │   └── 500.ejs     // 500 error page
│   └── index.ejs       // Example home page
├── app.js              // Your main file
└── package.json
```

Example EJS Error Pages

views/pages/404.ejs

html

```html
<!DOCTYPE html>
<html>
<head>
  <title><%= title %></title>
  <link rel="stylesheet" href="/styles.css"> <!-- Shared styles -->
</head>
<body>
  <h1><%= title %></h1>
  <p><%= message %></p>
  <a href="/">Go back home</a>
</body>
</html>
```

views/pages/500.ejs

html

```html
<!DOCTYPE html>
<html>
<head>
  <title><%= title %></title>
  <link rel="stylesheet" href="/styles.css"> <!-- Shared styles -->
</head>
<body>
  <h1><%= title %></h1>
  <p><%= message %></p>
  <a href="/">Try again</a>
</body>
</html>
```

Explanation

1. **View Engine**: I replaced Jade with EJS (npm install ejs), but you can use any engine (e.g., Handlebars) by adjusting app.set('view engine', 'hbs') and installing the appropriate package.
2. **404 Handling**: The first middleware catches any unmatched routes and renders a 404.ejs file from the ./views/pages folder.
3. **500 Handling**: The error-handling middleware catches any errors thrown in your app (e.g., database failures) and renders 500.ejs.
4. **Styling**: Static CSS is served from ./public and linked in the error pages to maintain consistent styling.
5. **CommonJS**: This code uses require() and works in a CommonJS environment (Node.js default).

Installation

If you’re starting fresh:

bash

```bash
npm init -y
npm install express ejs
```

Why This Is Better

- **Modular**: Error pages are organized in ./views/pages, keeping your structure clean.
- **Customizable**: Pass dynamic data (e.g., title, message) to your error pages.
- **Maintainable**: Shared styles via public/styles.css ensure consistency without Jade/Pug dependencies.
- **Error Logging**: The 500 handler logs errors to the console for debugging.

Let me know if you need adjustments for a different templating engine or additional error types (e.g., 403, 503)!
