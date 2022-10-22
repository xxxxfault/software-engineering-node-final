"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file Controller RESTful Web service API for messages resource
 */
const MessageDao_1 = __importDefault(require("../daos/MessageDao"));
/**
 * @class MessageController Implements RESTful Web service API for messages resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>POST /api/users/:uid1/messages/:uid2 to create a new message instance given sender,
 *     receiver through path parameters, and content through HTTP body</li>
 *     <li>DELETE /api/messages/:mid to remove a particular message instance</li>
 *     <li>GET /api/users/:uid/sent to retrieve all messages sent by given user</li>
 *     <li>GET /api/users/:uid/recved to retrieve all messages received by viewed user</li>
 * </ul>
 * @property {MessageDao} messageDao Singleton DAO implementing message CRUD operations
 * @property {MessageController} messageController Singleton controller implementing
 * RESTful Web service API
 */
class MessageController {
    constructor() {
        /**
         * @param {Request} req Represents request from client, including path params uid1 and tid2,
         * and message content in the HTTP body
         * @param {Response} res Represents response to client, including the
         * body formatted as JSON containing the new message that was inserted in the
         * database
         */
        this.createMessageByUsers = (req, res) => {
            MessageController.messageDao
                .createMessageByUsers(req.params.uid1, req.params.uid2, req.body.data)
                .then((message) => res.json(message));
        };
        /**
         * @param {Request} req Represents request from client, including path params mid
         * @param {Response} res Represents response to client, including status
         * on whether deleting a follow was successful or not
         */
        this.deleteMessageById = (req, res) => MessageController.messageDao.deleteMessageById(req.params.mid)
            .then((status) => res.json(status));
        /**
         * Retrieves all messages sent by a given user from the database and returns an array of messages.
         * @param {Request} req Represents request from client
         * @param {Response} res Represents response to client, including the
         * body formatted as JSON arrays containing the message objects
         */
        this.findAllMessagesSentByUser = (req, res) => MessageController.messageDao.findAllMessagesSentByUser(req.params.uid)
            .then((messages) => res.json(messages));
        /**
         * Retrieves all messages received by a given user from the database and returns an array of messages.
         * @param {Request} req Represents request from client
         * @param {Response} res Represents response to client, including the
         * body formatted as JSON arrays containing the message objects
         */
        this.findAllMessagesReceivedByUser = (req, res) => MessageController.messageDao.findAllMessagesReceivedByUser(req.params.uid)
            .then((messages) => res.json(messages));
    }
}
exports.default = MessageController;
MessageController.messageDao = MessageDao_1.default.getInstance();
MessageController.messageController = null;
/**
 * Creates singleton controller instance
 * @param {Express} app Express instance to declare the RESTful Web service
 * API
 * @return MessageController
 */
MessageController.getInstance = (app) => {
    if (MessageController.messageController === null) {
        MessageController.messageController = new MessageController();
        app.post("/api/users/:uid1/messages/:uid2", MessageController.messageController.createMessageByUsers);
        app.delete("/api/messages/:mid", MessageController.messageController.deleteMessageById);
        app.get("/api/users/:uid/sent", MessageController.messageController.findAllMessagesSentByUser);
        app.get("/api/users/:uid/recved", MessageController.messageController.findAllMessagesReceivedByUser);
    }
    return MessageController.messageController;
};
;
//# sourceMappingURL=MessageController.js.map