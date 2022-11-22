import UserDao from "../daos/UserDao";
const bcrypt = require('bcrypt');
import { Express, Request, Response } from "express";
const saltRounds = 10;

export default class AuthenticationController {
    private static userDao: UserDao = UserDao.getInstance();
    private static authenticationController: AuthenticationController | null = null;

    public static getInstance = (app: Express): AuthenticationController => {
        if (AuthenticationController.authenticationController == null) {
            AuthenticationController.authenticationController = new AuthenticationController();
            app.post("/api/auth/signup", AuthenticationController.authenticationController.signup);
            app.post("/api/auth/profile", AuthenticationController.authenticationController.profile);
            app.post("/api/auth/logout", AuthenticationController.authenticationController.logout);
            app.post("/api/auth/login", AuthenticationController.authenticationController.login);
        }
        return AuthenticationController.authenticationController;
    }

    private constructor() { }

    signup = async (req: any, res: any) => {
        const newUser = req.body;
        const password = newUser.password;
        const hash = await bcrypt.hash(password, saltRounds);
        newUser.password = hash;
        const existingUser = await AuthenticationController.userDao
            .findUserByUsername(req.body.username);
        if (existingUser) {
            res.sendStatus(403);
            return;
        } else {
            const insertedUser = await AuthenticationController.userDao
                .createUser(newUser);
            insertedUser.password = '';
            req.session['profile'] = insertedUser;
            res.json(insertedUser);
        }
    }

    profile = (req: any, res: any) => {
        const profile = req.session['profile'];
        if (profile) {
            profile.password = "";
            res.json(profile);
        } else {
            res.sendStatus(403);
        }
    }

    logout = (req: any, res: any) => {
        req.session.destroy();
        res.sendStatus(200);
    }


    login = async (req: any, res: any) => {
        const user = req.body;
        const username = user.username;
        const password = user.password;
        const existingUser = await AuthenticationController.userDao
            .findUserByUsername(username);

        if (!existingUser) {
            res.sendStatus(403);
            return;
        }

        const match = await bcrypt
            .compare(password, existingUser.password);

        if (match) {
            existingUser.password = '*****';
            req.session['profile'] = existingUser;
            res.json(existingUser);
        } else {
            res.sendStatus(403);
        }
    };
}


// import UserDao from "../daos/UserDao";
// const bcrypt = require('bcrypt');
// const saltRounds = 10;
// import { Express, Request, Response } from "express";

// const AuthenticationController = (app: Express) => {

//     console.log("authentication");

//     const userDao: UserDao = UserDao.getInstance();

//     const signup = async (req: any, res: any) => {
//         const newUser = req.body;
//         console.log(newUser);
//         const password = newUser.password;

//         const hash = await bcrypt.hash(password, saltRounds);
//         newUser.password = hash;

//         const existingUser = await userDao
//             .findUserByUsername(req.body.username);
//         if (existingUser) {
//             res.sendStatus(403);
//             return;
//         } else {
//             const insertedUser = await userDao
//                 .createUser(newUser);
//             insertedUser.password = '';
//             req.session['profile'] = insertedUser;
//             res.json(insertedUser);
//         }
//     }
//     app.post("/api/auth/signup", signup);

//     const profile = (req: any, res: any) => {
//         const profile = req.session['profile'];
//         if (profile) {
//             profile.password = "";
//             res.json(profile);
//         } else {
//             res.sendStatus(403);
//         }
//     }

//     const logout = (req: any, res: any) => {
//         req.session.destroy();
//         res.sendStatus(200);
//     }

//     app.post("/api/auth/profile", profile);
//     app.post("/api/auth/logout", logout);

//     const login = async (req: any, res: any) => {
//         const user = req.body;
//         const username = user.username;
//         const password = user.password;
//         const existingUser = await userDao
//             .findUserByUsername(username);

//         if (!existingUser) {
//             res.sendStatus(403);
//             return;
//         }

//         const match = await bcrypt
//             .compare(password, existingUser.password);

//         if (match) {
//             existingUser.password = '*****';
//             req.session['profile'] = existingUser;
//             res.json(existingUser);
//         } else {
//             res.sendStatus(403);
//         }
//     };
//     app.post("/api/auth/login", login);

// }

// export default AuthenticationController;