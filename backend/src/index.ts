import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import NodeCache from "node-cache";

import { AzureDatabase, LocalDatabase, Message, Users } from "./types";
import { get_auth, get_login } from "./endpoints/auth";
import { get_messages, post_messages } from "./endpoints/messages";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
app.use(cookieParser(""));

// Setup Cache
let loginCache = new NodeCache({
    stdTTL: 8 * 3600, // 8 Hours
    maxKeys: 100,
    deleteOnExpire: true,
});
loginCache.set("b71516c0-90ec-4ff6-9fa6-591b2fc8d781", "svc");
let dataCache= new NodeCache({
    stdTTL: 0,
});
// const localDatabases: LocalDatabase[] = [];
dataCache.set("localDatabases", []);
// const azureDatabases: AzureDatabase[] = [];
dataCache.set("azureDatabases", []);
// const itarDatabases: AzureDatabase[] = [];
dataCache.set("itarDatabases", []);
// const users: Users[] = [];
dataCache.set("users", []);
// let currentMessage: string = "";
dataCache.set("message", new Message());

// AUTH
app.get("/login", async (req: Request, res: Response) => {
    await get_login(req, res, loginCache);
});

app.get("/auth", async (req: Request, res: Response) => {
    await get_auth(req, res, loginCache);
});

// MESSAGES
app.get("/messages", async (req: Request, res: Response) => {
    await get_messages(req, res, dataCache, loginCache);
})

app.post("/messages", async (req: Request, res: Response) => {
    await post_messages(req, res, dataCache, loginCache);
})

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
