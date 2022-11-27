/**
 * @file Implements DAO managing data storage of follows. Uses mongoose FollowModel
 * to integrate with MongoDB
 */
import FollowModel from "../mongoose/follows/FollowModel";
import Follow from "../models/follows/Follows";
import FollowDaoI from "../interfaces/FollowDao"
import User from "../models/users/User";
import UserModel from "../mongoose/users/UserModel";

/**
 * @class FollowDao Implements Data Access Object managing data storage
 * of Follows
 * @property {FollowDao} followDao Private single instance of FollowDao
 */
export default class FollowDao implements FollowDaoI {
    private static followDao: FollowDao | null = null;
    public static getInstance = (): FollowDao => {
        if(FollowDao.followDao === null) {
            FollowDao.followDao = new FollowDao();
        }
        return FollowDao.followDao;
    }
    private constructor() {}

    createFollowByUsers = async (followingUid: string, followedUid: string): Promise<Follow> =>
        FollowModel.create({userFollowed: followedUid, userFollowing: followingUid});
    deleteFollow = async (followingUid: string, followedUid: string): Promise<any> =>
        FollowModel.deleteOne({userFollowed: followedUid, userFollowing: followingUid});
    findAllUsersGivenUserIsFollowing = async (uid: string): Promise<User[]> =>
        FollowModel.
        find({userFollowing: uid}).
        then(follows => {
            let res = [];
            for (const f of follows) {
                res.push(f.userFollowed);
            }

            return UserModel.
            find({_id: {
                    $in: res
                }}).
            exec()
        });
    findAllUsersGivenUserIsFollowedBy = async (uid: string): Promise<User[]> =>
        FollowModel.
        find({userFollowed: uid}).
        then(follows => {
            let res = [];
            for (const f of follows) {
                res.push(f.userFollowing);
            }

            return UserModel.
            find({_id: {
                    $in: res
                }}).
            exec()
        });
}