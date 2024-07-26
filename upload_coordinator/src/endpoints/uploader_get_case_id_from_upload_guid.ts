import { Request, Response } from "express";
import { execute_sql } from "../sql";
import { createVerify } from "crypto";

export async function get_uploader_get_case_id_from_upload_guid(req: Request, res: Response, uploader_pubkey: any) {
    if (req.params.guid === undefined) {
        res.sendStatus(404);
        return;
    }
    const signature = req.headers.signature as string;
    const message = req.params.guid;
    if (message === undefined || signature === undefined) {
        res.sendStatus(400);
        return;
    }
    const verify = createVerify("sha512");
    verify.write(message);
    verify.end();
    const is_verified = verify.verify(uploader_pubkey, signature, "hex");
    console.log(`${signature} | ${message} | ${is_verified}`);
    if (!is_verified) {
        res.sendStatus(401);
        return;
    }
    const upload_guid = req.params.guid;
    const case_id = await execute_sql(`SELECT case_id FROM cases WHERE guid = '${upload_guid}'`);
    if (case_id[0].case_id === undefined) {
        res.sendStatus(404);
        return;
    }
    res.status(200).send(String(case_id[0].case_id));
}