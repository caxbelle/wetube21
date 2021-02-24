import "@babel/polyfill";
import "core-js";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { localsMiddleware } from "./middlewares.js";
import routes from "./routes";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import passport from "passport";
import "./passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import apiRouter from "./routers/apiRouter";
import path from "path";

const app = express()

const CokieStore = MongoStore(session);

app.use(helmet({
    contentSecurityPolicy: false,
}));
app.set("view engine", "pug");

app.set("views", path.join(__dirname, "views"));
app.use("/static", express.static(path.join(__dirname, "static")));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(function(req, res, next) {
    res.setHeader("Content-Security-Policy", "script-src 'self' https://archive.org");
    return next();
});

app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: true,
        saveUninitialized: false,
        store: new CokieStore({ mongooseConnection: mongoose.connection })
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(localsMiddleware);

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);
app.use(routes.api, apiRouter);

export default app;