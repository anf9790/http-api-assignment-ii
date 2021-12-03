// Http module
const http = require('http');
// Url module for parsing url string.
const url = require('url');
// Querystring module for parsing querystrings from url.
const query = require('querystring');
// Custom Files
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Handles HEAD requests
const handleHead = (request, response, parsedUrl) => {
  // Route to correct method based on url.
  if (parsedUrl.pathname === '/getUsers') {
    jsonHandler.getUsersMeta(request, response);
  } else if (parsedUrl.pathname === '/notReal') {
    jsonHandler.notFoundMeta(request, response);
  } else {
    jsonHandler.notFoundMeta(request, response);
  }
};

// Handles POST requests
const handlePost = (request, response, parsedUrl) => {
  // If POST is to /addUser (still our only post request).
  if (parsedUrl.pathname === '/addUser') {
    const res = response;

    // Uploads come in as a byte stream that we need to reassemble once it's all arrived.
    const body = [];

    // If the upload stream sends an error, just throw a bad request and send it back.
    request.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    // Adding each byte of data from from the upload to the byte array.
    request.on('data', (chunk) => {
      body.push(chunk);
    });

    // On end of upload stream.
    request.on('end', () => {
      // Combine our byte array and convert it to a string value (in this instance).
      const bodyString = Buffer.concat(body).toString();
      // Parse the string into an object by field name.
      const bodyParams = query.parse(bodyString);

      // Pass to our addUser function.
      jsonHandler.addUser(request, res, bodyParams);
    });
  }
};

// Handles GET requests
const handleGet = (request, response, parsedUrl) => {
  // Route to correct method based on url.
  if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/getUsers') {
    jsonHandler.getUsers(request, response);
  } else if (parsedUrl.pathname === '/') {
    htmlHandler.getIndex(request, response);
  } else if (parsedUrl.pathname === '/notFound') {
    jsonHandler.notFound(request, response);
  } else {
    jsonHandler.notFound(request, response);
  }
};

// Determines the type of tequest and sends it to the proper location.
const onRequest = (request, response) => {
  // Splitting parse url into individual parts and return an object of those parts by name.
  const parsedUrl = url.parse(request.url);

  // Check if method was HEAD, POST, or GET (the default)
  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else if (request.method === 'HEAD') {
    handleHead(request, response, parsedUrl);
  } else {
    handleGet(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
