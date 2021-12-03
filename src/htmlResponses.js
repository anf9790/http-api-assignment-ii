// Pull in the file system module.
const fs = require('fs');

// Load files into memory (synchronous operation, should only be done on startup).
// **This not the best way to load files unless you have few files.**
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

// Get the index page
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

// Get the css page
const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

// Set out public exports
module.exports = {
  getIndex,
  getCSS,
};
