const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for our authenticated routes
  authMiddleware: function ({ req }) {
    // allows token to be sent via req.query or headers
    let token = req.query.token || req.headers.authorization;
    
    console.log('Request Headers:', req.headers);
    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }
    console.log('Received token:', token);
    if (!token) {
      throw new Error('Missing authentication token');
    }
    
    // verify token and get user data out of it
    try {
      const { username, email, _id } = jwt.verify(token, secret, { maxAge: expiration });
      console.log('Decoded User Data:', { username, email, _id });
      return { username, email, _id };
    } catch (err) {
      throw new Error('Invalid authentication token');
    }
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign(payload, secret, { expiresIn: expiration });
  },
};