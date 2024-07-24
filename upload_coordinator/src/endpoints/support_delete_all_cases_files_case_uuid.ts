import { Request, Response } from "express";
import { execute_sql } from "../sql";
import { createVerify, createSign } from "crypto";

const UPLOAD_SERVICE = "itassets-coordinator-service:3000";

export async function delete_support_delete_all_cases_files_case_uuid(
    req: Request,
    res: Response,
    coordinator_privkey: any,
    backend_pubkey: any
) {
    const case_id = req.params.case_uuid;
    // Tell Uploader to Delete File
    let msg: string = req.params.case_uuid;
    const signature = req.headers.signature as string;
    let verify = createVerify("sha512");
    verify.write(msg);
    verify.end();
    const isVerified = verify.verify(backend_pubkey, signature, "hex");
    if (!isVerified) {
        res.sendStatus(401);
        return;
    }
    // Resign message and send to uploader
    let sign = createSign("sha512");
    sign.write(msg);
    sign.end();
    const new_signature = sign.sign(coordinator_privkey, "hex");
    let uploader_url = '';
    fetch(
        `${uploader_url}/support/delete_all_case_files/${msg}`,
        {
            headers: new Headers({
                signature: new_signature,
            }),
            method: "DELETE",
        }
    )
        .then(async (resp) => {
            if (resp.ok) {
                res.sendStatus(200);

                await execute_sql(
                    `DELETE FROM files WHERE case_guid = '${case_id}'`
                );
                await execute_sql(
                    `DELETE FROM cases WHERE guid = '${case_id}'`
                );
            }
        })
        .catch((err) => {
            console.error(err);
        })
        .finally(() => {
            if (!res.closed) res.sendStatus(500);
        });
}
