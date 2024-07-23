import { Request, Response } from "express";
import { execute_sql } from "../sql";
import { verify, sign, createSign, createVerify } from 'crypto';
import fs from 'fs';

export async function get_uploader_validate_case_uuid(req: Request, res: Response, uploader_pubkey: any) {
    const case_uuid = req.params.case_uuid;
    const signature = req.headers.signature as string;
    let verify = createVerify('SHA256');
    verify.write(JSON.stringify(case_uuid));
    verify.end();
    const isVerified = verify.verify(uploader_pubkey, signature, 'base64');
    if (isVerified) {
        //Request uuid
        if ((await execute_sql(`SELECT guid FROM cases WHERE guid = '${case_uuid}'`)).length() == 1) {
            res.sendStatus(200)
        } else {
            res.sendStatus(410)
        }
    } else {
        res.sendStatus(401);
        return;
    }
}