import User from "../models/users/User";
import Bookmark from "../models/bookmarks/Bookmarks";
import Tuit from "../models/tuits/Tuit";

/**
 * @file Declares API for bookmarks related data access object methods
 */
export default interface BookmarkDao {
    createBookmarkByUsers (uid: string, tid: string): Promise<Bookmark>;
    deleteBookmark (uid: string, tid: string): Promise<any>;
    findAllBookmarkedTuitsByUser (uid: string): Promise<Tuit[]>;
    findAllBookmarkedTuitsByViewedUser (uid: string): Promise<Tuit[]>;
    findAllUsersByTuitBookmarks (tid: string): Promise<User[]>;
};