"use strict";
exports.__esModule = true;
var UserController = /** @class */ (function () {
    function UserController(app, userDao) {
        var _this = this;
        this.findAllUsers = function (req, res) {
            return _this.userDao.findAllUsers()
                .then(function (users) { return res.json(users); });
        };
        this.findUserById = function (req, res) {
            return _this.userDao.findUserById(req.params.userid)
                .then(function (user) { return res.json(user); });
        };
        this.createUser = function (req, res) {
            return _this.userDao.createUser(req.body)
                .then(function (user) { return res.json(user); });
        };
        this.deleteUser = function (req, res) {
            return _this.userDao.deleteUser(req.params.userid)
                .then(function (status) { return res.json(status); });
        };
        this.updateUser = function (req, res) {
            return _this.userDao.updateUser(req.params.userid, req.body)
                .then(function (status) { return res.json(status); });
        };
        this.app = app;
        this.userDao = userDao;
        this.app.get('/users', this.findAllUsers);
        this.app.get('/users/:userid', this.findUserById);
        this.app.post('/users', this.createUser);
        this.app["delete"]('/users/:userid', this.deleteUser);
        this.app.put('/users/:userid', this.updateUser);
    }
    return UserController;
}());
exports["default"] = UserController;
