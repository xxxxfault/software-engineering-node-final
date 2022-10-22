/**
 * @file Declares Follow data type representing relationship between
 * users followed and users following, as in user follows another user
 */
import User from "../users/User";

/**
 * @typedef Follow Represents follows relationship between 2 users, as in user follows another user
 * @property {User} userFollowed User followed by another user
 * @property {User} userFollowing User following another user
 */
export default interface Follow {
    userFollowed: User,
    userFollowing: User
};