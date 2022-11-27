/**
 * @file Controller RESTful Web service API for follows resource
 */
import FollowDao from "../daos/FollowDao";
import Follow from "../models/follows/Follows";
import {Express, Request, Response} from "express";
import FollowControllerI from "../interfaces/FollowController";
import User from "../models/users/User";

/**
 * @class FollowController Implements RESTful Web service API for follows resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>POST /api/users/:uid1/follows/:uid2 to create a new follow instance between
 *     the given users</li>
 *     <li>GET /api/users/:uid/following to retrieve all the users followed by given user</li>
 *     <li>GET /api/users/:uid/followed to retrieve all the users following given user</li>
 *     <li>GET /api/users/:uid1/viewed/:uid2/following to retrieve all the users followed
 *     by the user viewed by given user</li>
 *     <li>GET /api/users/:uid1/viewed/:uid2/followed to retrieve all the users following
 *     the user viewed by given user</li>
 *     <li>DELETE /api/users/:uid1/follows/:uid2 to remove a particular follow instance</li>
 * </ul>
 * @property {FollowDao} followDao Singleton DAO implementing follow CRUD operations
 * @property {FollowController} followController Singleton controller implementing
 * RESTful Web service API
 */
export default class FollowController implements FollowControllerI {
    private static followDao: FollowDao = FollowDao.getInstance();
    private static followController: FollowController | null = null;

    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return FollowController
     */
    public static getInstance = (app: Express): FollowController => {
        if(FollowController.followController === null) {
            FollowController.followController = new FollowController();
            app.post("/api/users/:uid1/follows/:uid2",
                FollowController.followController.createFollowByUsers);
            app.get("/api/users/:uid/following",
                FollowController.followController.findAllUsersGivenUserIsFollowing);
            app.get("/api/users/:uid/followed",
                FollowController.followController.findAllUsersGivenUserIsFollowedBy);
            app.get("/api/users/:uid1/viewed/:uid2/following",
                FollowController.followController.findAllUsersViewedUserIsFollowing);
            app.get("/api/users/:uid1/viewed/:uid2/followed",
                FollowController.followController.findAllUsersViewedUserIsFollowedBy);
            app.delete("/api/users/:uid1/follows/:uid2",
                FollowController.followController.deleteFollowByUsers);
        }
        return FollowController.followController;
    }
    private constructor() {}

    /**
     * @param {Request} req Represents request from client, including body
     * containing the JSON object for the new follow to be inserted in the
     * database
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new follow that was inserted in the
     * database
     */
    createFollowByUsers = (req: Request, res: Response) =>
        FollowController.followDao.createFollowByUsers(req.params.uid1, req.params.uid2)
            .then((follow: Follow) => res.json(follow));

    /**
     * @param {Request} req Represents request from client, including path
     * parameter tid identifying the primary key of the follow to be removed
     * @param {Response} res Represents response to client, including status
     * on whether deleting a follow was successful or not
     */
    deleteFollowByUsers = (req: Request, res: Response) =>
        FollowController.followDao.deleteFollow(req.params.uid2, req.params.uid2)
            .then((status) => res.send(status));

    /**
     * Retrieves all users a given user is following from the database and returns an array of users.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllUsersGivenUserIsFollowing = (req: Request, res: Response) =>
        FollowController.followDao.findAllUsersGivenUserIsFollowing(req.params.uid)
            .then((users: User[]) => res.json(users));

    /**
     * Retrieves all users following a given user from the database and returns an array of users.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllUsersGivenUserIsFollowedBy = (req: Request, res: Response) =>
        FollowController.followDao.findAllUsersGivenUserIsFollowedBy(req.params.uid)
            .then((users: User[]) => res.json(users));

    /**
     * Retrieves all users a given user is following from the database and returns an array of users.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllUsersViewedUserIsFollowing = (req: Request, res: Response) =>
        FollowController.followDao.findAllUsersGivenUserIsFollowing(req.params.uid2)
            .then((users: User[]) => res.json(users));

    /**
     * Retrieves all users following a given user from the database and returns an array of users.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllUsersViewedUserIsFollowedBy = (req: Request, res: Response) =>
        FollowController.followDao.findAllUsersGivenUserIsFollowedBy(req.params.uid2)
            .then((users: User[]) => res.json(users));
};