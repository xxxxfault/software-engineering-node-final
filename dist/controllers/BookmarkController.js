"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file Controller RESTful Web service API for bookmarks resource
 */
const BookmarkDao_1 = __importDefault(require("../daos/BookmarkDao"));
/**
 * @class BookmarkController Implements RESTful Web service API for bookmarks resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>POST /api/users/:uid/bookmarks/:tid to create a new bookmark instance given user and tuit</li>
 *     <li>DELETE /api/users/:uid/bookmarks/:tid to remove a particular bookmark instance</li>
 *     <li>GET /api/users/:uid/bookmarks to retrieve all tuits bookmarked by given user</li>
 *     <li>GET /api/users/:uid1/viewed/:uid2/bookmarks to retrieve all tuits bookmarked by viewed user</li>
 *     <li>GET /api/tuit/:tid/bookmarkedusers to retrieve all users that bookmarked a given tuit</li>
 * </ul>
 * @property {BookmarkDao} bookmarkDao Singleton DAO implementing bookmark CRUD operations
 * @property {BookmarkController} bookmarkController Singleton controller implementing
 * RESTful Web service API
 */
class BookmarkController {
    constructor() {
        /**
         * @param {Request} req Represents request from client, including path params uid and tid
         * @param {Response} res Represents response to client, including the
         * body formatted as JSON containing the new bookmark that was inserted in the
         * database
         */
        this.createBookmarkByUsers = (req, res) => BookmarkController.bookmarkDao.createBookmarkByUsers(req.params.uid, req.params.tid)
            .then((bookmark) => res.json(bookmark));
        /**
         * @param {Request} req Represents request from client, including path params uid and tid
         * @param {Response} res Represents response to client, including status
         * on whether deleting a follow was successful or not
         */
        this.deleteBookmark = (req, res) => BookmarkController.bookmarkDao.deleteBookmark(req.params.uid, req.params.tid)
            .then((status) => res.send(status));
        /**
         * Retrieves all tuits bookmarkded by a given user from the database and returns an array of tuits.
         * @param {Request} req Represents request from client
         * @param {Response} res Represents response to client, including the
         * body formatted as JSON arrays containing the tuit objects
         */
        this.findAllBookmarkedTuitsByUser = (req, res) => BookmarkController.bookmarkDao.findAllBookmarkedTuitsByUser(req.params.uid)
            .then((tuits) => res.json(tuits));
        /**
         * Retrieves all tuits bookmarkded by a viewed user from the database and returns an array of tuits.
         * @param {Request} req Represents request from client
         * @param {Response} res Represents response to client, including the
         * body formatted as JSON arrays containing the tuit objects
         */
        this.findAllBookmarkedTuitsByViewedUser = (req, res) => BookmarkController.bookmarkDao.findAllBookmarkedTuitsByViewedUser(req.params.uid2)
            .then((tuits) => res.json(tuits));
        /**
         * Retrieves all users that bookmarked given tuit from the database and returns an array of users.
         * @param {Request} req Represents request from client
         * @param {Response} res Represents response to client, including the
         * body formatted as JSON arrays containing the user objects
         */
        this.findAllUsersByTuitBookmarks = (req, res) => BookmarkController.bookmarkDao.findAllUsersByTuitBookmarks(req.params.tid)
            .then((users) => res.json(users));
    }
}
exports.default = BookmarkController;
BookmarkController.bookmarkDao = BookmarkDao_1.default.getInstance();
BookmarkController.bookmarkController = null;
/**
 * Creates singleton controller instance
 * @param {Express} app Express instance to declare the RESTful Web service
 * API
 * @return BookmarkController
 */
BookmarkController.getInstance = (app) => {
    if (BookmarkController.bookmarkController === null) {
        BookmarkController.bookmarkController = new BookmarkController();
        app.post("/api/users/:uid/bookmarks/:tid", BookmarkController.bookmarkController.createBookmarkByUsers);
        app.delete("/api/users/:uid/bookmarks/:tid", BookmarkController.bookmarkController.deleteBookmark);
        app.get("/api/users/:uid/bookmarks", BookmarkController.bookmarkController.findAllBookmarkedTuitsByUser);
        app.get("/api/users/:uid1/viewed/:uid2/bookmarks", BookmarkController.bookmarkController.findAllBookmarkedTuitsByViewedUser);
        app.get("/api/tuit/:tid/bookmarkedusers", BookmarkController.bookmarkController.findAllUsersByTuitBookmarks);
    }
    return BookmarkController.bookmarkController;
};
;
//# sourceMappingURL=BookmarkController.js.map