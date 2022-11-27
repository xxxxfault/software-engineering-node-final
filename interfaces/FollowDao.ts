import Follow from "../models/follows/Follows";
import User from "../models/users/User";

/**
 * @file Declares API for follows related data access object methods
 */
export default interface FollowDao {
    createFollowByUsers (followingUid: string, followedUid: string): Promise<Follow>;
    deleteFollow (followingUid: string, followedUid: string): Promise<any>;
    findAllUsersGivenUserIsFollowing (uid: string): Promise<User[]>;
    findAllUsersGivenUserIsFollowedBy (uid: string): Promise<User[]>;
};