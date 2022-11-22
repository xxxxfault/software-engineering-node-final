/**
 * @file Controller RESTful Web service API for Dislikes resource
 */
import { Express, Request, Response } from "express";
import DislikeDao from "../daos/DislikeDao";
import DislikeControllerI from "../interfaces/DislikeControllerI";
import TuitDao from "../daos/TuitDao";
import LikeDao from "../daos/LikeDao";
/**
 * @class DislikeController Implements RESTful Web service API for Dislikes resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/users/:uid/dislikes to retrieve all the tuits Disliked by a user
 *     </li>
 *     <li>GET /api/tuits/:tid/dislikes to retrieve all users that Disliked a tuit
 *     </li>
 *     <li>POST /api/users/:uid/dislikes/:tid to record that a user Dislikes a tuit
 *     </li>
 *     <li>DELETE /api/users/:uid/undislikes/:tid to record that a user
 *     no londer Dislikes a tuit</li>
 *     <li>PUT /api/users/:uid/dislikes/:tid to record that a user Dislikes a tuit
 *     </li>
 * </ul>
 * @property {DislikeDao} DislikeDao Singleton DAO implementing Dislikes CRUD operations
 * @property {DislikeController} DislikeController Singleton controller implementing
 * RESTful Web service API
 */
export default class DislikeController implements DislikeControllerI {
    private static dislikeDao: DislikeDao = DislikeDao.getInstance();
    private static tuitDao: TuitDao = TuitDao.getInstance();
    private static likeDao: LikeDao = LikeDao.getInstance();
    private static dislikeController: DislikeController | null = null;
    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return DislikeController
     */
    public static getInstance = (app: Express): DislikeController => {
        if (DislikeController.dislikeController === null) {
            DislikeController.dislikeController = new DislikeController();
            app.get("/api/users/:uid/dislikes", DislikeController.dislikeController.findAllTuitsDislikedByUser);
            app.get("/api/tuits/:tid/dislikes", DislikeController.dislikeController.findAllUsersThatDislikedTuit);
            app.post("/api/users/:uid/dislikes/:tid", DislikeController.dislikeController.userDislikesTuit);
            app.delete("/api/users/:uid/undislikes/:tid", DislikeController.dislikeController.userUnDislikesTuit);
            app.put("/api/users/:uid/dislikes/:tid", DislikeController.dislikeController.userTogglesTuitDislikes);
        }
        return DislikeController.dislikeController;
    }

    private constructor() { }

    /**
     * Retrieves all users that Disliked a tuit from the database
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the Disliked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllUsersThatDislikedTuit = (req: Request, res: Response) =>
        DislikeController.dislikeDao.findAllUsersThatDislikedTuit(req.params.tid)
            .then(Dislikes => res.json(Dislikes));

    /**
     * Retrieves all tuits Disliked by a user from the database
     * @param {any} req Represents request from client, including the path
     * parameter uid representing the user Disliked the tuits
     * @param {any} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were Disliked
     */
    findAllTuitsDislikedByUser = (req: any, res: any) => {
        const uid = req.params.uid;
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;
        DislikeController.dislikeDao.findAllTuitsDislikedByUser(userId)
            .then(dislikes => {
                const dislikesNonNullTuits =
                    dislikes.filter(dislike => dislike.tuit);
                const tuitsFromDislikes =
                    dislikesNonNullTuits.map(dislike => dislike.tuit);
                res.json(tuitsFromDislikes);
            });
    }


    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is liking the tuit
     * and the tuit being Disliked
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new Dislikes that was inserted in the
     * database
     */
    userDislikesTuit = (req: Request, res: Response) =>
        DislikeController.dislikeDao.userDislikesTuit(req.params.uid, req.params.tid)
            .then(Dislikes => res.json(Dislikes));

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is unliking
     * the tuit and the tuit being unDisliked
     * @param {Response} res Represents response to client, including status
     * on whether deleting the Dislike was successful or not
     */
    userUnDislikesTuit = (req: Request, res: Response) =>
        DislikeController.dislikeDao.userUnDislikesTuit(req.params.uid, req.params.tid)
            .then(status => res.send(status));

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is disliking
     * the tuit and the tuit being disliked
     * @param {Response} res Represents response to client, including status
     * on whether deleting the Dislike was successful or not
     */
    userTogglesTuitDislikes = async (req: any, res: any) => {
        const uid = req.params.uid;
        const tid = req.params.tid;
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;
        try {
            const userAlreadyDislikedTuit = await DislikeController.dislikeDao
                .findUserDislikesTuit(userId, tid);
            const howManyDislikedTuit = await DislikeController.dislikeDao
                .countHowManyDislikedTuit(tid);
            let tuit = await DislikeController.tuitDao.findTuitById(tid);
            const userAlreadyLikedTuit = await DislikeController.likeDao
                .findUserLikesTuit(userId, tid);
            const howManyLikedTuit = await DislikeController.likeDao
                .countHowManyLikedTuit(tid);
            if (userAlreadyDislikedTuit) {
                await DislikeController.dislikeDao.userUnDislikesTuit(userId, tid);
                tuit.stats.dislikes = howManyDislikedTuit - 1;
            } else {
                // If user liked that tuit, unlike it.
                if (userAlreadyLikedTuit) {
                    await DislikeController.likeDao.userUnlikesTuit(userId, tid);
                    tuit.stats.likes = howManyLikedTuit - 1;
                }
                await DislikeController.dislikeDao.userDislikesTuit(userId, tid);
                tuit.stats.dislikes = howManyDislikedTuit + 1;
            };
            await DislikeController.tuitDao.updateLikes(tid, tuit.stats);
            res.sendStatus(200);
        } catch (e) {
            res.sendStatus(404);
        }
    }
};