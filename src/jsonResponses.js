// Note this object is purely in memory (nothing will stay forever). 
// when node shuts down this will be cleared. Same when the heroku app shuts down from inactivity.
const users = {};

// Respond with a JSON object
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// Respond without a JSON body
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// Return user object as JSON
const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };

  respondJSON(request, response, 200, responseJSON);
};

// Get meta info about user object.
const getUsersMeta = (request, response) => {
    respondJSONMeta(request, response, 200);
}

// Add a user from a POST body.
const addUser = (request, response, body) => {
  // Default json message.
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  // Check to make sure we have both fields
  if (!body.name || !body.age) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // Default status code to 201 created
  let responseCode = 201;

  // If that user's name already exists in our object, then switch to a 204 updated status.
  if (users[body.name]) {
    responseCode = 204;
  } else {
    // Else create an object with that name.
    users[body.name] = {};
  }

  // Add or update fields for this user name.
  users[body.name].name = body.name;
  users[body.name].age = body.age;

  // If response is created, then set our created message and sent response with a message.
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  // 204 has an empty payload, just a success. It cannot have a body, so we just send a 204 without a message
  return respondJSONMeta(request, response, responseCode);
};

// Returns a 404 not found request with message.
const notFound = (request, response) => {
  // Create an error message for the response.
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  // Return a 404 with an error message
  respondJSON(request, response, 404, responseJSON);
}

// Returns a 404 not found without message.
const notFoundMeta = (request, response) => {
    respondJSONMeta(request, response, 404);
}

// Public Exports
module.exports = {
  getUsers,
  getUsersMeta,
  addUser,
  notFound,
  notFoundMeta,
};