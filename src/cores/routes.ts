import express from 'express';
import bodyParser from 'body-parser';
import { Server } from "socket.io";

import { updateLastSeen, checkAuth } from '../middlewares';

import {UserController, DialogController , MessageController} from "../controllers/index";

const createRoutes = (app: express.Express, io: any) => {
    const User = new UserController()
}