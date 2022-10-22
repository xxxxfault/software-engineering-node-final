"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file Implements DAO managing data storage of follows. Uses mongoose FollowModel
 * to integrate with MongoDB
 */
const FollowModel_1 = __importDefault(require("../mongoose/follows/FollowModel"));
const UserModel_1 = __importDefault(require("../mongoose/users/UserModel"));
/**
 * @class FollowDao Implements Data Access Object managing data storage
 * of Follows
 * @property {FollowDao} followDao Private single instance of FollowDao
 */
class FollowDao {
    constructor() {
        this.createFollowByUsers = (followingUid, followedUid) => __awaiter(this, void 0, void 0, function* () { return FollowModel_1.default.create({ userFollowed: followedUid, userFollowing: followingUid }); });
        this.deleteFollow = (followingUid, followedUid) => __awaiter(this, void 0, void 0, function* () { return FollowModel_1.default.deleteOne({ userFollowed: followedUid, userFollowing: followingUid }); });
        this.findAllUsersGivenUserIsFollowing = (uid) => __awaiter(this, void 0, void 0, function* () {
            return FollowModel_1.default.
                find({ userFollowing: uid }).
                then(follows => {
                let res = [];
                for (const f of follows) {
                    res.push(f.userFollowed);
                }
                return UserModel_1.default.
                    find({ _id: {
                        $in: res
                    } }).
                    exec();
            });
        });
        this.findAllUsersGivenUserIsFollowedBy = (uid) => __awaiter(this, void 0, void 0, function* () {
            return FollowModel_1.default.
                find({ userFollowed: uid }).
                then(follows => {
                let res = [];
                for (const f of follows) {
                    res.push(f.userFollowing);
                }
                return UserModel_1.default.
                    find({ _id: {
                        $in: res
                    } }).
                    exec();
            });
        });
    }
}
exports.default = FollowDao;
FollowDao.followDao = null;
FollowDao.getInstance = () => {
    if (FollowDao.followDao === null) {
        FollowDao.followDao = new FollowDao();
    }
    return FollowDao.followDao;
};
//# sourceMappingURL=FollowDao.js.map