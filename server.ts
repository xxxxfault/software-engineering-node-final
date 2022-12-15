/**
 * @file Implements an Express Node HTTP server.
 */
import express, {Request, Response} from 'express';
const app = express();
import dotenv from "dotenv";
dotenv.config();
const session = require('express-session');
import mongoose from "mongoose";


import AuthController from "./controllers/AuthController";
import BookmarkController from "./controllers/BookmarkController";
import DislikeController from "./controllers/DislikeController";
import FollowController from "./controllers/FollowController";
import LikeController from "./controllers/LikeController";
import MessageController from "./controllers/MessageController";
import TuitController from "./controllers/TuitController";
import UserController from "./controllers/UserController";
import {upload} from "./daos/UploadDaos";
import {s3} from "./daos/AwsDaos";

// Sets the Access-Control-Allow-Origin response header to the req origin.
const cors = require('cors')
const corsConfig = {
    credentials: true,
    origin: true,
};
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({extended: false}));


// Configures the session middleware.
let sess = {
    secret: process.env.SECRET,
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        // Enables cross-site delivery between Netlify and Heroku.
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax'
    }
}
// Using default env variable on Heroku
if (process.env.NODE_ENV == 'production') {
    app.set('trust proxy', 1)
    sess.cookie.secure = true
}
app.use(session(sess));

const uri = `mongodb+srv://${process.env.mongodbuser}:${process.env.mongodbpw}@cluster0.xwyngvl.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(uri);

app.get('/', (req: Request, res: Response) =>
    res.send('<h1>App Loaded!</h1>'));

UserController.getInstance(app);
TuitController.getInstance(app, upload, s3);
LikeController.getInstance(app);
DislikeController.getInstance(app);
FollowController.getInstance(app);
BookmarkController.getInstance(app);
MessageController.getInstance(app);
AuthController(app);

/**
 * Starts the server.
 */
const PORT = 4000;
app.listen(process.env.PORT || PORT);
