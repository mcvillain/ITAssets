import express, { Express, Request, Response } from "express";
const cookieParser = require("cookie-parser");
import dotenv from "dotenv";
// import {
//     AuthenticationResult,
//     ConfidentialClientApplication,
// } from "@azure/msal-node";

// import { get_auth, get_auth_redirect, get_logout_redirect, get_ms_auth } from "./endpoints/auth";
import session from "express-session";
// import { clientConfig, config } from "./msauth_config";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Setup Session Config
const session_config: session.SessionOptions = {
    secret:
        process.env.SESSION_SECRET !== undefined
            ? process.env.SESSION_SECRET
            : "DEVELOPMENT_SECRED_DO_NOT_USE",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure:
            process.env.NO_HTTPS === undefined ||
            process.env.NO_HTTPS != "true",
    },
};

// Middleware
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
app.use(cookieParser());
app.use(session(session_config));

// Setup MSAuth
// const pca = new ConfidentialClientApplication(clientConfig);


// AUTH
app.get("/auth", async (req: Request, res: Response) => {
    // await get_auth(req, res, loginCache);
});

const server = app.listen(port, () => {
    let os = require("os");
    const hostname = os.hostname();
    console.log(`[server]: Server is running at http://${hostname}:${port}`);
});
server.keepAliveTimeout = 30000;
