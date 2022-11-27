import {Request, Response} from "express";

/**
 * Interface representing the follow controller.
 *
 * @interface
 */
export default interface FollowControllerI {
    createFollowByUsers (req: Request, res: Response): void;
    deleteFollowByUsers (req: Request, res: Response): void;
    findAllUsersGivenUserIsFollowing (req: Request, res: Response): void;
    findAllUsersGivenUserIsFollowedBy (req: Request, res: Response): void;
    findAllUsersViewedUserIsFollowing (req: Request, res: Response): void;
    findAllUsersViewedUserIsFollowedBy (req: Request, res: Response): void;
};