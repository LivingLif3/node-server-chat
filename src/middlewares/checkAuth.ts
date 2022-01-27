import express from "express";
import { verifyJWTToken } from "../utils";
import { IUser } from "../schems/User";

export default (req: any, res: any, next: any) => {
     if (req.path === '/user/login' || req.path === '/registration') {
         return next();
     }  

    const token = req.headers.token;

    (verifyJWTToken(token) as any)
        .then((user: any) => {
            req.user = user
            next()
        }).catch((error: any) => {
            res.status(403).json({ message: error })
        })

       
}