import  bcrypt  from 'bcrypt';
import express from "express";
import { createJWTToken, generatePasswordHash } from "../utils";
import { check, validationResult } from "express-validator";
import { UserModel } from "./../schems";

interface IUser extends express.Request {
    user: string // or any other type
}

class UserController {

    

    index(req: express.Request, res: express.Response) {
        const id: string = req.params.id;
        UserModel.findById(id, (err: any, user: any) => {
            if (err) {
                return res.status(404).json({ message: "Not found" })
            }
            res.json(user);
        })
    }
    create(req: express.Request, res: express.Response) {
        const reqData = {
            email: req.body.email,
            password: req.body.password,
            fullname: req.body.fullname
        }
        const user = new UserModel(reqData);
        UserModel.findOne({email: reqData.email}, (err:any, user: any)=>{
            if(user){
                return res.json({
                    message: "Такой пользователь уже существует"
                })
            }
        })
        user.save().then((obj: any) => {
            res.send(obj);
        }).catch((reason: any) => {
            res.send(reason);
        });
    }
    delete(req: express.Request, res: express.Response) {
        const id: string = req.params.id;
        UserModel.findOneAndRemove({ _id: id }).then(user => {
            if (user) {
                res.json({ message: `User ${user.fullname} deleted` })
            }
        }).catch(err => {
            res.json({ message: "User not found" })
        })
    }
    getMe(req: express.Request, res: express.Response) {
        const id: string = (<any> req).user.data._doc._id;
        console.log((<any> req).user.data._doc._id);
        UserModel.findById(id, (err: any, user: any) => {
            if (err) {
                console.log(err);
                return res.status(404).json({ message: "Not found" })
            }
            res.json(user);
        })
    }
    login(req: express.Request, res: express.Response) {
        const postData = {
            email: req.body.email,
            password: req.body.password
        }

        UserModel.findOne({ email: postData.email }, (err: any, user: any) => {
            if (err) {
                return res.status(404).json({
                    message: "User not found"
                })
            }

            bcrypt.compare(postData.password, user.password, (err, result) => {
                if (err){
                    return res.json({
                        status: "error",
                        message: "incorrect password or email"
                    })
                }

                if(result){
                    const token = createJWTToken(user);
                    res.json({
                        status: "success",
                        token
                    })
                }else{
                    return res.json({
                        status: "failed"
                    })
                }
            })
            /*(postData.password).then((passwordHash) => {
                if (user.password === passwordHash) {
                    const token = createJWTToken(user);
                    res.json({
                        status: "success",
                        token
                    })
                }else {
                    res.json({
                        status: "error",
                        message: "incorrect password or email"
                    }) 
                }
            })*/

            /*if (user.password === postData.password) {
                const token = createJWTToken(user);
                res.json({
                    status: "success",
                    token
                })
            } else {
                res.json({
                    status: "error",
                    message: "incorrect password or email"
                })
            }*/
        })
    }
}

export default UserController;