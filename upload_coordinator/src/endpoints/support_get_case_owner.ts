import { Request, Response } from "express";
import { execute_sql } from "../sql";
import {createVerify} from "crypto";

export async function get_support_get_case_owner(req: Request, res: Response, backend_pubkey: any) {
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
    // Use SQL to query for the top 'ITEMS_PER_PAGE' results, skipping the ammt calculated before
    const response = await execute_sql (`SELECT * FROM cases WHERE case_id = ${req.params.case_uuid}`);
    const resp = JSON.stringify(response[0]);
    res.status(200).send(resp);
}