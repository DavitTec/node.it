# Correcting Objects

> **Summary** Help to correct better CommonJS codeFrom .env
>
> #!/usr/bin/env node
> #Set Development
> USER_NAME="joe bloggs"
> USER_ID="239482"
> USER_KEY="foobar"how to set an object within 'app.js' to update the "user"
> ..
> // Add Profile View
> app.get("/profile", (req, res) => {
>   const user = {
>     name: {process.env.NODE_HOSTNAME || "Joe Bloggs"},
>     id: 25,
>     key: ["reading", "gaming", "hiking"],
>   };

Let’s improve your CommonJS code by correctly integrating environment variables from a .env file into your Express app.js file. I’ll assume you want to update the user object with values from the .env file and fix some syntax issues in your provided snippet. Here’s a step-by-step correction and enhancement:

------

Step 1: Set Up .env Properly

Your .env file has some syntax issues (e.g., comments with # need proper formatting, and the shebang #!/usr/bin/env node isn’t needed here). It should look like this:

.env

```text
# Development settings
USER_NAME="Joe Bloggs"
USER_ID="239482"
USER_KEY="foobar"
```

- **Notes**:
  - Remove the shebang (#!/usr/bin/env node) unless this is a CLI script, which it doesn’t seem to be for an Express app.
  - Environment variables should be key-value pairs without extra scripting syntax.

------

Step 2: Install Required Packages

You’ll need the dotenv package to load .env variables into process.env. Install it:

bash

```bash
npm install dotenv
```

------

Step 3: Update app.js

Here’s a corrected and improved version of your Express app that:

- Loads environment variables using dotenv.
- Creates a user object with values from process.env.
- Handles the /profile route properly.

app.js

javascript

```javascript
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Set up EJS as the view engine (optional, based on prior discussion)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Add Profile View
app.get('/profile', (req, res) => {
  const user = {
    name: process.env.USER_NAME || 'Joe Bloggs', // Fallback if env var is missing
    id: process.env.USER_ID || '239482',         // Keep as string or parseInt if needed
    key: process.env.USER_KEY ? process.env.USER_KEY.split(',') : ['reading', 'gaming', 'hiking'] // Split into array if comma-separated, else default
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

Key Corrections and Improvements

1. **Loading .env**:
   - Added dotenv.config() to load the .env file at the start of the app.
   - Access variables via process.env.USER_NAME, not process.env.NODE_HOSTNAME (which wasn’t in your .env).
2. **Syntax Fixes in user Object**:
   - Your original code had {process.env.NODE_HOSTNAME || "Joe Bloggs"} wrapped in an extra object (name: {...}). Simplified it to name: process.env.USER_NAME || 'Joe Bloggs'.
   - id: 25 was hardcoded; updated to use USER_ID from .env.
   - key was an array in your example but a string in .env. Added logic to split USER_KEY into an array if it’s comma-separated, with a fallback.
3. **Route Completion**:
   - Added res.render('profile', { user }) to complete the route (assuming EJS from prior context). If you’re not using a templating engine, replace with res.send(user).
4. **Error Handling**:
   - Included basic 404 and 500 handlers for robustness, as discussed earlier.

------

Step 4: Example EJS Template (views/profile.ejs)

If you’re using EJS, here’s how the profile page could look:

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

Step 5: Testing

1. Save .env and app.js in your project root.

2. Create a views/ folder with profile.ejs (and optionally pages/404.ejs, pages/500.ejs).

3. Run the app:

   bash

   ```bash
   node app.js
   ```

4. Visit http://localhost:3000/profile to see the rendered profile.

------

Output with Your .env

- **URL**: /profile

- **Rendered HTML**:

  html

  ```html
  <!DOCTYPE html>
  <html>
  <head>
    <title>Joe Bloggs's Profile</title>
  </head>
  <body>
    <h1>Joe Bloggs's Profile</h1>
    <p>ID: 239482</p>
    <h2>Keys</h2>
    <ul>
      <li>foobar</li>
    </ul>
  </body>
  </html>
  ```

If USER_KEY were "reading,gaming,hiking" in .env, the list would show all three items.

------

Additional Notes

- **Type Handling**: If USER_ID should be a number, use parseInt(process.env.USER_ID) || 239482.
- **Array in .env**: Environment variables are strings. Use a comma-separated list (e.g., USER_KEY="reading,gaming,hiking") and split it in code.
- **No Templating?**: If you don’t want EJS, replace res.render with res.json(user) to return JSON instead.

Let me know if you need further refinements!
