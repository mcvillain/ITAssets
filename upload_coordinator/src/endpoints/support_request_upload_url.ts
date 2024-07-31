import exp from "constants";
import { Request, Response } from "express";
import * as crypto from "crypto";
import { execute_sql } from "../sql";
import { exec } from "child_process";
import { createVerify } from "crypto";

export async function post_support_request_upload_url(
    req: Request,
    res: Response,
    backend_pubkey: any
) {
    //authenticate
    const signature = req.headers.signature as string;
    const message = req.headers.verify as string;
    if (message === undefined || signature === undefined) {
        res.sendStatus(400);
        return;
    }
    const verify = createVerify("sha512");
    verify.write(message);
    verify.end();
    const is_verified = verify.verify(backend_pubkey, signature, "hex");
    if (!is_verified) {
        res.sendStatus(401);
        return;
    }
    // Get CaseID from request body
    console.log(req.body);
    let caseID = req.body.case_id as string;
    let owner = req.body.owner as string;
    let itar = req.body.itar as boolean;
    // Check if case already exists
    let old_case = await execute_sql(`SELECT guid FROM cases WHERE case_id = ${caseID}`);
    if (old_case.length > 0) {
        res.status(200).send(JSON.stringify({ uuid: old_case[0].guid as string, itar }));
        return;
    }
    // Generate New GUID use
    const uuid: string = crypto.randomUUID();
    // Create entry in cases table that contains the caseID and guid... the timestamp gets assigned by MariaDB
    await execute_sql(`INSERT INTO cases (guid, case_id, owner, itar) VALUES ('${uuid}', ${caseID},'${owner}', ${itar?'TRUE':'FALSE'})`);
    // Return the GUID in the response
    res.status(201);
    res.send(JSON.stringify({ uuid, itar }));
}
