/**
 * @file Controller RESTful Web service API for Follows resource
 */
import { Express, Request, Response } from "express";
import FollowDao from "../daos/FollowDao";
import FollowControllerI from "../interfaces/FollowControllerI";

/**
 * @class FollowController Implements RESTful Web service API for Follows resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>POST /api/users/:uidFollowing/follows/:uidFollowed  to record that a user Follows another user
 *     </li>
 *     <li>DELETE /api/users/:uidFollowing/follows/:uidFollowed  to record that a user no londer follows another user
 *     </li>
 *     <li>GET /api/users/:uidFollowing/follows  to retrieve all the users followed by a user
 *     </li>
 *     <li>GET /api/follows/:uidFollowed  to retrieve all users that following a user
 *     </li>
 * </ul>
 * @property {FollowDao} FollowDao Singleton DAO implementing Follows CRUD operations
 * @property {FollowController} FollowController Singleton controller implementing
 * RESTful Web service API
 */

export default class FollowController implements FollowControllerI {
    private static FollowDao: FollowDao = FollowDao.getInstance();
    private static FollowController: FollowController | null = null;
    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return FollowController
     */
    public static getInstance = (app: Express): FollowController => {
        if (FollowController.FollowController === null) {
            FollowController.FollowController = new FollowController();
            app.post("/api/users/:uidFollowing/follows/:uidFollowed", FollowController.FollowController.userFollows);
            app.delete("/api/users/:uidFollowing/follows/:uidFollowed", FollowController.FollowController.userUnfollows);
            app.get("/api/users/:uidFollowing/follows", FollowController.FollowController.findAllUsersFollowedByThisUser);
            app.get("/api/follows/:uidFollowed", FollowController.FollowController.findAllUsersFollowingThisUser);
        }
        return FollowController.FollowController;
    }

    private constructor() { }

    /**
    * @param {Request} req Represents request from client, including the
    * path parameters uidFollowing and uidFollowed representing the user that is following another user
    * and a user is followed bu other users
    * @param {Response} res Represents response to client, including the
    * body formatted as JSON containing the new follow that was inserted in the database
    */
    userFollows = (req: Request, res: Response) => {
        FollowController.FollowDao.userFollows(req.params.uidFollowed, req.params.uidFollowing)
            .then(Follows => res.json(Follows));
    }

    /**
     * @param {Request} req Represents request from client, including the
    * path parameters uidFollowing and uidFollowed representing the user that is following another user
    * and a user is followed bu other users
     * @param {Response} res Represents response to client, including status
     * on whether deleting the follow was successful or not
     */
    userUnfollows = (req: Request, res: Response) =>
        FollowController.FollowDao.userUnfollows(req.params.uidFollowed, req.params.uidFollowing)
            .then(status => res.send(status));

    /**
     * Retrieves all users that Followd by one user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uidFollowing representing the user
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllUsersFollowedByThisUser = (req: Request, res: Response) => {
        FollowController.FollowDao.findAllUsersByFollowingId(req.params.uidFollowing)
            .then(Follows => res.json(Follows));
    }

    /**
     * Retrieves all users following one user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uidFollowed representing the user who is been followed
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects that were followed
     */
    findAllUsersFollowingThisUser = (req: Request, res: Response) =>
        FollowController.FollowDao.findAllUsersByFollowedId(req.params.uidFollowed)
            .then(Follows => res.json(Follows));

};