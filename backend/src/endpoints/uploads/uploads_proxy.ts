import { Request, Response } from "express";
import { SignedMessage, signMessage } from "./signing";
import { get_auth_lvl } from "../auth";
import NodeCache from "node-cache";
import { AuthenticationResult } from "@azure/msal-node";

const UPLOAD_SERVICE = "http://itassets-coordinator-service:3000/support";

// Delete All Cases By Case UUID
export async function delete_all_case_files(
    req: Request,
    res: Response,
    loginMemcache: NodeCache
) {
    // Authenticate
    const session_id = req.cookies["session_id"];
    if (session_id === undefined) {
        res.sendStatus(401);
        return;
    }
    const auth_lvl = await get_auth_lvl(session_id, loginMemcache);
    if (!(auth_lvl >= 1 && auth_lvl <= 3)) {
        res.sendStatus(401);
        return;
    }
    if (auth_lvl < 3) {
        const user_id: AuthenticationResult | undefined =
            await loginMemcache.get(session_id);
        if (user_id === undefined) {
            res.sendStatus(401);
            return;
        }
        const username = user_id.account?.username;
        if (username === undefined) {
            res.sendStatus(401);
            console.log("User tried to delete file with undefined username");
            return;
        }
        // TODO: Make the UPLOAD_SERVICE dynamic based on weather or not the case is ITAR
        try {
            let message: SignedMessage = signMessage(req.params.case_uuid);
            const case_owner = await fetch(
                `${UPLOAD_SERVICE}/get_case_owner/${req.params.case_uuid}`,
                {
                    headers: new Headers({
                        signature: message.signature,
                    }),
                }
            );
            if (username != (await case_owner.json()).owner) {
                res.sendStatus(401);
                return;
            }
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
            return;
        }
    }
    // Execute Function
    let msg: string = req.params.case_uuid;
    let message: SignedMessage = signMessage(msg);
    fetch(`${UPLOAD_SERVICE}/delete_all_case_files/${message.message}`, {
        headers: new Headers({
            signature: message.signature,
        }),
        method: "DELETE",
    })
        .then((resp) => {
            if (resp.ok) res.sendStatus(200);
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
}

// Get All Cases
export async function get_all_cases(
    req: Request,
    res: Response,
    loginMemcache: NodeCache
) {
    // Authenticate
    const session_id = req.cookies["session_id"];
    if (session_id === undefined) {
        res.sendStatus(401);
        return;
    }
    const auth_lvl = await get_auth_lvl(session_id, loginMemcache);
    if (!(auth_lvl >= 1 && auth_lvl <= 3)) {
        res.sendStatus(401);
        return;
    }
    // Execute Function
    let message: SignedMessage = signMessage(crypto.randomUUID());
    fetch(`${UPLOAD_SERVICE}/get_all_cases`, {
        headers: new Headers({
            "Content-Type": "application/json",
            signature: message.signature,
            verify: message.message,
        }),
        body: JSON.stringify(req.body),
        method: "POST",
    })
        .then(async (resp) => {
            res.status(resp.status).send(await resp.text());
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
}

// Get Current User's Cases
export async function get_user_cases(
    req: Request,
    res: Response,
    loginMemcache: NodeCache
) {
    // Authenticate
    const session_id = req.cookies["session_id"];
    if (session_id === undefined) {
        res.sendStatus(401);
        return;
    }
    const auth_lvl = await get_auth_lvl(session_id, loginMemcache);
    if (!(auth_lvl >= 1 && auth_lvl <= 3)) {
        res.sendStatus(401);
        return;
    }
    // Execute Function
    let message: SignedMessage = signMessage(crypto.randomUUID());
    fetch(`${UPLOAD_SERVICE}/get_current_user_cases/${req.params.owner}`, {
        headers: new Headers({
            "Content-Type": "application/json",
            signature: message.signature,
            verify: message.message,
        }),
        body: JSON.stringify(req.body),
        method: "POST",
    })
        .then(async (resp) => {
            res.status(resp.status).send(await resp.text());
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
}

// Get Files for Case by UUID
export async function get_case_files(
    req: Request,
    res: Response,
    loginMemcache: NodeCache
) {
    // Authenticate
    const session_id = req.cookies["session_id"];
    if (session_id === undefined) {
        res.sendStatus(401);
        return;
    }
    const auth_lvl = await get_auth_lvl(session_id, loginMemcache);
    if (!(auth_lvl >= 1 && auth_lvl <= 3)) {
        res.sendStatus(401);
        return;
    }
    // Execute Function
    let message: SignedMessage = signMessage(req.params.case_uuid);
    fetch(`${UPLOAD_SERVICE}/get_case_files/${req.params.case_uuid}`, {
        headers: new Headers({
            "Content-Type": "application/json",
            signature: message.signature,
        }),
        body: JSON.stringify(req.body),
        method: "POST",
    })
        .then(async (resp) => {
            res.status(resp.status).send(await resp.text());
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
}

// Get Case Owner by UUID
export async function get_case_owner(
    req: Request,
    res: Response,
    loginMemcache: NodeCache
) {
    // Authenticate
    const session_id = req.cookies["session_id"];
    if (session_id === undefined) {
        res.sendStatus(401);
        return;
    }
    const auth_lvl = await get_auth_lvl(session_id, loginMemcache);
    if (!(auth_lvl >= 1 && auth_lvl <= 3)) {
        res.sendStatus(401);
        return;
    }
    const user_id: AuthenticationResult | undefined = await loginMemcache.get(
        session_id
    );
    if (user_id === undefined) {
        res.sendStatus(401);
        return;
    }
    // Execute Function
    let message: SignedMessage = signMessage(req.params.case_uuid);
    fetch(`${UPLOAD_SERVICE}/get_case_owner/${message.message}`, {
        headers: new Headers({
            signature: message.signature,
        }),
    })
        .then(async (resp) => {
            res.status(resp.status).send(await resp.text());
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
}

// Request Upload URL
export async function get_uploader_url(
    req: Request,
    res: Response,
    loginMemcache: NodeCache
) {
    // Authenticate
    const session_id = req.cookies["session_id"];
    if (session_id === undefined) {
        res.sendStatus(401);
        return;
    }
    const auth_lvl = await get_auth_lvl(session_id, loginMemcache);
    if (!(auth_lvl >= 1 && auth_lvl <= 3)) {
        res.sendStatus(401);
        return;
    }
    let username;
    if (auth_lvl < 3) {
        const user_id: AuthenticationResult | undefined =
            await loginMemcache.get(session_id);
        if (user_id === undefined) {
            res.sendStatus(401);
            return;
        }
        username = user_id.account?.username;
        if (username === undefined) {
            res.sendStatus(401);
            console.log("User tried to create link with undefined username");
            return;
        }
    }
    // Execute Function
    const itar = req.headers.itar !== undefined;
    const case_id = req.params.case_uuid;
    if (case_id === undefined) {
        res.sendStatus(400);
        return;
    }
    let message: SignedMessage = signMessage(crypto.randomUUID());
    fetch(`${UPLOAD_SERVICE}/request_upload_url`, {
        headers: new Headers({
            "Content-Type": "application/json",
            'signature': message.signature,
            'verify': message.message
        }),
        body: JSON.stringify({ case_id: case_id, owner: username, itar }),
        method: "POST",
    })
        .then(async (resp) => {
            if (resp.ok) {
                res.status(200).send(await resp.text());
            } else {
                res.sendStatus(resp.status);
            }
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
}
