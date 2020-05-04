import express from 'express';
import {
    json,
    urlencoded
} from 'body-parser';
import helmet from 'helmet';
import path from 'path';
import morgan from 'morgan';
import {
    connect
} from 'mongoose';
import passport from 'passport';
import multer from './fileStorage';
import cors from 'cors';
import nervesAuth, {
    isAuthenticated
} from './auth/nervesAuth/auth';
//Routes import
import userRoute from './App/routes/UserRoutes';
import postRoute from './App/routes/postRoutes';
import googleAuthRoutes from './auth/google/routes';
import SocketIdManager from './Server/Sockets/Socket'


const whitelist = ['http://localhost:8080', 'http://localhost:8000'];
const corsOptions = {
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
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
app.use(json());
app.use(urlencoded({
    extended: true
}));
app.use(passport.initialize());
app.use(morgan('dev'));
app.use(express.static('frontend'));
app.use('/profile', express.static('images/user_profile'));
app.use('/auth', cors(corsOptions), googleAuthRoutes);
app.use('/auth', cors(corsOptions), nervesAuth);
app.use(cors(corsOptions), isAuthenticated);
app.use('/user', cors(corsOptions), userRoute);
app.use('/post', cors(corsOptions), postRoute);

app.use('', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

connect('mongodb://localhost:27017/REX', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        const server = app.listen(8000);
        const io = require('./Server/Sockets/socket-init').init(server);
        const socket = new SocketIdManager(io);
        socket.onConnect();
        console.log("Server Started at http://localhost:" + 80);
    }).catch((err) => {
    console.log(err);
    console.log("Error in Connection with MongoDB");
});