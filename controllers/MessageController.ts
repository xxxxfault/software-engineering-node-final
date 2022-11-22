/**
 * @file Controller RESTful Web service API for Messages resource
 */
import { Express, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import MessageDao from "../daos/MessageDao";
import MessageControllerI from "../interfaces/MessageControllerI";

/**
 * @class MessageController Implements RESTful Web service API for Messages resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>POST /api/users/:fromid/messages/:toid  to record that a user send message to another user
 *     </li>
 *     <li>DELETE /api/messages/:mid  to delete a message
 *     </li>
 *     <li>GET /api/messages/:uid  to retrieve all the messages send to a user
 *     </li>
 *     <li>GET /api/users/:uid/messages  to retrieve all the messages send by a user
 *     </li>
 *     <li>GET /api/users/:user1id/messages/:user2id  to retrieve all messages user1 sent to user2
 *     </li>
 * </ul>
 * @property {MessageDao} MessageDao Singleton DAO implementing Messages CRUD operations
 * @property {MessageController} MessageController Singleton controller implementing
 * RESTful Web service API
 */
export default class MessageController implements MessageControllerI {
    private static MessageDao: MessageDao = MessageDao.getInstance();
    private static MessageController: MessageController | null = null;
    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return MessageController
     */
    public static getInstance = (app: Express): MessageController => {
        if (MessageController.MessageController === null) {
            MessageController.MessageController = new MessageController();
            app.post("/api/users/:fromid/messages/:toid", MessageController.MessageController.sendMessage);
            app.delete("/api/messages/:mid", MessageController.MessageController.deleteMessage);
            app.get("/api/messages/:uid", MessageController.MessageController.findAllMessageUserReceive);
            app.get("/api/users/:uid/messages", MessageController.MessageController.findAllMessageUserSend);
            app.get("/api/users/:user1id/messages/:user2id", MessageController.MessageController.findMessageUserSendToAnotherUser);
        }
        return MessageController.MessageController;
    }

    private constructor() { }

    /**
    * @param {Request} req Represents request from client, including the
    * path parameters uid and tid representing the user that is liking the tuit
    * and the tuit being Messaged
    * @param {Response} res Represents response to client, including the
    * body formatted as JSON containing the new message that was inserted in the
    * database
    */
    sendMessage = (req: Request, res: Response) =>
        MessageController.MessageDao.sendMessage(req.params.fromid, req.params.toid, req.body.message)
            .then(Messages => res.json(Messages));


    /**
     * @param {Request} req Represents request from client, including the
     * path parameters mid representing the message id
     * @param {Response} res Represents response to client, including status
     * on whether deleting the message was successful or not
     */
    deleteMessage = (req: Request, res: Response) =>
        MessageController.MessageDao.deleteMessage(req.params.mid)
            .then(status => res.send(status));

    /**
     * Retrieves all messages that a user sends
     * @param {Request} req Represents request from client, including the
     * path parameters uid representing the user sends messages
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the message objects
     */
    findAllMessageUserSend = (req: Request, res: Response) =>
        MessageController.MessageDao.findAllMessageUserSend(req.params.uid)
            .then(Messages => res.json(Messages));

    /**
     * Retrieves all messages that a user receives
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user receives messages
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the message objects
     */
    findAllMessageUserReceive = (req: Request, res: Response) =>
        MessageController.MessageDao.findAllMessageUserReceive(req.params.uid)
            .then(Messages => res.json(Messages));

    /**
    * Retrieves all messages that user1 sends to user2
    * @param {Request} req Represents request from client, including the path
    * parameter user1 and user2 representing user who sends messages and who receives messages
    * @param {Response} res Represents response to client, including the
    * body formatted as JSON arrays containing the message objects
    */
    findMessageUserSendToAnotherUser = (req: Request, res: Response) =>
        MessageController.MessageDao.findMessageBetweenTwoUsers(req.params.user1id, req.params.user2id)
            .then(Messages => res.json(Messages));
};