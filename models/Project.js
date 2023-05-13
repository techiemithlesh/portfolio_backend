const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  technologies: {
    type: [String],
    required: true
  },
  image: {
    type: String
  },
  demoLink: {
    type: String,
    required: true
  },
  githubLink: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
