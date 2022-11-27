/**
 * @file Implements DAO managing data storage of messages. Uses mongoose MessageModel
 * to integrate with MongoDB
 */
import MessageModel from "../mongoose/messages/MessageModel";
import Message from "../models/messages/Messages";
import MessageDaoI from "../interfaces/MessageDao";
import messageModel from "../mongoose/messages/MessageModel";
import {now} from "mongoose";

/**
 * @class MessageDao Implements Data Access Object managing data storage
 * of Messages
 * @property {MessageDao} messageDao Private single instance of MessageDao
 */
export default class MessageDao implements MessageDaoI {
    private static messageDao: MessageDao | null = null;
    public static getInstance = (): MessageDao => {
        if(MessageDao.messageDao === null) {
            MessageDao.messageDao = new MessageDao();
        }
        return MessageDao.messageDao;
    }
    private constructor() {}

    createMessageByUsers = async (from: string, to: string, content: string): Promise<Message> =>
        MessageModel.create({from: from, to: to, message: content, sentOn: now()});
    deleteMessageById = async (mid: string): Promise<any> =>
        MessageModel.deleteOne({_id: mid});
    findAllMessagesSentByUser = async (uid: string): Promise<Message[]> =>
        MessageModel.find({from: uid}).exec();
    findAllMessagesReceivedByUser = async (uid: string): Promise<Message[]> =>
        messageModel.find({to: uid}).exec();
}