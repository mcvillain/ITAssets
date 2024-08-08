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

export async function get_uploader_url(
    req: Request,
    res: Response,
    loginMemcache: NodeCache
) {
    // Authenticate
    const session_id = req.cookies["session_id"];
    if (!session_id) {
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
        if (!user_id) {
            res.sendStatus(401);
            return;
        }
        username = user_id.account?.username;
        if (!username) {
            res.sendStatus(401);
            console.log("User tried to create link with undefined username");
            return;
        }
    }

    const case_id = req.params.case_uuid;
    if (!case_id) {
        res.sendStatus(400);
        return;
    }

    let itar = false;
    const myHeaders = new Headers();
    myHeaders.append(
        "Authorization",
        `Basic ${process.env.INVGATE_USER}`
    );

    const raw = "";

    fetch(`${process.env.INVGATE_URI}?=${case_id}`, {
        method: "GET",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    })
        .then((response) => response.text())
        .then((result) => {
            console.log(result);

            // Parse the result to get custom fields
            const custom_fields = JSON.parse(result).custom_fields;
            console.log("Custom fields:", custom_fields);

            // Check the ITAR field
            const itar = custom_fields["8"] === "true"; // Ensure you check the exact format of this value
            console.log("ITAR:", itar);
        })
        .catch((error) => console.error(error));

    // Correctly set the Authorization header
    // const headers = new Headers();
    // headers.set(
    //     "Authorization",
    //     "Basic " +
    //         Buffer.from(
    //             `${process.env.INVGATE_USER}:${process.env.INVGATE_PASS}`
    //         ).toString("base64")
    // );

    // const fetchCaseDetails = async (case_id: any) => {
    //     try {
    //         const resp = await fetch(`${process.env.INVGATE_URI}?id=${case_id}`, {
    //             headers,
    //         });

    //         console.log("INVGATE response status:", resp.status);
    //         const textResponse = await resp.text();
    //         console.log("INVGATE response body:", textResponse);

    //         if (!resp.ok) {
    //             console.error("Failed to fetch case ID details:", textResponse);
    //             res.sendStatus(404);
    //             return;
    //         }

    //         const custom_fields = JSON.parse(textResponse).custom_fields;
    //         console.log("Custom fields:", custom_fields);

    //         const itar = custom_fields["8"] === "true"; // Ensure you check the exact format of this value
    //         console.log("ITAR:", itar);
    //     } catch (err) {
    //         console.error("Error verifying case ID:", err);
    //         res.status(500).send("Couldn't verify case ID");
    //         return;
    //     }

    let message: SignedMessage = signMessage(crypto.randomUUID());
    try {
        const response = await fetch(`${UPLOAD_SERVICE}/request_upload_url`, {
            headers: new Headers({
                "Content-Type": "application/json",
                signature: message.signature,
                verify: message.message,
            }),
            body: JSON.stringify({ case_id, owner: username, itar }),
            method: "POST",
        });

        if (response.ok) {
            res.status(200).send(await response.text());
        } else {
            console.error(
                "Failed to request upload URL:",
                await response.text()
            );
            res.sendStatus(response.status);
        }
    } catch (err) {
        console.error("Error requesting upload URL:", err);
        res.sendStatus(500);
    }
}
