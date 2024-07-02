import { Request, Response } from "express";

import { execute_sql } from "../sql";

export async function get_support_get_case_files_case_uuid(req: Request, res: Response ) {
    const case_id = req.params.case_uuid;
    const response = await execute_sql (`SELECT file_path,file_size,uploaded_at FROM files WHERE case_guid = '${case_id}'`);
    console.log(response);
    res.status(200);
    res.send(JSON.stringify(response));
}