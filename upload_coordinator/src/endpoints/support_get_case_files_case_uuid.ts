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
    const page_number = parseInt(req.body.page)-1;
    const items_per_page = parseInt(req.body.itemsPerPage);
    const skipped = page_number * items_per_page;
    const search = req.body.search as string;
    const searchTerms = search?search.split(" ").map((term: string) => `%${term}%`):[];
    const whereClause = search.length>0?' AND ('+searchTerms.map(term => `(file_path LIKE '${term}')`).join(' OR ')+')': '';
    const sortBy = req.body.sortBy;
    const sortClause = (sortBy.length > 0)?`ORDER BY '${sortBy[0].key as string}' ${(sortBy[0].order as string).toUpperCase()}`:'ORDER BY uploaded_at DESC';
    const total = await execute_sql (`SELECT COUNT(guid) AS TOTAL FROM files WHERE case_id = '${case_id}'${whereClause}`);
    const data = await execute_sql (`SELECT file_path,file_size,uploaded_at,upload_complete FROM files WHERE case_id = '${case_id}'${whereClause} ${sortClause}${items_per_page>0?' LIMIT '+items_per_page+' OFFSET '+skipped:''}`);
    const response = {
        items: data,
        total:  Number(total[0]['TOTAL']),
    };
    res.status(200);
    res.send(JSON.stringify(response));
}