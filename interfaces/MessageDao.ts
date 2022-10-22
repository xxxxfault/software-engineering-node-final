import Message from "../models/messages/Messages";

/**
 * @file Declares API for messages related data access object methods
 */
export default interface MessageDao {
    createMessageByUsers (from: string, to: string, content: string): Promise<Message>;
    deleteMessageById (mid: string): Promise<any>;
    findAllMessagesSentByUser (uid: string): Promise<Message[]>;
    findAllMessagesReceivedByUser (uid: string): Promise<Message[]>;
};