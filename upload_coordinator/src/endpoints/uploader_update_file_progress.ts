import { Request, Response } from "express";
import { execute_sql } from "../sql";
import { verify, sign, createSign, createVerify } from 'crypto';

export async function post_uploader_update_file_progress(
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
        // Request file metadata
        let file_metadata = req.body.upload;
        // UPDATE the sql when this is called
        if (file_metadata.id != null) {
            await execute_sql(
                `UPDATE files SET upload_complete=true WHERE guid = '${file_metadata.id}'`
            );
        }
        res.sendStatus(202);
    } else {
        res.sendStatus(401);
        return;
    }
}
