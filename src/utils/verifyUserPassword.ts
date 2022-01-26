import bcrypt from "bcrypt";

export default (password: string, next?: any) => {
    bcrypt.genSalt((err, salt) => {
        if(err) return next(err);

        bcrypt.hash(password, salt, (err, hash) => {
            if(err) return next(err);

            password = hash;
            next();
        })
    })
}