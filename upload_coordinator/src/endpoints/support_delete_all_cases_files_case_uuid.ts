import { Request, Response } from "express";
import { execute_sql } from "../sql";
import {
    SignedMessage,
    signMessage,
} from "../../../backend/src/endpoints/uploads/signing";

const UPLOAD_SERVICE = "itassets-coordinator-service:3000";

export async function delete_support_delete_all_cases_files_case_uuid(
    req: Request,
    res: Response
) {
    const case_id = req.params.case_uuid;
    // Tell Uploader to Delete File
    let msg: string = req.params.case_uuid;
    let message: SignedMessage = signMessage(msg);
    fetch(
        `${UPLOAD_SERVICE}/support/delete_all_case_files/${message.message}`,
        {
            headers: new Headers({
                signature: message.signature,
            }),
            method: "DELETE",
        }
    )
        .then((resp) => {
            if (resp.ok) res.sendStatus(200);
        })
        .catch((err) => {
            console.error(err);
        })
        .finally(() => {
            if (!res.closed) res.sendStatus(500);
        });

    await execute_sql(`DELETE FROM files WHERE case_guid = '${case_id}'`);
    await execute_sql(`DELETE FROM cases WHERE guid = '${case_id}'`);
}
