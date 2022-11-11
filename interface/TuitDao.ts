import Tuit from "../models/tuits/Tuit";

/**
 * Interface representing API for Tuits related data access object methods
 *
 * @interface
 */
export default interface TuitDao {
    findAllTuits(): Promise<Tuit[]>;
    findAllTuitsByUser(uid: string): Promise<Tuit[]>;
    findTuitById(tid: string): Promise<Tuit>;
    createTuitByUser(uid: string, tuit: Tuit): Promise<Tuit>;
    updateTuit(tid: string, tuit: Tuit): Promise<any>;
    deleteTuit(tid: string): Promise<any>;
};