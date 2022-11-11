import { Request, Response } from "express";

/**
 * Interface representing the like controller.
 *
 * @interface
 */
export default interface LikeControllerI {
    findAllUsersThatLikedTuit(req: Request, res: Response): void;
    findAllTuitsLikedByUser(req: Request, res: Response): void;
    userLikesTuit(req: Request, res: Response): void;
    userUnlikesTuit(req: Request, res: Response): void;
};