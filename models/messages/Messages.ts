/**
 * @file Declares Message data type representing the private messages sent between
 * users, as in a user messages another user
 */
import User from "../users/User";

/**
 * @typedef Message Represents the private messages sent between users, as in
 * a user messages another user
 * @property {User} from message sender
 * @property {User} to message receiver
 * @property {string} message message content
 * @property {Date} sentOn date the message was sent on
 */
export default interface Message {
    from: User,
    to: User,
    message: string,
    sentOn: Date
};