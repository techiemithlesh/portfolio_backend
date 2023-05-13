const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { default: mongoose } = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


// GET ALL CONTACTS
router.get('/', async (req,res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
})

// POST CONTACT
router.post('/', async (req,res) => {
    try {
        const newContact = await Contact.create({
            name: req.body.name,
            email: req.body.email,
            message: req.body.message
        });
        res.status(201).json(newContact);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

// GET SINGLE CONTACT

router.get('/:id', getContact, (req, res) => {
    res.json(res.contact);
})


// Delete a contact

  
router.delete('/:id', async (req, res) => {
    try {
      const contact = await Contact.findByIdAndDelete(req.params.id);
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  


async function getContact(req, res, next ) {
    try {
        const contact = await Contact.findOne({ _id: new ObjectId(req.params.id) });
        if (contact == null) {
            return res.status(404).json({message: 'Can not find Contact'})
        }
        res.contact = contact;
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message }); 
    }
}





module.exports = router;
