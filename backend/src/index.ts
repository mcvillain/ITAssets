import express, { Express, Request, Response } from "express";
const cookieParser = require("cookie-parser");
import dotenv from "dotenv";
import cors, {CorsOptions} from "cors";
import NodeCache from "node-cache";

import { Message } from "./types";
import { AzureDatabases, ItarDatabases, LocalDatabases, Servers, Users as UserMeta, Message as CurrentMessage } from "./const";

import { get_auth, post_login } from "./endpoints/auth";
import { get_messages, post_messages } from "./endpoints/messages";
import { get_servers, post_servers } from "./endpoints/servers";
import { get_localdb, post_localdb } from "./endpoints/local_dbs";
import { get_azuredb, post_azuredb } from "./endpoints/azure_dbs";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// CORS
var corsOptions: CorsOptions = {
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
// Middleware
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
app.use(cookieParser());

// Setup Cache
let loginCache = new NodeCache({
    stdTTL: 8 * 3600, // 8 Hours
    maxKeys: 100,
    deleteOnExpire: true,
});
loginCache.set("b71516c0-90ec-4ff6-9fa6-591b2fc8d781", "svc", 0);
let dataCache = new NodeCache({
    stdTTL: 0,
});
dataCache.set(Servers, []);
// const localDatabases: LocalDatabase[] = [];
dataCache.set(LocalDatabases, []);
// const azureDatabases: AzureDatabase[] = [];
dataCache.set(AzureDatabases, []);
// const itarDatabases: AzureDatabase[] = [];
dataCache.set(ItarDatabases, []);
// const users: Users[] = [];
dataCache.set(UserMeta, []);
// let currentMessage: string = "";
dataCache.set(CurrentMessage, new Message());
let sizePriceCache = new NodeCache({
    stdTTL: 24 * 3600,
    deleteOnExpire: true,
})

// AUTH
app.post("/login", async (req: Request, res: Response) => {
    await post_login(req, res, loginCache);
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

app.post("/servers", async (req: Request, res: Response) => {
    await post_servers(req, res, dataCache, loginCache, sizePriceCache);
});

// LOCAL DATABASES
app.get("/databases", async (req: Request, res: Response) => {
    await get_localdb(req, res, dataCache, loginCache);
});
app.post("/databases", async (req: Request, res: Response) => {
    await post_localdb(req, res, dataCache, loginCache);
});

// AZURE DATABASES
app.get("/azure_dbs", async (req: Request, res: Response) => {
    await get_azuredb(req, res, dataCache, loginCache);
});
app.post("/azure_dbs", async (req: Request, res: Response) => {
    await post_azuredb(req, res, dataCache, loginCache, sizePriceCache);
});

const server = app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
server.keepAliveTimeout = 30000;