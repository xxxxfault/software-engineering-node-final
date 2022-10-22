/**
 * @file Implements an Express Node HTTP server.
 */
import LikeDao from "./daos/LikeDao";
import UserDao from "./daos/UserDao";
import TuitDao from "./daos/TuitDao";
import LikeController from "./controllers/LikeController";
import UserController from "./controllers/UserController";
import TuitController from "./controllers/TuitController";
import express, {Request, Response} from 'express';
import mongoose from "mongoose";
import FollowDao from "./daos/FollowDao";
import FollowController from "./controllers/FollowController";
import BookmarkDao from "./daos/BookmarkDao";
import BookmarkController from "./controllers/BookmarkController";
import MessageDao from "./daos/MessageDao";
import MessageController from "./controllers/MessageController";
const cors = require('cors')
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req: Request, res: Response) =>
    res.send('<h1>App Loaded!</h1>'));

const uri = `mongodb+srv://lwang369:${process.env.mongodbpw}@cluster0.xwyngvl.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(uri);

const userDao = UserDao.getInstance();
const userController = UserController.getInstance(app);
const tuitDao = TuitDao.getInstance();
const tuitController = TuitController.getInstance(app);
const likeDao = LikeDao.getInstance();
const likeController = LikeController.getInstance(app);
const followDao = FollowDao.getInstance();
const followController = FollowController.getInstance(app);
const bookmarkDao = BookmarkDao.getInstance();
const bookmarkController = BookmarkController.getInstance(app);
const messageDao = MessageDao.getInstance();
const messageController = MessageController.getInstance(app);

/**
 * Start a server listening at port 3000 locally
 * but use environment variable PORT on AWS Elastic Beanstalk if available.
 */
const PORT = 4000;
app.listen(process.env.PORT || PORT);
