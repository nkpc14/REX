import express from 'express';
import { json, urlencoded } from 'body-parser';
import helmet from 'helmet';
import path from 'path';
import morgan from 'morgan';
import { connect } from 'mongoose';
import passport from 'passport';
import multer from './fileStorage';
import cors from 'cors';
import nervesAuth from './auth/nervesAuth/auth';
//Routes import
import userRoute from './App/routes/UserRoutes';
import postRoute from './App/routes/postRoutes';
import googleAuthRoutes from './auth/google/routes';

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
app.use(json());
app.use(urlencoded({extended: true}));
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


connect('mongodb://localhost:27017/REX', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        const server = app.listen(8000);
        console.log("Server Started at http://localhost:" + 8000);
    }).catch((err) => {
    console.log("Error in Connection with MongoDB");
});