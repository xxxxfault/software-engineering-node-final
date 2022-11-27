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
    image: "https://artistportfoliowebsite.s3.amazonaws.com/2022-08-31T23%3A27%3A52.877Z-R0000237.jpg",
    youtube?: String,
    avatarLogo?: String,
    imageOverlay?: String,
    stats: Stats
};