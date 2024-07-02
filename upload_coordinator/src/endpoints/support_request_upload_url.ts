import exp from "constants";
import { Request, Response } from "express";
import * as crypto from "crypto";
import { execute_sql } from "../sql";
import { exec } from "child_process";


export async function post_support_request_upload_url(req: Request, res: Response ) {
    // Get CaseID from request body
    let caseID = req.body.case_id;
    let owner = req.body.owner;
    // Generate New GUID use 
    const uuid: string = crypto.randomUUID();
    // Create entry in cases table that contains the caseID and guid... the timestamp gets assigned by MariaDB
    await execute_sql(`INSERT INTO cases (guid, case_id, owner) VALUES ('${uuid}', '${caseID}','${owner}')`);
    // Return the GUID in the response
    res.status(200);
    res.send(JSON.stringify({uuid}));
}