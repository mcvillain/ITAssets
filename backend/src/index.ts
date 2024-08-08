import express, { Express, Request, Response } from "express";
const cookieParser = require("cookie-parser");
import dotenv from "dotenv";
import NodeCache from "node-cache";
import {
    AuthenticationResult,
    ConfidentialClientApplication,
} from "@azure/msal-node";

import { Message, OutOfDate, Users } from "./types";
import {
    AzureDatabases,
    ItarDatabases,
    LocalDatabases,
    Servers,
    Users as UserMeta,
    Message as CurrentMessage,
    OutOfDate as OutOfDateCache,
} from "./const";
import { ensure_db_structure, restore_state } from "./sql";

import { get_auth, get_auth_redirect, get_logout_redirect, get_ms_auth } from "./endpoints/auth";
import { get_messages, post_messages } from "./endpoints/messages";
import { get_servers, get_servers_csv, post_servers } from "./endpoints/servers";
import { get_localdb, get_localdb_csv, post_localdb } from "./endpoints/local_dbs";
import { get_azuredb, get_azuredb_csv, post_azuredb } from "./endpoints/azure_dbs";
import { get_users, post_users } from "./endpoints/users";
import session from "express-session";
import { clientConfig, } from "./msauth_config";
import { delete_all_case_files, get_all_cases, get_case_files, get_case_owner, get_uploader_url, get_user_cases } from "./endpoints/uploads/uploads_proxy";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Setup Session Config
const session_config: session.SessionOptions = {
    secret:
        process.env.SESSION_SECRET !== undefined
            ? process.env.SESSION_SECRET
            : "DEVELOPMENT_SECRET_DO_NOT_USE",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure:
            process.env.NO_HTTPS === undefined ||
            process.env.NO_HTTPS != "true",
    },
};

// Middleware
app.use(express.json( {limit: "10mb" } ));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session(session_config));

// Setup MSAuth
const pca = new ConfidentialClientApplication(clientConfig);

// Setup Cache
let loginCache = new NodeCache({
    stdTTL: 8 * 3600, // 8 Hours
    maxKeys: 512,
    deleteOnExpire: true,
});
loginCache.set("b71516c0-90ec-4ff6-9fa6-591b2fc8d781", "svc", 0);
let dataCache = new NodeCache({
    stdTTL: 0,
    maxKeys: 256,
});
dataCache.set(Servers, []);
dataCache.set(LocalDatabases, []);
dataCache.set(AzureDatabases, []);
dataCache.set(ItarDatabases, []);
dataCache.set(UserMeta, new Users());
dataCache.set(CurrentMessage, new Message());
dataCache.set(OutOfDateCache, new OutOfDate());

let sizePriceCache = new NodeCache({
    stdTTL: 86400, // 24 Hours
    deleteOnExpire: true,
    maxKeys: 256,
});


// Setup SQL
ensure_db_structure().then(()=>restore_state(dataCache));

// AUTH
app.get("/ms_auth", (req: Request, res: Response) => {
    get_ms_auth(req, res, pca);
});

app.get("/auth_redirect", (req: Request, res: Response) => {
    get_auth_redirect(req, res, pca, loginCache);
});

app.get("/logout_redirect", (req: Request, res: Response) => {
    get_logout_redirect(req, res, loginCache);
});

app.get("/auth", async (req: Request, res: Response) => {
    await get_auth(req, res, loginCache);
});

// MESSAGES
app.get("/messages", async (req: Request, res: Response) => {
    await get_messages(req, res, dataCache, loginCache);
});

app.post("/messages", async (req: Request, res: Response) => {
    await post_messages(req, res, dataCache, loginCache);
});

// SERVERS
app.get("/servers", async (req: Request, res: Response) => {
    await get_servers(req, res, dataCache, loginCache);
});
app.get("/Servers.csv", async (req: Request, res: Response) => {
    await get_servers_csv(req, res, dataCache, loginCache);
});
app.post("/servers", async (req: Request, res: Response) => {
    await post_servers(req, res, dataCache, loginCache, sizePriceCache);
});

// LOCAL DATABASES
app.get("/databases", async (req: Request, res: Response) => {
    await get_localdb(req, res, dataCache, loginCache);
});
app.get("/LocalDatabases.csv", async (req: Request, res: Response) => {
    await get_localdb_csv(req, res, dataCache, loginCache);
});
app.post("/databases", async (req: Request, res: Response) => {
    await post_localdb(req, res, dataCache, loginCache);
});

// AZURE DATABASES
app.get("/azure_dbs", async (req: Request, res: Response) => {
    await get_azuredb(req, res, dataCache, loginCache);
});
app.get("/AzureDatabases.csv", async (req: Request, res: Response) => {
    await get_azuredb_csv(req, res, dataCache, loginCache);
});
app.post("/azure_dbs", async (req: Request, res: Response) => {
    await post_azuredb(req, res, dataCache, loginCache, sizePriceCache);
});

// USERS
app.get("/users", async (req: Request, res: Response) => {
    await get_users(req, res, dataCache, loginCache);
});
app.post("/users", async (req: Request, res: Response) => {
    await post_users(req, res, dataCache, loginCache);
});

// Uploads
app.delete('/uploads/delete_all_case_files/:case_uuid', async (req: Request, res: Response) => {
    await delete_all_case_files(req, res, loginCache);
});
app.post('/uploads/get_all_cases', async (req: Request, res: Response) => {
    await get_all_cases(req, res, loginCache);
});
app.post('/uploads/get_user_cases/:owner', async (req: Request, res: Response) => {
    await get_user_cases(req, res, loginCache);
});
app.post('/uploads/get_case_files/:case_uuid', async (req: Request, res: Response) => {
    await get_case_files(req, res, loginCache);
});
app.get('/uploads/request_upload_url/:case_uuid', async (req: Request, res: Response) => {
    await get_uploader_url(req, res, loginCache);
});
app.get('/uploads/get_case_owner/:case_uuid', async (req: Request, res: Response) => {
    await get_case_owner(req, res, loginCache);
});

const server = app.listen(port, () => {
    let os = require("os");
    const hostname = os.hostname();
    console.log(`[server]: Server is running at http://${hostname}:${port}`);
});
server.keepAliveTimeout = 30000;
