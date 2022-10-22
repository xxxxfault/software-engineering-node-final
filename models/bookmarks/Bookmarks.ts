/**
 * @file Declares Bookmark data type representing the bookmark relationship between
 * users and tuits, as in a user bookmarks a tuit
 */
import User from "../users/User";
import Tuit from "../tuits/Tuit";

/**
 * @typedef Bookmark Represents follows relationship between 2 users, as in user follows another user
 * @property {Tuit} tuit bookmarked tuit
 * @property {User} bookmarkedBy User bookmarking the tuit
 */
export default interface Bookmark {
    tuit: Tuit,
    bookmarkedBy: User
};