/**
 * @file Controller RESTful Web service API for tuits resource
 */
import TuitDao from "../daos/TuitDao";
import Tuit from "../models/tuits/Tuit";
import { Express, Request, Response } from "express";
import TuitControllerI from "../interfaces/TuitController";

/**
 * @class TuitController Implements RESTful Web service API for tuits resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>POST /api/users/:uid/tuits to create a new tuit instance for a given user</li>
 *     <li>GET /api/tuits to retrieve all the tuit instances</li>
 *     <li>GET /api/tuits/:tid to retrieve a particular tuit instances</li>
 *     <li>GET /api/users/:uid/tuits to retrieve tuits for a given user </li>
 *     <li>PUT /api/tuits/:tid to modify an individual tuit instance </li>
 *     <li>DELETE /api/tuits/:tid to remove a particular tuit instance</li>
 * </ul>
 * @property {TuitDao} tuitDao Singleton DAO implementing tuit CRUD operations
 * @property {TuitController} tuitController Singleton controller implementing
 * RESTful Web service API
 * @property {any} upload Singleton Multer upload middleware
 * @property {any} s3Client Singleton connected AWS S3 client
 */
export default class TuitController implements TuitControllerI {
    private static tuitDao: TuitDao = TuitDao.getInstance();
    private static tuitController: TuitController | null = null;
    private static upload: any;
    private static s3Client: any;

    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return TuitController
     */
    public static getInstance = (app: Express, upload: any, s3: any): TuitController => {
        if (TuitController.tuitController === null) {
            TuitController.tuitController = new TuitController();
            TuitController.upload = upload;
            TuitController.s3Client = s3;
            app.get("/api/tuits", TuitController.tuitController.findAllTuits);
            app.get("/api/users/:uid/tuits", TuitController.tuitController.findAllTuitsByUser);
            app.get("/api/tuits/:tid", TuitController.tuitController.findTuitById);
            app.post("/api/users/:uid/tuits", TuitController.upload.array("images")
                , TuitController.tuitController.createTuitByUser);
            app.put("/api/tuits/:tid", TuitController.upload.array("images")
                , TuitController.tuitController.updateTuit);
            app.delete("/api/tuits/:tid", TuitController.tuitController.deleteTuit);
        }
        return TuitController.tuitController;
    }

    private constructor() { }

    /**
     * Retrieves all tuits from the database and returns an array of tuits.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects
     */
    findAllTuits = (req: Request, res: Response) =>
        TuitController.tuitDao.findAllTuits()
            .then((tuits: Tuit[]) => res.json(tuits));

    /**
     * Retrieves all tuits from the database for a particular user and returns
     * an array of tuits.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects
     */
    findAllTuitsByUser = (req: any, res: any) => {
        // If uid === "me", user ID should be retrieved from the current session instead of uid.
        let userId = req.params.uid === "me" && req.session['profile']
            ? req.session['profile']._id
            : req.params.uid;

        // If uid === "me" and there's no logged-in user, return empty JSON without Mongo error.
        if (userId === "me") {
            res.json({});
        }
        else {
            TuitController.tuitDao.findAllTuitsByUser(userId)
                .then((tuits: Tuit[]) => res.json(tuits));
        }
    }

    /**
     * @param {Request} req Represents request from client, including path
     * parameter tid identifying the primary key of the tuit to be retrieved
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the tuit that matches the user ID
     */
    findTuitById = (req: Request, res: Response) =>
        TuitController.tuitDao.findTuitById(req.params.tid)
            .then((tuit: Tuit) => res.json(tuit));

    /**
     * @param {Request} req Represents request from client, including body
     * containing the new tuit text and files containing zero or more new tuit images.
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new tuit that was inserted in the
     * database
     */
    createTuitByUser = (req: any, res: any) => {
        // If uid === "me", user ID should be retrieved from the current session instead of uid.
        let userId = req.params.uid === "me" && req.session['profile']
            ? req.session['profile']._id
            : req.params.uid;

        // If uid === "me" and there's no logged-in user, return empty JSON without Mongo error.
        if (userId === "me") {
            res.json({});
        }
        else {
            // Adds the URLs and unique S3 names of saved images to the tuit information.
            const imageUrl = [];
            const imageUniqueName = [];
            req.files.forEach(f => {
                imageUrl.push(f.location);
                imageUniqueName.push(f.key);
            });
            const tuitWithImageInfo = {
                ...(req.body), image: imageUrl
                , imageUniqueName: imageUniqueName
            };

            TuitController.tuitDao.createTuitByUser(userId, tuitWithImageInfo)
                .then((tuit: Tuit) => res.json(tuit));
        }
    }

    /**
     * @param {Request} req Represents request from client, including path parameter tid identifying
     * the primary key of the tuit to be modified, body containing the new tuit text and files
     * containing zero or more new tuit images.
     * @param {Response} res Represents response to client, including status
     * on whether updating a tuit was successful or not
     */
    updateTuit = (req: any, res: any) => {
        // Adds the URLs and unique S3 names of saved images to the tuit information.
        const imageUrl = [];
        const imageUniqueName = [];
        req.files.forEach(f => {
            imageUrl.push(f.location);
            imageUniqueName.push(f.key);
        });

        // Deletes old tuit images.
        TuitController.tuitDao.findTuitById(req.params.tid)
            .then((tuit) => {
                const imagesToDelete = [];
                tuit["imageUniqueName"].forEach(k => imagesToDelete.push({ Key: k }));
                const params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Delete: {
                        Objects: imagesToDelete,
                        Quiet: false
                    }
                };
                TuitController.s3Client.deleteObjects(params, function (err, data) {
                    if (err) {
                        console.log(err, err.stack);
                        res.status(400).send("Error: Unable to update tuit images.");
                    }
                    else {
                        // Updates the tuit document only after associated images are updated.
                        const tuitWithImageInfo = {
                            ...(req.body)
                            , image: imageUrl, imageUniqueName: imageUniqueName
                        };

                        TuitController.tuitDao.updateTuit(req.params.tid, tuitWithImageInfo)
                            .then((status) => res.send(status));
                    }
                });
            })
    }

    /**
     * @param {Request} req Represents request from client, including path
     * parameter tid identifying the primary key of the tuit to be removed
     * @param {Response} res Represents response to client, including status
     * on whether deleting a user was successful or not
     */
    deleteTuit = (req: Request, res: Response) => {
        TuitController.tuitDao.findTuitById(req.params.tid)
            .then(tuit => {
                // Removes tuit-associated images from AWS S3.
                const imagesToDelete = [];
                tuit["imageUniqueName"].forEach(k => imagesToDelete.push({ Key: k }));
                const params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Delete: {
                        Objects: imagesToDelete,
                        Quiet: false
                    }
                };
                TuitController.s3Client.deleteObjects(params, function (err, data) {
                    if (err) {
                        console.log(err, err.stack);
                        res.status(400).send("Error: Unable to delete tuit images.");
                    }
                    else {
                        // Deletes the tuit only after associated images are deleted.
                        TuitController.tuitDao.deleteTuit(req.params.tid)
                            .then((status) => res.send(status));
                    }
                });
            }
            );
    }
};