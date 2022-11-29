import {Request, Response} from "express";
import Message from "../models/messages/Messages";

/**
 * Interface representing the message controller.
 *
 * @interface
 */
export default interface MessageController {
    createMessageByUsers (req: Request, res: Response): void;
    deleteMessageById (req: Request, res: Response): void;
    findAllMessagesSentByUser (req: Request, res: Response): void;
    findAllMessagesReceivedByUser (req: Request, res: Response): void;
};