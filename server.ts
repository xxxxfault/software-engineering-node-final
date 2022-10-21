/**
 * @file Implements an Express Node HTTP server.
 */
import UserDao from "./daos/UserDao";
import TuitDao from "./daos/TuitDao";
import UserController from "./controllers/UserController";
import TuitController from "./controllers/TuitController";
import express, {Request, Response} from 'express';
import mongoose from "mongoose";
const cors = require('cors')
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req: Request, res: Response) =>
    res.send('<h1>App Loaded!</h1>'));

const uri = `mongodb+srv://lwang369:${process.env.mongodbpw}@cluster0.xwyngvl.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(uri);

const userDao = new UserDao();
const userController = new UserController(app, userDao);
const tuitDao = new TuitDao();
const tuitController = new TuitController(app, tuitDao);

/**
 * Start a server listening at port 3000 locally
 * but use environment variable PORT on AWS Elastic Beanstalk if available.
 */
const PORT = 3000;
app.listen(process.env.PORT || PORT);
