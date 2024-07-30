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
    // Check ITAR
    const case_info = await execute_sql(`SELECT itar FROM cases WHERE case_id = '${case_id}'`);
    if (case_info.length <= 0) {
        res.sendStatus(404);
        return;
    }
    const itar = case_info[0].itar;
    const file_info = await execute_sql(`SELECT guid FROM files WHERE case_id = '${case_id}'`);
    if (file_info.length <= 0) {
        await erase_db(case_id);
        res.sendStatus(200);
        return;
    }
    // Resign message and send to uploader
    let sign = createSign("sha512");
    sign.write(msg);
    sign.end();
    const new_signature = sign.sign(coordinator_privkey, "hex");
    fetch(
        `${itar?process.env.ITAR_UPLOADER_URL:process.env.UPLOADER_URL}/api/delete_files/${msg}`,
        {
            headers: new Headers({
                signature: new_signature,
            }),
            method: "DELETE",
        }
    )
        .then(async (resp) => {
            if (resp.ok) {
                await erase_db(case_id);
                res.sendStatus(200);
                return;
            }
            console.error(await resp.text());
            res.sendStatus(500);
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        })
}

async function erase_db(case_id: any) {
    await execute_sql(
        `DELETE FROM files WHERE case_id = '${case_id}'`
    );
    await execute_sql(
        `DELETE FROM cases WHERE case_id = '${case_id}'`
    );
}