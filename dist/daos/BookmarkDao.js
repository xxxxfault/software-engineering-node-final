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
 * @file Implements DAO managing data storage of bookmarks. Uses mongoose BookmarkModel
 * to integrate with MongoDB
 */
const BookmarkModel_1 = __importDefault(require("../mongoose/bookmarks/BookmarkModel"));
const TuitModel_1 = __importDefault(require("../mongoose/tuits/TuitModel"));
const UserModel_1 = __importDefault(require("../mongoose/users/UserModel"));
/**
 * @class BookmarkDao Implements Data Access Object managing data storage
 * of Bookmarks
 * @property {BookmarkDao} bookmarkDao Private single instance of BookmarkDao
 */
class BookmarkDao {
    constructor() {
        this.createBookmarkByUsers = (uid, tid) => __awaiter(this, void 0, void 0, function* () { return BookmarkModel_1.default.create({ bookmarkedBy: uid, tuit: tid }); });
        this.deleteBookmark = (uid, tid) => __awaiter(this, void 0, void 0, function* () { return BookmarkModel_1.default.deleteOne({ bookmarkedBy: uid, tuit: tid }); });
        this.findAllBookmarkedTuitsByUser = (uid) => __awaiter(this, void 0, void 0, function* () {
            return BookmarkModel_1.default.
                find({ bookmarkedBy: uid }).
                then(bookmarks => {
                let res = [];
                for (const b of bookmarks) {
                    res.push(b.tuit);
                }
                return TuitModel_1.default.
                    find({ _id: {
                        $in: res
                    } }).
                    exec();
            });
        });
        this.findAllBookmarkedTuitsByViewedUser = (uid) => __awaiter(this, void 0, void 0, function* () {
            return BookmarkModel_1.default.
                find({ bookmarkedBy: uid }).
                then(bookmarks => {
                let res = [];
                for (const b of bookmarks) {
                    res.push(b.tuit);
                }
                return TuitModel_1.default.
                    find({ _id: {
                        $in: res
                    } }).
                    exec();
            });
        });
        this.findAllUsersByTuitBookmarks = (tid) => __awaiter(this, void 0, void 0, function* () {
            return BookmarkModel_1.default.
                find({ tuit: tid }).
                then(bookmarks => {
                let res = [];
                for (const b of bookmarks) {
                    res.push(b.bookmarkedBy);
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
exports.default = BookmarkDao;
BookmarkDao.bookmarkDao = null;
BookmarkDao.getInstance = () => {
    if (BookmarkDao.bookmarkDao === null) {
        BookmarkDao.bookmarkDao = new BookmarkDao();
    }
    return BookmarkDao.bookmarkDao;
};
//# sourceMappingURL=BookmarkDao.js.map