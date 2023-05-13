const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');



router.post('/register', async (req,res) => {
    try {
        console.log(req.body); // add this line to check req.body contents
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({
            ...req.body,
            password: hash,
        });
        await newUser.save();
        res.status(201).send({message:"User has been created"});
    } catch (error) {
        res.status(500).send({message:error.message});
    }
});



router.post('/login', async (req,res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(404).send("user not found");

        const isCorrect = bcrypt.compareSync(req.body.password, user.password);
        if(!isCorrect) return res.status(400).send("wrong");

        res.status(200).send({message:"user loged in",user})
    } catch (error) {
        res.status(500).send("something went wrong");
    }
})

module.exports = router;
