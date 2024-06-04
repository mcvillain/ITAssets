import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import { AzureDatabase, Database, Users } from "./types";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

// Setup Cache
const databases: Database[] = [];
const azureDatabases: AzureDatabase[] = [];
const itarDatabases: AzureDatabase[] = [];
const users: Users[] = [];
let currentMessage: String = "";

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});