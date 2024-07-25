import exp from "constants";
import { Request, Response } from "express";
import * as crypto from "crypto";
import { execute_sql } from "../sql";
import { exec } from "child_process";
import { createVerify} from "crypto";


export async function post_support_request_upload_url(req: Request, res: Response, backend_pubkey: any ) {
//authenticate
const case_id = req.params.case_uuid;
const signature = req.headers.signature as string;
if(case_id === undefined || signature===undefined)
{
    res.sendStatus(400);
    return;
}
const verify = createVerify("sha512");
verify.write(JSON.stringify(req.body));
verify.end();
const is_verified = verify.verify(backend_pubkey, signature, "hex");
if(!is_verified)
{
    res.sendStatus(401);
    return;
}
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