import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import { createServer } from 'http';
import { Server } from "socket.io";
const cors = require('cors')

import {UserController, DialogController , MessageController} from "./controllers/index";

import { updateLastSeen, checkAuth } from './middlewares';

const app = express();
const http = createServer(app);
const io = new Server(http);

dotenv.config();

const User = new UserController();
const Dialogs = new DialogController();
const Messages = new MessageController(io);

app.use(bodyParser.json());
app.use(updateLastSeen)
app.use(checkAuth)
app.use(cors({
    origin: '*'
}))

mongoose.connect('mongodb://localhost:27017/test')

app.get("/user/me", User.getMe);
app.get("/user/:id", User.index);
app.post("/registration", User.create);
app.post("/user/login", User.login);
app.delete("/user/:id", User.delete);

app.get("/dialogs/:id", Dialogs.index);
app.delete("/dialogs/:id", Dialogs.delete);
app.post("/dialogs", Dialogs.create);

app.get("/messages", Messages.index);
app.post("/messages", Messages.create);
app.delete("/messages/:id", Messages.delete);

http.listen(process.env.PORT, () => {
    console.log(`Server run on ${process.env.PORT} port`);
}) 