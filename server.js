const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const contactRouter = require('./routes/contacts');
const projectRouter = require('./routes/projects');
const userRouter = require('./routes/auth');
const verifyTokenRoute = require('./routes/verifyToken');
// const sendMailRouter = require('./routes/sendEmail');
const db = require('./database/db');
const cors = require('cors');
const path = require('path')
const app = express();

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// allow cors
app.use(cors());

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'client', 'build')));

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
//   });


// Parse incoming request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.use('/api/contact', contactRouter);
app.use('/api/projects', projectRouter);
app.use('/api/auth', userRouter);
app.use('/api/auth/verify', verifyTokenRoute);
// add message send functionality form dashboard
// app.use('/api/contact/send', sendMailRouter);
const port = process.env.PORT || 7000;

app.listen(port, ()=>{
    console.log(`Server is listening at port ${port}...`);
});