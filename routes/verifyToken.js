const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Define a route to verify the token
router.post('/', (req, res) => {
  const token = req.body.token;
  
  if (!token) {
    return res.status(401).send({ message: 'No token provided' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Failed to authenticate token' });
    }
    
    // Token is valid, return the decoded token
    res.status(200).send(decoded);
  });
});

module.exports = router;
