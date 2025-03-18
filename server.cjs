const http = require("http");
const hostname = "localhost";
const port = 3000;

http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("<h1>Hello, World!</h1>");
    res.write("A simple HTML service");
    res.end();
  })
  .listen(port);

console.log(`simple html server on http://${hostname}:${port}/;

to Close crtl C or close terminal`);
