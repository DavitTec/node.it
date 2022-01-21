const http = require('http');
const port = 3000;

http.createServer((request, response) => {

  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write('<h1>Hello, World!</h1>');
  response.write('A simple HTML service');
  response.end();

}).listen(port);

console.log(`simple html server on <a href="http://localhost:${port}>Node.it</a>

to Close
  crtl C or close terminal
 `);

// https://zetcode.com/javascript/http/
