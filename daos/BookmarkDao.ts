/**
 * @file Implements DAO managing data storage of bookmarks. Uses mongoose BookmarkModel
 * to integrate with MongoDB
 */
import BookmarkModel from "../mongoose/bookmarks/BookmarkModel";
import Bookmark from "../models/bookmarks/Bookmarks";
import BookmarkDaoI from "../interfaces/BookmarkDao";
import Tuit from "../models/tuits/Tuit";
import User from "../models/users/User";
import TuitModel from "../mongoose/tuits/TuitModel";
import UserModel from "../mongoose/users/UserModel";

/**
 * @class BookmarkDao Implements Data Access Object managing data storage
 * of Bookmarks
 * @property {BookmarkDao} bookmarkDao Private single instance of BookmarkDao
 */
export default class BookmarkDao implements BookmarkDaoI {
    private static bookmarkDao: BookmarkDao | null = null;
    public static getInstance = (): BookmarkDao => {
        if(BookmarkDao.bookmarkDao === null) {
            BookmarkDao.bookmarkDao = new BookmarkDao();
        }
        return BookmarkDao.bookmarkDao;
    }
    private constructor() {}

    createBookmarkByUsers = async (uid: string, tid: string): Promise<Bookmark> =>
        BookmarkModel.create({bookmarkedBy: uid, tuit: tid});

    deleteBookmark = async (uid: string, tid: string): Promise<any> =>
        BookmarkModel.deleteOne({bookmarkedBy: uid, tuit: tid});
    findAllBookmarkedTuitsByUser = async (uid: string): Promise<Tuit[]> =>
        BookmarkModel.
        find({bookmarkedBy: uid}).
        then(bookmarks => {
            let res = [];
            for (const b of bookmarks) {
                res.push(b.tuit);
            }

            return TuitModel.
            find({_id: {
                    $in: res
                }}).
            exec()
        });
    findAllBookmarkedTuitsByViewedUser = async (uid: string): Promise<Tuit[]> =>
        BookmarkModel.
        find({bookmarkedBy: uid}).
        then(bookmarks => {
            let res = [];
            for (const b of bookmarks) {
                res.push(b.tuit);
            }

            return TuitModel.
            find({_id: {
                    $in: res
                }}).
            exec()
        });
    findAllUsersByTuitBookmarks = async (tid: string): Promise<User[]> =>
        BookmarkModel.
        find({tuit: tid}).
        then(bookmarks => {
            let res = [];
            for (const b of bookmarks) {
                res.push(b.bookmarkedBy);
            }

            return UserModel.
            find({_id: {
                    $in: res
                }}).
            exec()
        });
}