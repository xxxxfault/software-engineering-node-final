import {Request, Response} from "express";

/**
 * Interface representing the bookmark controller.
 *
 * @interface
 */
export default interface BookmarkController {
    createBookmarkByUsers (req: Request, res: Response): void;
    deleteBookmark (req: Request, res: Response): void;
    findAllBookmarkedTuitsByUser (req: Request, res: Response): void;
    findAllBookmarkedTuitsByViewedUser (req: Request, res: Response): void;
    findAllUsersByTuitBookmarks (req: Request, res: Response): void;
};