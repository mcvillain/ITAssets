import exp from "constants";
import { Request, Response } from "express";
import { execute_sql } from "../sql";
import { exec } from "child_process";
export async function post_uploader_checkin_new_file(
    req: Request,
    res: Response
) {
    // Request case_guid
    let case_guid = req.body.case_guid;
    // Request file metadata
    let file_metadata = req.body.upload;
    res.sendStatus(202);

    // SQL Insert in Files Table links to case_guid
    await execute_sql(`INSERT INTO files (guid, file_path, case_guid, file_size) VALUES ('${file_metadata.id}', '${file_metadata.metadata.filename}', '${case_guid}', '${file_metadata.size}')`);
}
