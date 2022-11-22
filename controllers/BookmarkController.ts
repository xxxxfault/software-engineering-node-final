/**
 * @file Controller RESTful Web service API for Bookmarks resource
 */
import { Express, Request, Response } from "express";
import BookmarkDao from "../daos/BookmarkDao";
import BookmarkControllerI from "../interfaces/BookmarkControllerI";

/**
 * @class BookmarkController Implements RESTful Web service API for Bookmarks resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>POST /api/users/:uid/bookmarks/:tid  to record that a user bookmarks a tuit
 *     </li>
 *     <li>DELETE /api/users/:uid/bookmarks/:tid  to record that a user unbookmarks a tuit
 *     </li>
 *     <li>GET /api/bookmarks/:tid  to retrieve all the users bookmarks this tuit
 *     </li>
 *     <li>GET /api/users/:uid/bookmarks  to retrieve all tuit that a user bookmarks
 *     </li>
 * </ul>
 * @property {BookmarkDao} BookmarkDao Singleton DAO implementing Bookmarks CRUD operations
 * @property {BookmarkController} BookmarkController Singleton controller implementing
 * RESTful Web service API
 */
export default class BookmarkController implements BookmarkControllerI {
    private static BookmarkDao: BookmarkDao = BookmarkDao.getInstance();
    private static BookmarkController: BookmarkController | null = null;
    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return BookmarkController
     */
    public static getInstance = (app: Express): BookmarkController => {
        if (BookmarkController.BookmarkController === null) {
            BookmarkController.BookmarkController = new BookmarkController();
            app.post("/api/users/:uid/bookmarks/:tid", BookmarkController.BookmarkController.bookmarkTuit);
            app.delete("/api/users/:uid/bookmarks/:tid", BookmarkController.BookmarkController.unbookmarkTuit);
            app.get("/api/bookmarks/:tid", BookmarkController.BookmarkController.findAllBookmarkByTuit);
            app.get("/api/users/:uid/bookmarks", BookmarkController.BookmarkController.findAllBookmarkByUser);
        }
        return BookmarkController.BookmarkController;
    }

    private constructor() { }

    /**
    * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that bookmarks the tuit
     * and the tuit being bookmarkd
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new Bookmarks that was inserted in the
     * database
     */
    bookmarkTuit = (req: Request, res: Response) =>
        BookmarkController.BookmarkDao.bookmarkTuit(req.params.uid, req.params.tid)
            .then(Bookmarks => res.json(Bookmarks));

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that bookmarks
     * the tuit and the tuit being unbookmarkd
     * @param {Response} res Represents response to client, including status
     * on whether deleting the Bookmark was successful or not
     */
    unbookmarkTuit = (req: Request, res: Response) =>
        BookmarkController.BookmarkDao.unbookmarkTuit(req.params.uid, req.params.tid)
            .then(status => res.send(status));

    /**
     * Retrieves all users that Bookmarkd a tuit from the database
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the bookmarked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllBookmarkByTuit = (req: Request, res: Response) =>
        BookmarkController.BookmarkDao.findAllBookMarkByTuit(req.params.tid)
            .then(Bookmarks => res.json(Bookmarks));

    /**
     * Retrieves all tuits Bookmarkd by a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user bookmarks the tuits
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were bookmarkd
     */
    findAllBookmarkByUser = (req: Request, res: Response) =>
        BookmarkController.BookmarkDao.findAllBookmarkByUser(req.params.uid)
            .then(Bookmarks => res.json(Bookmarks));


};