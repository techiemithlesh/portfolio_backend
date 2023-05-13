const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Project = require('../models/Project');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const sharp = require('sharp');
// set up multer storage


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
});

const upload = multer({ storage: storage });


// CREATE a project

router.post('/', upload.single('image'), async (req,res) => {
    try {
        const newProject = new Project({
            title: req.body.title,
            description: req.body.description,
            technologies: req.body.technologies,
            demoLink: req.body.demoLink,
            githubLink: req.body.githubLink
        });

        // Resize image before saving
        if (req.file) {
            const imagePath = req.file.path;
            const resizedImage = await sharp(imagePath)
                .resize(800, 600) // Change the dimensions as per your requirement
                .toBuffer();
            await sharp(resizedImage).toFile(imagePath);
            newProject.image = req.file.filename;
        }

        await newProject.save();

        res.status(201).json(newProject);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// READ all projects
router.get('/', async (req,res) => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// READ a single project
router.get('/:id', getProject, (req, res) => {
    res.json(res.project);
});

// UPDATE a project
router.patch('/:id', upload.single('image'), getProject, async (req,res) => {
    if (req.body.title != null) {
        res.project.title = req.body.title;
    }
    if (req.body.description != null) {
        res.project.description = req.body.description;
    }
    if (req.body.technologies != null) {
        res.project.technologies = req.body.technologies;
    }
    if (req.file) {
        res.project.image = req.file.filename;
    }
    if (req.body.demoLink != null) {
        res.project.demoLink = req.body.demoLink;
    }
    if (req.body.githubLink != null) {
        res.project.githubLink = req.body.githubLink;
    }
    try {
        const updatedProject = await res.project.save();
        res.json(updatedProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a project
router.delete('/:id', async (req, res) => {
    try {
      const project = await Project.findByIdAndDelete(req.params.id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      res.json({ message: 'Project deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


async function getProject(req, res, next ) {
    try {
        const project = await Project.findOne({ _id: new ObjectId(req.params.id) });
        if (project == null) {
            return res.status(404).json({message: 'Can not find Project'})
        }
        res.project = project;
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message }); 
    }
}

module.exports = router;
