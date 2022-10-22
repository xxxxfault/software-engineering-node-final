/**
 * @file Implements mongoose schema to CRUD documents in the messages collection
 */
import mongoose, {Schema} from "mongoose";
import Message from "../../models/messages/Messages";

const MessageSchema = new mongoose.Schema<Message>({
    from: {type: Schema.Types.ObjectId, ref: "UserModel"},
    to: {type: Schema.Types.ObjectId, ref: "UserModel"},
    message: String,
    sentOn: Date
}, {collection: "messages"});

export default MessageSchema;