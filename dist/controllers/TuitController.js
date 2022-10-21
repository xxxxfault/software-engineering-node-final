"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TuitController {
    constructor(app, tuitDao) {
        this.findAllTuits = (req, res) => this.tuitDao.findAllTuits()
            .then(tuits => res.json(tuits));
        this.findTuitById = (req, res) => this.tuitDao.findTuitById(req.params.tid)
            .then(tuit => res.json(tuit));
        this.findTuitsByUser = (req, res) => this.tuitDao.findTuitsByUser(req.params.uid)
            .then(tuits => res.json(tuits));
        this.createTuit = (req, res) => this.tuitDao.createTuit(req.body)
            .then(tuit => res.json(tuit));
        this.updateTuit = (req, res) => this.tuitDao.updateTuit(req.params.tid, req.body)
            .then(status => res.json(status));
        this.deleteTuit = (req, res) => this.tuitDao.deleteTuit(req.params.tid)
            .then(status => res.json(status));
        this.app = app;
        this.tuitDao = tuitDao;
        this.app.get('/tuits', this.findAllTuits);
        this.app.get('/tuits/:tid', this.findTuitById);
        this.app.get('/tuits/:uid/tuits', this.findTuitsByUser);
        this.app.post('/tuits', this.createTuit);
        this.app.delete('/tuits/:tid', this.deleteTuit);
        this.app.put('/tuits/:tid', this.updateTuit);
    }
}
exports.default = TuitController;
//# sourceMappingURL=TuitController.js.map