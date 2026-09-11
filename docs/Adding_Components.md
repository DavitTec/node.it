# README

> Summary **using Node server.cjsI want to present a home page with a separate component files like; header.mjs nav.mjs main.mjs footer.mjswith separating global.css and style.css for main.css in a  styles folder**

### Project structure:

Let's create a Node.js server with separate component files and styles as requested. Here's a complete example:

1. First, create your project structure:

```text
project/
├── components/
│   ├── header.mjs
│   ├── nav.mjs
│   ├── main.mjs
│   ├── footer.mjs
├── styles/
│   ├── global.css
│   ├── style.css
├── server.cjs
├── package.json
```

### Adding Files

1. Here's the server.cjs file:

javascript

```javascript
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Import components
const header = require('./components/header.mjs');
const nav = require('./components/nav.mjs');
const main = require('./components/main.mjs');
const footer = require('./components/footer.mjs');

// Route for home page
app.get('/', (req, res) => {
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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

1. Component files:

components/header.mjs:

javascript

```javascript
export default function header() {
    return `
        <header>
            <h1>Welcome to My Website</h1>
        </header>
    `;
}
```

components/nav.mjs:

javascript

```javascript
export default function nav() {
    return `
        <nav>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
        </nav>
    `;
}
```

components/main.mjs:

javascript

```javascript
export default function main() {
    return `
        <main>
            <section>
                <h2>Main Content</h2>
                <p>This is the main content of the page.</p>
            </section>
        </main>
    `;
}
```

components/footer.mjs:

javascript

```javascript
export default function footer() {
    return `
        <footer>
            <p>&copy; 2025 My Website. All rights reserved.</p>
        </footer>
    `;
}
```

1. Style files:

styles/global.css:

css

```css
/* Global styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
}
```

styles/style.css:

css

```css
/* Main content specific styles */
header {
    background-color: #333;
    color: white;
    padding: 1rem;
    text-align: center;
}

nav {
    background-color: #f4f4f4;
    padding: 1rem;
}

nav ul {
    list-style: none;
    display: flex;
    justify-content: center;
    gap: 2rem;
}

nav a {
    text-decoration: none;
    color: #333;
}

main {
    padding: 2rem;
    min-height: 70vh;
}

footer {
    background-color: #333;
    color: white;
    padding: 1rem;
    text-align: center;
    position: relative;
    bottom: 0;
    width: 100%;
}
```

1. package.json:

json

```json
{
    "name": "my-website",
    "version": "1.0.0",
    "type": "commonjs",
    "scripts": {
        "start": "node server.cjs"
    },
    "dependencies": {
        "express": "^4.18.2"
    }
}
```

To get this running:

1. Create a new directory for your project
2. Run npm init -y to create package.json
3. Install Express: npm install express
4. Create all the files as shown above
5. Start the server: npm start
6. Visit http://localhost:3000 in your browser

This setup:

- Uses CommonJS (.cjs) for the server file
- Uses ES Modules (.mjs) for components
- Separates components into individual files
- Has separate global.css (for site-wide styles) and style.css (for specific component styles)
- Serves static files (CSS) through Express
- Combines all components into a single HTML response

The components are simple functions that return HTML strings, which are then inserted into the main template in the server file. The styles are split between global.css (reset and base styles) and style.css (component-specific styles).

NOTE: 

I apologize for the error. The issue occurs because when using CommonJS require() with ES Modules (.mjs files), the exports need to be accessed differently. Since we're mixing CommonJS (server.cjs) with ES Modules (components/*.mjs), we need to adjust how we import and use the components. Here's the corrected version:

1. Update server.cjs:

javascript

```javascript
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Import components - using .default since they're ES Modules
const header = require('./components/header.mjs').default;
const nav = require('./components/nav.mjs').default;
const main = require('./components/main.mjs').default;
const footer = require('./components/footer.mjs').default;

// Route for home page
app.get('/', (req, res) => {
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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

The key change is adding .default after each require() statement. This is necessary because:

- ES Modules (using export default) export a default property when imported via CommonJS
- Without .default, you'd get the module object { default: [Function] } instead of the function itself

The component files (header.mjs, nav.mjs, main.mjs, footer.mjs) and style files remain exactly the same as in the previous example.

To verify this works:

1. Replace your existing server.cjs with this updated version
2. Make sure all other files are in place as previously described
3. Run npm start
4. Visit http://localhost:3000

This should now work without the "main is not a function" error. The same fix applies to all components (header, nav, main, and footer) since they all use the same ES Module export pattern.

If you still encounter issues, you could alternatively:

1. Change all .mjs files to .cjs and use module.exports = function() {...} instead of export default
2. Or convert server.cjs to server.mjs and use ES Module import syntax throughout

Let me know if you need either of those alternative approaches instead!



### Addtional pages

Can you also create pages for the 

- /about.js  About and
- /contact.js  for Contact

Let's add About and Contact pages to your project. We'll create these as separate files and update the server to handle the new routes. Here's how to implement this:

1. First, update your project structure to include these new files:

```text
project/
├── components/
│   ├── header.mjs
│   ├── nav.mjs
│   ├── main.mjs
│   ├── footer.mjs
├── pages/
│   ├── about.js
│   ├── contact.js
├── styles/
│   ├── global.css
│   ├── style.css
├── server.cjs
├── package.json
```

1. Update server.cjs to handle the new routes:

javascript

```javascript
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Import components
const header = require('./components/header.mjs').default;
const nav = require('./components/nav.mjs').default;
const main = require('./components/main.mjs').default;
const footer = require('./components/footer.mjs').default;

// Import pages
const about = require('./pages/about.js');
const contact = require('./pages/contact.js');

// Home page route
app.get('/', (req, res) => {
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
app.get('/about', (req, res) => {
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
app.get('/contact', (req, res) => {
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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

1. Create pages/about.js:

javascript

```javascript
module.exports = function about() {
    return `
        <main>
            <section>
                <h2>About Us</h2>
                <p>Welcome to our website! We are a team dedicated to providing excellent content and services.</p>
                <p>Our mission is to inform, educate, and entertain our visitors.</p>
            </section>
        </main>
    `;
};
```

1. Create pages/contact.js:

javascript

```javascript
module.exports = function contact() {
    return `
        <main>
            <section>
                <h2>Contact Us</h2>
                <p>Get in touch with us:</p>
                <ul>
                    <li>Email: contact@example.com</li>
                    <li>Phone: (555) 123-4567</li>
                    <li>Address: 123 Main Street, City, Country</li>
                </ul>
            </section>
        </main>
    `;
};
```

1. Optional: Update styles/style.css to ensure consistency (add this to existing CSS):

css

```css
/* Existing styles remain the same, just adding some spacing */
section {
    max-width: 800px;
    margin: 0 auto;
}

section h2 {
    margin-bottom: 1rem;
}

section p {
    margin-bottom: 1rem;
}

section ul {
    list-style: none;
    margin-left: 1rem;
}

section ul li {
    margin-bottom: 0.5rem;
}
```

Notes:

- I used .js extension for the new page files as requested, using CommonJS module.exports syntax
- The pages follow the same structure as the home page, reusing the header, nav, and footer components
- Each page has its own main content section
- The existing styles will work with these new pages, but I added some additional CSS for better formatting
- The navigation links in nav.mjs will now work since we've added the corresponding routes

To test:

1. Add these new files to your project
2. Replace your existing server.cjs with the updated version
3. Restart your server with npm start
4. Visit:
   - http://localhost:3000/ (home)
   - http://localhost:3000/about (about page)
   - http://localhost:3000/contact (contact page)

The navigation links should now take you between all three pages, maintaining consistent header, navigation, and footer components across all pages while displaying different main content for each route.

### Some Errors

The error "app is not defined" suggests that the Express app instance isn't properly scoped or initialized in your file structure. From your error message, it seems you might have a different project structure than what I assumed, with files like index.js in a routes folder and an app.js file. Let me adjust the solution to better match what appears to be your setup.

Based on the error path, it looks like you might be trying to organize routes separately. Here's how we can fix this with a more modular structure:

Updated Project Structure

```text
project/
├── components/
│   ├── header.mjs
│   ├── nav.mjs
│   ├── main.mjs
│   ├── footer.mjs
├── pages/
│   ├── about.js
│   ├── contact.js
├── styles/
│   ├── global.css
│   ├── style.css
├── src/
│   ├── routes/
│   │   ├── index.js
│   ├── app.js
├── package.json
```

1. src/app.js

This will be the main entry point where we initialize Express and use the routes:

javascript

```javascript
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, '..')));

// Import and use routes
const routes = require('./routes/index');
app.use('/', routes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

2. src/routes/index.js

This will handle all the route definitions:

javascript

```javascript
const express = require('express');
const router = express.Router();

// Import components
const header = require('../../components/header.mjs').default;
const nav = require('../../components/nav.mjs').default;
const main = require('../../components/main.mjs').default;
const footer = require('../../components/footer.mjs').default;

// Import pages
const about = require('../../pages/about.js');
const contact = require('../../pages/contact.js');

// Home page route
router.get('/', (req, res) => {
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
router.get('/about', (req, res) => {
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
router.get('/contact', (req, res) => {
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
```

Notes on the Fix:

1. **Express Router**: Instead of defining routes directly on app, we use express.Router() to create a modular route handler that can be imported into app.js.
2. **Path Adjustments**: The file paths in the require statements are adjusted to match the new structure (../../ to go up two levels from src/routes/ to the root).
3. **Static Files**: The static file serving is adjusted to point to the root directory (path.join(__dirname, '..')) since app.js is now in the src/ folder.
4. Update package.json

Make sure your start script points to the new entry point:

json

```json
{
    "name": "my-website",
    "version": "1.0.0",
    "type": "commonjs",
    "scripts": {
        "start": "node src/app.js"
    },
    "dependencies": {
        "express": "^4.18.2"
    }
}
```

4. Keep Other Files

- The components/*.mjs, pages/about.js, pages/contact.js, and styles/*.css files remain exactly as they were in my previous response.

How to Run

1. Ensure all files are placed in the correct directories as shown in the structure.
2. Run npm install if you haven't already (to ensure Express is installed).
3. Start the server with npm start.
4. Visit:
   - http://localhost:3000/ (home)
   - http://localhost:3000/about (about page)
   - http://localhost:3000/contact (contact page)

Why This Fixes the Error

The original error occurred because app was not defined in the scope where the routes were being set up. By splitting the application into app.js (where app is initialized) and routes/index.js (where routes are defined using a router), we ensure proper scoping and modularity. The router is then mounted on the app instance in app.js.

Let me know if this resolves the issue or if you need further adjustments!
