import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document{
    text: {
        type: string,
        require: boolean
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: string,
        require: true
    },
    dialog: {
        type: Schema.Types.ObjectId,
        ref: string,
        require: true
    },
    unread: boolean,
}

const MessageSchema = new Schema({
    text:{
        type: String,
        require: Boolean
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    dialog:{
        type: Schema.Types.ObjectId,
        ref: "Dialog"
    },
    unread: Boolean
}, {
    timestamps: true
});

const MessageModel = mongoose.model<IMessage>("Message", MessageSchema);

export default MessageModel;