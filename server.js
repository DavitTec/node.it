const http = require('http');
const port = 3000;

http.createServer((request, response) => {

  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write('<h1>Hello, World!</h1>');
  response.end();

}).listen(port);

console.log(`server simple server on port ${port}`);

// https://zetcode.com/javascript/http/
