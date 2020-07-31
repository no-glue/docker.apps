// a sample NodeJs app
var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  process.env.MESSAGE++;
  res.end(`<h1>${process.env.MESSAGE}</h1>`);
}).listen(8080);
