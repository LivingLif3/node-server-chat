import express from "express";
import {UserModel} from "../schems";

export default (
    _: express.Request,
    __: express.Response,
    next: express.NextFunction
) => {
    UserModel.updateOne({
        _id: "61e1d07b0cb6a8e09565919c"
    }, {
        $set: {
            last_seen: new Date()
        }
    }, () => {})
    next();
}