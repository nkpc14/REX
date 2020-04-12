const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const multer = require('./fileStorage');
const cors = require('cors');
const nervesAuth = require('./auth/nervesAuth/auth');
//Routes import
const userRoute = require('./App/routes/UserRoutes');
const postRoute = require('./App/routes/postRoutes');
const googleAuthRoutes = require('./auth/google/routes');

var whitelist = ['*','http://localhost:8080','http://localhost:3000'];
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
};


//request filters
const app = express();
// app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(morgan('dev'));
app.use(express.static('frontend'));
app.use('/auth', nervesAuth);
app.use('/auth', googleAuthRoutes);
app.use('/user', userRoute);
app.use('/post', postRoute);

app.use('', (req, res, next) => {
    res.write("<h1>Welcome to home Page</h1>");
    res.end();
});


//Error Handing Middleware

//Server error
// app.use('/500', (req, res, next) => {
//     res.json("Internal Error Occurred");
// });
//
// // //Page not found error
// // app.use((req, res, next) => {
// //
// // });
//
// //Global error handler
// app.use((error, req, res, next) => {
//     // return res.status(500).json({errors: {serverError: "Internal Server Error"}});
// });


mongoose.connect('mongodb://localhost:27017/REX', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        const server = app.listen(8000);
        console.log("Server Started at http://localhost:" + 8000);
    }).catch((err) => {
    console.log("Error in Connection with MongoDB");
});