import express, { Express, Request, Response } from "express";
const cookieParser = require("cookie-parser");
import dotenv from "dotenv";
import fs from  'fs';
import { post_support_request_upload_url } from "./endpoints/support_request_upload_url";
import { get_support_get_current_cases_pages } from "./endpoints/support_get_current_cases_page";
import { get_support_get_all_cases_page } from "./endpoints/support_get_all_cases_page";
import { delete_support_delete_all_cases_files_case_uuid } from "./endpoints/support_delete_all_cases_files_caase_uuid";
import { get_support_get_case_files_case_uuid } from "./endpoints/support_get_case_files_case_uuid"
import { post_uploader_register_uploader } from "./endpoints/uploader_register_uploader";
import { get_uploader_validate_case_uuid } from "./endpoints/uploader_validate_case_uuid";
import { post_uploader_checkin_new_file } from "./endpoints/uploader_checkin_new_file";
import { post_uploader_update_file_progress } from "./endpoints/uploader_update_file_progress";
import session from "express-session";

import { startup_backend_loop } from "./daemon_service";
import { get_support_get_case_owner } from "./endpoints/support_get_case_owner";
setTimeout(startup_backend_loop,1000);

const uploader_pubkey=fs.readFileSync('/srv/sign/uploader/tls.crt'); 
const coordinator_privkey=fs.readFileSync('/srv/sign/coordinator/tls.key'); 

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

app.get('/healthcheck', (req: Request, res: Response) => {
    res.sendStatus(200);
});

// Support 
app.post("/support/request_upload_url", async (req: Request, res: Response) => {
    await post_support_request_upload_url(req, res);
});

app.get("/support/get_current_user_cases/:page", async (req: Request, res: Response) => {
    await get_support_get_current_cases_pages(req, res);
});

app.get("/support/get_all_cases/:page", async (req: Request, res: Response) => {
    await get_support_get_all_cases_page(req, res);
});

app.get("/support/get_case_files/:case_uuid", async (req: Request, res: Response) => {
    await get_support_get_case_files_case_uuid(req, res);
});

app.get('/support/get_case_owner/:case_uuid', async (req: Request, res: Response) => {
    await get_support_get_case_owner(req, res);
});

app.delete("/support/delete_all_case_files/:case_uuid", async (req: Request, res: Response) => {
    await delete_support_delete_all_cases_files_case_uuid(req, res);
});

// Uploader 
app.post("/uploader/register_uploader", async (req: Request, res: Response) => {
    await post_uploader_register_uploader(req, res);
});

app.get("/uploader/validate/:case_uuid", async (req: Request, res: Response) => {
    await get_uploader_validate_case_uuid(req, res, uploader_pubkey);
});

app.post("/uploader/checkin_new_file", async (req: Request, res: Response) => {
    await post_uploader_checkin_new_file(req, res, uploader_pubkey);
});

app.post("/uploader/update_file_progress", async (req: Request, res: Response) => {
    await post_uploader_update_file_progress(req, res, uploader_pubkey);
});


const server = app.listen(port, () => {
    let os = require("os");
    const hostname = os.hostname();
    console.log(`[server]: Server is running at http://${hostname}:${port}`);
});
server.keepAliveTimeout = 30000;
