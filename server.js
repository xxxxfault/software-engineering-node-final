"use strict";
exports.__esModule = true;
/**
 * @file Implements an Express Node HTTP server.
 */
var UserDao_1 = require("./daos/UserDao");
var TuitDao_1 = require("./daos/TuitDao");
var UserController_1 = require("./controllers/UserController");
var TuitController_1 = require("./controllers/TuitController");
var express_1 = require("express");
var mongoose_1 = require("mongoose");
var cors = require('cors');
var app = (0, express_1["default"])();
app.use(cors());
app.use(express_1["default"].json());
var options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
};
mongoose_1["default"].connect('mongodb://localhost:27017/tuiter', options);
app.get('/', function (req, res) {
    return res.send('Welcome to Foundation of Software Engineering!!!!');
});
app.get('/hello', function (req, res) {
    return res.send('Welcome to Foundation of Software Engineering!');
});
var userDao = new UserDao_1["default"]();
var userController = new UserController_1["default"](app, userDao);
var tuitDao = new TuitDao_1["default"]();
var tuitController = new TuitController_1["default"](app, tuitDao);
/**
 * Start a server listening at port 4000 locally
 * but use environment variable PORT on Heroku if available.
 */
var PORT = 4000;
app.listen(process.env.PORT || PORT);
