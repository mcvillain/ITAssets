import { Request, Response } from "express";
import { execute_sql } from "../sql";
import { verify, sign, createSign, createVerify } from 'crypto';
import fs from 'fs';

export async function get_uploader_validate_case_uuid(req: Request, res: Response, uploader_pubkey: any) {
    const case_uuid = req.params.case_uuid;
    const signature = req.headers.signature as string;
    let verify = createVerify('sha512');
    verify.write(case_uuid);
    verify.end();
    const isVerified = verify.verify(uploader_pubkey, signature, 'hex');
    if (isVerified) {
        //Request uuid
        const resp = await execute_sql(`SELECT guid, itar FROM cases WHERE guid = '${case_uuid}' AND upload_url_active = TRUE`);
        if (resp.length == 1) {
            res.status(200).send(JSON.stringify({itar:resp[0].itar}));
        } else {
            res.sendStatus(410)
        }
    } else {
        res.sendStatus(401);
        return;
    }
}