import exp from "constants";
import { Request, Response } from "express";
import { execute_sql } from "../sql";
import { exec } from "child_process";
import { verify, sign, createSign, createVerify } from 'crypto';
import fs from 'fs';

export async function post_uploader_checkin_new_file(
    req: Request,
    res: Response,
    uploader_pubkey: any,
    
) {
    const message = req.body;
    const signature = req.headers.signature as string;
    let verify = createVerify('sha512');
    verify.write(JSON.stringify(message));
    verify.end();
    const isVerified = verify.verify(uploader_pubkey, signature, 'hex');
    if (isVerified) {
        // Request case_guid
        let case_guid = req.body.upload.metadata.case_id;
        // Request file metadata
        let file_metadata = req.body.upload;
        // SQL Insert in Files Table links to case_guid
        await execute_sql(`INSERT INTO files (guid, file_path, case_guid, file_size) VALUES ('${file_metadata.id}', '${file_metadata.metadata.filename}', '${case_guid}', '${file_metadata.size}')`);
        res.sendStatus(202);
    } else {
        res.sendStatus(401);
        return;
    }
}
