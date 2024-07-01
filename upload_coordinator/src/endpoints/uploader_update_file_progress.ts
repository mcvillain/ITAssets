import { Request, Response } from "express";
import { execute_sql } from "../sql";

export async function post_uploader_update_file_progress(
    req: Request,
    res: Response
) {
    // Same as checkin new file - no case id
    // Request file metadata
    let file_metadata = req.body.upload;

    res.sendStatus(202);
    // UPDATE the sql when this is called
    if (file_metadata.id != null) {
        await execute_sql(
            `UPDATE files SET upload_complete=true WHERE guid = '${file_metadata.id}'`
        );
    }
}
