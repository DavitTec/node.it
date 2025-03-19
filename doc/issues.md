# ISSUE



- [Issue 002 - error with ENV](#Issue-002) 



### Issue 001  {#001}

### Issue 004

### Issue 003

## Issue 002

Your .env file and app.js snippet are close, but there are a couple of issues to address for robustness and correctness. Let’s refine them.

------

Issues and Fixes

## 

.env File

Your .env file has a trailing comma after "reading,gaming,hiking", which is invalid syntax. The .env format doesn’t support trailing commas like JavaScript objects do. Here’s the corrected version:

.env

```text
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



