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
