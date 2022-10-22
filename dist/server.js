"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file Implements an Express Node HTTP server.
 */
const LikeDao_1 = __importDefault(require("./daos/LikeDao"));
const UserDao_1 = __importDefault(require("./daos/UserDao"));
const TuitDao_1 = __importDefault(require("./daos/TuitDao"));
const LikeController_1 = __importDefault(require("./controllers/LikeController"));
const UserController_1 = __importDefault(require("./controllers/UserController"));
const TuitController_1 = __importDefault(require("./controllers/TuitController"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const FollowDao_1 = __importDefault(require("./daos/FollowDao"));
const FollowController_1 = __importDefault(require("./controllers/FollowController"));
const BookmarkDao_1 = __importDefault(require("./daos/BookmarkDao"));
const BookmarkController_1 = __importDefault(require("./controllers/BookmarkController"));
const MessageDao_1 = __importDefault(require("./daos/MessageDao"));
const MessageController_1 = __importDefault(require("./controllers/MessageController"));
const cors = require('cors');
const app = (0, express_1.default)();
app.use(cors());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.get('/', (req, res) => res.send('<h1>App Loaded!</h1>'));
const uri = `mongodb+srv://lwang369:${process.env.mongodbpw}@cluster0.xwyngvl.mongodb.net/?retryWrites=true&w=majority`;
mongoose_1.default.connect(uri);
const userDao = UserDao_1.default.getInstance();
const userController = UserController_1.default.getInstance(app);
const tuitDao = TuitDao_1.default.getInstance();
const tuitController = TuitController_1.default.getInstance(app);
const likeDao = LikeDao_1.default.getInstance();
const likeController = LikeController_1.default.getInstance(app);
const followDao = FollowDao_1.default.getInstance();
const followController = FollowController_1.default.getInstance(app);
const bookmarkDao = BookmarkDao_1.default.getInstance();
const bookmarkController = BookmarkController_1.default.getInstance(app);
const messageDao = MessageDao_1.default.getInstance();
const messageController = MessageController_1.default.getInstance(app);
/**
 * Start a server listening at port 3000 locally
 * but use environment variable PORT on AWS Elastic Beanstalk if available.
 */
const PORT = 4000;
app.listen(process.env.PORT || PORT);
//# sourceMappingURL=server.js.map