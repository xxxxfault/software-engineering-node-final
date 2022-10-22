import User from "../users/User";
import Stats from "./Stats";

/**
 * Interface represents Tuits in the Tuiter app.
 *
 * @interface
 */
export default interface Tuit {
    tuit: string,
    postedBy: User,
    postedOn?: Date,
    image?: String,
    youtube?: String,
    avatarLogo?: String,
    imageOverlay?: String,
    stats: Stats
};