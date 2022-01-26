import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document{
    email?: string,
    fullname?: string,
    password: string,
    confirmed?: boolean,
    avatar?: string,
    confirm_hash?: string,
    last_seen?: Date
}

const UserChema = new Schema({
    email: {
        type: String,
        required: true,
        index:{
            unique: true
        }
    },
    avatar: {
        type: String,
    },
    fullname: {
        type: String,
        required: "Fullname is required"
    },
    password: {
        type: String,
        required: "Password is required"
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    confirm_hash: {
        type: String
    },
    last_seen: {
        type: Date,
    },
}, {
    timestamps: true
});

UserChema.pre('save', function(next) {
    const user:any = this;

    if(!user.isModified('password')) return next();

    bcrypt.genSalt((err, salt) => {
        if(err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if(err) return next(err);

            user.password = hash;
            next();
        })
    })
})

const UserModel = mongoose.model<IUser>("User", UserChema);

export default UserModel;