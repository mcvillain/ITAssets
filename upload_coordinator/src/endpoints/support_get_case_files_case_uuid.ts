import { Request, Response } from "express";
import { execute_sql } from "../sql";
import {createVerify} from "crypto";

export async function get_support_get_case_files_case_uuid(req: Request, res: Response , backend_pubkey: any ) {
    //authenticate
    const case_id = req.params.case_uuid;
    const signature = req.headers.signature as string;
    if(case_id === undefined || signature===undefined)
    {
        res.sendStatus(400);
        return;
    }
    const verify = createVerify("sha512");
    verify.write(case_id);
    verify.end();
    const is_verified = verify.verify(backend_pubkey, signature, "hex");
    if(!is_verified)
    {
        res.sendStatus(401);
        return;
    }
    const data = await execute_sql (`SELECT file_path,file_size,uploaded_at FROM files WHERE case_guid = '${case_id}'`);
    const response = {
        items: data
    }
    console.log(response);
    res.status(200);
    res.send(JSON.stringify(response));
}