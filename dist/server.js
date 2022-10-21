"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file Implements an Express Node HTTP server.
 */
const UserDao_1 = __importDefault(require("./daos/UserDao"));
const TuitDao_1 = __importDefault(require("./daos/TuitDao"));
const UserController_1 = __importDefault(require("./controllers/UserController"));
const TuitController_1 = __importDefault(require("./controllers/TuitController"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors = require('cors');
const app = (0, express_1.default)();
app.use(cors());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.get('/', (req, res) => res.send('<h1>App Loaded!</h1>'));
const uri = `mongodb+srv://lwang369:${process.env.mongodbpw}@cluster0.xwyngvl.mongodb.net/?retryWrites=true&w=majority`;
mongoose_1.default.connect(uri);
const userDao = new UserDao_1.default();
const userController = new UserController_1.default(app, userDao);
const tuitDao = new TuitDao_1.default();
const tuitController = new TuitController_1.default(app, tuitDao);
/**
 * Start a server listening at port 3000 locally
 * but use environment variable PORT on AWS Elastic Beanstalk if available.
 */
const PORT = 3000;
app.listen(process.env.PORT || PORT);
//# sourceMappingURL=server.js.map