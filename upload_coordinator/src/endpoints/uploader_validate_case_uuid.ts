import { Request, Response } from "express";
import { execute_sql } from "../sql";

export async function get_uploader_validate_case_uuid(req: Request, res: Response ) {

    //Request uuid
    let case_uuid = req.params.case_uuid;
    // Compare UUID 
    if((await execute_sql(`SELECT guid FROM cases WHERE guid = '${case_uuid}'`)).length() == 1){
        res.sendStatus(200)
    }else{
        res.sendStatus(410)
    }
}