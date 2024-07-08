import { Request, Response } from "express";
import { execute_sql } from "../sql";

export async function delete_support_delete_all_cases_files_case_uuid(req: Request, res: Response ) {
    const case_id = req.params.case_uuid;
    const files = await execute_sql(`SELECT file_path FROM files WHERE case_guid = '${case_id}'`);
    files.forEach((file: string) => {
        // Tell Uploader to Delete File
         
    });
    await execute_sql(`DELETE FROM files WHERE case_guid = '${case_id}'`);
    await execute_sql(`DELETE FROM cases WHERE guid = '${case_id}'`);
    res.sendStatus(200);
}