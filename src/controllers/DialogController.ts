import express from "express";
import  {DialogModel, MessageModel}  from "../schems/index";

class DialogController {
    index(req: express.Request, res: express.Response) {
        const authorId: string = req.params.id;
        DialogModel.find({author: authorId})
        .populate(["author","partner"])
        .exec( (err: any, dialogs: any) => {
            if (err) {
                return res.status(404).json({ message: "Dialogs not found" })
            }
            res.json(dialogs);
            console.log(dialogs)
        })
    }
    create(req: express.Request, res: express.Response) {
        const reqData = {
            author: req.body.author,
            partner: req.body.partner,
        }
        const dialog = new DialogModel(reqData);
        dialog.save().then((dialogObj: any) => {

            const message = new MessageModel({
                text: req.body.text,
                user: req.body.author,
                dialog: dialogObj._id
            });

            message.save()
            .then(() => {
                res.json(dialogObj);
            })

        }).catch((reason: any) => {
            res.send(reason);
        });
    }
    delete(req: express.Request, res: express.Response) {
        const id: string = req.params.id;
        DialogModel.findOneAndRemove({ _id: id }).then(user => {
            if(user){
                res.json({ message: `Dialog deleted` })
            }
        }).catch( err => {
            res.json({message: "Dialog not found"})
        })
    }
}

export default DialogController;