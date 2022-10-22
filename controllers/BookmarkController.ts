/**
 * @file Controller RESTful Web service API for bookmarks resource
 */
import BookmarkDao from "../daos/BookmarkDao";
import Bookmark from "../models/bookmarks/Bookmarks";
import {Express, Request, Response} from "express";
import BookmarkControllerI from "../interfaces/BookmarkController";
import Tuit from "../models/tuits/Tuit";
import User from "../models/users/User";

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
export default class BookmarkController implements BookmarkControllerI {
    private static bookmarkDao: BookmarkDao = BookmarkDao.getInstance();
    private static bookmarkController: BookmarkController | null = null;

    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return BookmarkController
     */
    public static getInstance = (app: Express): BookmarkController => {
        if(BookmarkController.bookmarkController === null) {
            BookmarkController.bookmarkController = new BookmarkController();
            app.post("/api/users/:uid/bookmarks/:tid",
                BookmarkController.bookmarkController.createBookmarkByUsers);
            app.delete("/api/users/:uid/bookmarks/:tid",
                BookmarkController.bookmarkController.deleteBookmark);
            app.get("/api/users/:uid/bookmarks",
                BookmarkController.bookmarkController.findAllBookmarkedTuitsByUser);
            app.get("/api/users/:uid1/viewed/:uid2/bookmarks",
                BookmarkController.bookmarkController.findAllBookmarkedTuitsByViewedUser);
            app.get("/api/tuit/:tid/bookmarkedusers",
                BookmarkController.bookmarkController.findAllUsersByTuitBookmarks);
        }
        return BookmarkController.bookmarkController;
    }
    private constructor() {}

    /**
     * @param {Request} req Represents request from client, including path params uid and tid
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new bookmark that was inserted in the
     * database
     */
    createBookmarkByUsers = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.createBookmarkByUsers(req.params.uid, req.params.tid)
            .then((bookmark: Bookmark) => res.json(bookmark));

    /**
     * @param {Request} req Represents request from client, including path params uid and tid
     * @param {Response} res Represents response to client, including status
     * on whether deleting a follow was successful or not
     */
    deleteBookmark = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.deleteBookmark(req.params.uid, req.params.tid)
            .then((status) => res.send(status));

    /**
     * Retrieves all tuits bookmarkded by a given user from the database and returns an array of tuits.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects
     */
    findAllBookmarkedTuitsByUser = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.findAllBookmarkedTuitsByUser(req.params.uid)
            .then((tuits: Tuit[]) => res.json(tuits));

    /**
     * Retrieves all tuits bookmarkded by a viewed user from the database and returns an array of tuits.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects
     */
    findAllBookmarkedTuitsByViewedUser = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.findAllBookmarkedTuitsByViewedUser(req.params.uid2)
            .then((tuits: Tuit[]) => res.json(tuits));

    /**
     * Retrieves all users that bookmarked given tuit from the database and returns an array of users.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllUsersByTuitBookmarks = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.findAllUsersByTuitBookmarks(req.params.tid)
            .then((users: User[]) => res.json(users));
};