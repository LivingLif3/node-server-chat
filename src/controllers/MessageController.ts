import express from "express";
import { isObject } from "lodash";
import  {MessageModel}  from "../schems/index";

class MessageController {

    io: any;

  constructor(io: any) {
    this.io = io;
  }

    index(req: express.Request, res: express.Response) {
        const dialogId: any = req.query.dialog;
        MessageModel.find({dialog: dialogId})
        .populate(["dialog"])
        .exec( (err: any, messages: any) => {
            if (err) {
                return res.status(404).json({ message: "Messages not found" })
            }
            res.json(messages);
        })
    }
    create = (req: express.Request, res: express.Response) => {

        const userId = (<any> req).user.data.$__._id;
        const reqData = {
            text: req.body.text,
            dialog: req.body.dialogId,
            user: userId
        }
        const message = new MessageModel(reqData);
        message.save().then((obj: any) => {
            obj.populate("dialog", (err: any, message: any) => {
                if(err) {
                    res.status(500).json({
                        message: err
                    });
                }
                res.json(message);
                (<any> this).io.emit("NEW_MESSAGE", message);
            })
            
        }).catch((reason: any) => {
            res.send(reason);
        });
    }
    delete(req: express.Request, res: express.Response) {
        const id: string = req.params.id;
        MessageModel.findOneAndRemove({ _id: id }).then(user => {
            if(user){
                res.json({ message: `Message deleted` })
            }
        }).catch( err => {
            res.json({message: "Message not found"})
        })
    }
}

export default MessageController;