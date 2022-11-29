/**
 * @file Implements an Express Node HTTP server.
 */
import express, {Request, Response} from 'express';
const app = express();
import AWS from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();
const session = require('express-session');
import mongoose from "mongoose";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";

import AuthController from "./controllers/AuthController";
import BookmarkController from "./controllers/BookmarkController";
import DislikeController from "./controllers/DislikeController";
import FollowController from "./controllers/FollowController";
import LikeController from "./controllers/LikeController";
import MessageController from "./controllers/MessageController";
import TuitController from "./controllers/TuitController";
import UserController from "./controllers/UserController";

// Sets the Access-Control-Allow-Origin response header to the req origin.
const cors = require('cors')
const corsConfig = {
    credentials: true,
    origin: true,
};
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Configures and connects to AWS S3 image storage.
export const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_KEY_ID,
    secretAccessKey: process.env.AWS_S3_KEY,
    region: process.env.AWS_REGION
});

// Configures the Multer middleware for receiving images on server and storing in the S3 bucket.
const upload = multer({
    // Indicates S3 bucket as the storage location to Multer.
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,

        // Auto-detects file content type.
        contentType: multerS3.AUTO_CONTENT_TYPE,

        // Uses form field name as file metadata.
        metadata: function(req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        // Generates a time-based file key.
        key: function(req, file, cb) {
            cb(null, new Date().toISOString() + '-' + file.originalname);
        }
    }),
    // Filters for .jpeg, .jpg, .png files.
    fileFilter: function(req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const extnameIsValid = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetypeIsValid = filetypes.test(file.mimetype);
        if (extnameIsValid && mimetypeIsValid) {
            return cb(null, true);
        } else {
            cb("Error: Allow images only of extensions jpeg|jpg|png !");
        }
    }
});

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
TuitController.getInstance(app, upload);
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
