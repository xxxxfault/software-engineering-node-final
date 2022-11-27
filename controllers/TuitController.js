"use strict";
exports.__esModule = true;
var TuitController = /** @class */ (function () {
    function TuitController(app, tuitDao) {
        var _this = this;
        this.findAllTuits = function (req, res) {
            return _this.tuitDao.findAllTuits()
                .then(function (tuits) { return res.json(tuits); });
        };
        this.findTuitById = function (req, res) {
            return _this.tuitDao.findTuitById(req.params.tid)
                .then(function (tuit) { return res.json(tuit); });
        };
        this.findTuitsByUser = function (req, res) {
            return _this.tuitDao.findTuitsByUser(req.params.uid)
                .then(function (tuits) { return res.json(tuits); });
        };
        this.createTuit = function (req, res) {
            return _this.tuitDao.createTuit(req.body)
                .then(function (tuit) { return res.json(tuit); });
        };
        this.updateTuit = function (req, res) {
            return _this.tuitDao.updateTuit(req.params.tid, req.body)
                .then(function (status) { return res.json(status); });
        };
        this.deleteTuit = function (req, res) {
            return _this.tuitDao.deleteTuit(req.params.tid)
                .then(function (status) { return res.json(status); });
        };
        this.app = app;
        this.tuitDao = tuitDao;
        this.app.get('/tuits', this.findAllTuits);
        this.app.get('/tuits/:tid', this.findTuitById);
        this.app.get('/tuits/:uid/tuits', this.findTuitsByUser);
        this.app.post('/tuits', this.createTuit);
        this.app["delete"]('/tuits/:tid', this.deleteTuit);
        this.app.put('/tuits/:tid', this.updateTuit);
    }
    return TuitController;
}());
exports["default"] = TuitController;
