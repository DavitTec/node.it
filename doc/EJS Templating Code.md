# EJS Template engine

> Summary:  Explain  template engine like EJS and its advantages with example from using HTML embedded code

A **templating engine** like EJS (Embedded JavaScript) allows you to generate dynamic HTML by embedding JavaScript directly into your HTML templates. Unlike static HTML, where content is fixed, a templating engine lets you insert variables, loops, conditionals, and logic into your pages, making them reusable and easier to maintain. EJS is particularly popular with Express.js because it’s lightweight, simple to learn, and integrates seamlessly with Node.js.

How EJS Works

EJS files (.ejs) look like HTML but include special tags that execute JavaScript:

- <% %> for logic (e.g., loops, conditionals).
- <%= %> to output escaped values (prevents XSS by escaping HTML characters).
- <%- %> to output unescaped HTML (useful for rendering raw HTML).

The templating engine processes these tags on the server, replacing them with actual data before sending the final HTML to the client.

------

Advantages of EJS Over Plain HTML with Embedded Code

1. **Dynamic Content**: Easily insert data (e.g., user names, lists) without manually concatenating HTML strings.
2. **Reusability**: Create layouts or partials (e.g., headers, footers) that can be reused across pages.
3. **Cleaner Code**: Separates logic from presentation, avoiding messy inline JavaScript in HTML.
4. **Server-Side Rendering**: Generates HTML on the server, improving SEO and initial load times compared to client-side rendering.
5. **Simplicity**: Uses familiar JavaScript syntax, so there’s no steep learning curve.

------

Example: Plain HTML vs. EJS

Scenario

Imagine you’re building a simple user profile page that displays a user’s name, age, and a list of hobbies.

------

Plain HTML with Embedded Code (No Templating Engine)

In this approach, you’d manually build HTML strings in your Node.js/Express app:

javascript

```javascript
const express = require('express');
const app = express();

app.get('/profile', (req, res) => {
  const user = {
    name: 'Alice',
    age: 25,
    hobbies: ['reading', 'gaming', 'hiking']
  };

  // Manually construct HTML
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>User Profile</title>
    </head>
    <body>
      <h1>${user.name}'s Profile</h1>
      <p>Age: ${user.age}</p>
      <h2>Hobbies</h2>
      <ul>
  `;

  // Loop through hobbies
  user.hobbies.forEach(hobby => {
    html += `<li>${hobby}</li>`;
  });

  html += `
      </ul>
    </body>
    </html>
  `;

  res.send(html);
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

**Problems with This Approach**:

- **Messy Code**: Mixing HTML and JavaScript logic in strings is hard to read and maintain.
- **Error-Prone**: Forgetting to close tags or misplacing quotes can break the page.
- **No Reusability**: You’d have to rewrite this for every route or page.
- **Hard to Style**: Adding consistent CSS across pages becomes cumbersome.

------

Using EJS Templating Engine

Now, let’s rewrite this with EJS:

1. **Install EJS**:

   bash

   ```bash
   npm install ejs
   ```

2. **Folder Structure**:

   ```text
   project/
   ├── views/
   │   └── profile.ejs
   ├── app.js
   └── package.json
   ```

3. **Express Setup (app.js)**:

   javascript

   ```javascript
   const express = require('express');
   const path = require('path');
   const app = express();
   
   // Set up EJS as the view engine
   app.set('views', path.join(__dirname, 'views'));
   app.set('view engine', 'ejs');
   
   app.get('/profile', (req, res) => {
     const user = {
       name: 'Alice',
       age: 25,
       hobbies: ['reading', 'gaming', 'hiking']
     };
     // Render the EJS template with user data
     res.render('profile', { user });
   });
   
   app.listen(3000, () => console.log('Server running on port 3000'));
   ```

4. **EJS Template (views/profile.ejs)**:

   html

   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <title><%= user.name %>'s Profile</title>
   </head>
   <body>
     <h1><%= user.name %>'s Profile</h1>
     <p>Age: <%= user.age %></p>
     <h2>Hobbies</h2>
     <ul>
       <% user.hobbies.forEach(hobby => { %>
         <li><%= hobby %></li>
       <% }); %>
     </ul>
   </body>
   </html>
   ```

**Output HTML (Sent to Client)**:

html

```html
<!DOCTYPE html>
<html>
<head>
  <title>Alice's Profile</title>
</head>
<body>
  <h1>Alice's Profile</h1>
  <p>Age: 25</p>
  <h2>Hobbies</h2>
  <ul>
    <li>reading</li>
    <li>gaming</li>
    <li>hiking</li>
  </ul>
</body>
</html>
```

------

Advantages Demonstrated in the EJS Example

1. **Dynamic Content**: <%= user.name %> and the forEach loop dynamically insert data without string concatenation.

2. **Separation of Concerns**: Logic stays in app.js, while presentation lives in profile.ejs.

3. **Readability**: The template looks like HTML with minimal JavaScript, making it easier to edit and debug.

4. **Reusability**: You could add a header/footer by using EJS’s <%- include('header') %> syntax if you had a header.ejs file.

5. **Scalability**: Adding more features (e.g., conditional rendering) is straightforward:

   html

   ```html
   <% if (user.age >= 18) { %>
     <p>Adult</p>
   <% } else { %>
     <p>Minor</p>
   <% } %>
   ```

------

When to Use EJS

- **Small to Medium Projects**: It’s lightweight and doesn’t require a complex setup.
- **Server-Side Rendering**: Ideal when you want the server to generate HTML (e.g., for SEO).
- **Teams Familiar with JS**: Its JavaScript syntax is intuitive for developers already using Node.js.

Alternatives

- **Handlebars**: More restrictive but safer (no raw JS logic).
- **Pug**: More concise syntax but less HTML-like.
- **React/Vue**: Better for client-side rendering in larger apps.

EJS strikes a balance between simplicity and power, making it a great choice for your error pages or small dynamic sites! Let me know if you’d like more examples or help integrating it with your error-handling code.
