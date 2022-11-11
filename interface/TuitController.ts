import { Request, Response } from "express";

/**
 * Interface representing the tuit controller.
 *
 * @interface
 */
export default interface TuitController {
    findAllTuits(req: Request, res: Response): void;
    findAllTuitsByUser(req: Request, res: Response): void;
    findTuitById(req: Request, res: Response): void;
    createTuitByUser(req: Request, res: Response): void;
    updateTuit(req: Request, res: Response): void;
    deleteTuit(req: Request, res: Response): void;
};