const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

const User = require('../models/User');

const Joi = require('joi');
// Handle POST requests to /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Handle POST requests to /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    // Temporary Solution for the login system
    // const hash = await bcrypt.hash('12345', 10);
    // user.password = hash;
    // console.log(hash);
    // bcrypt.compare(password, hash, function(err, result) {
    //   if (err) { throw (err); }
    //   console.log(result);
    //  });

  //end the temporary solution for the login system


    if (user) {
      const isPasswordMatch = bcrypt.compareSync(password, user.password);
      if (isPasswordMatch) {
        res.send({ message: "User Login Successfully!", user });
      } else {
        res.send({ message: "Password Didn't Matched" });
      }
    } else {
      res.send({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});



module.exports = router;
