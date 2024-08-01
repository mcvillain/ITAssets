import { Request, Response } from "express";
import { execute_sql } from "../sql";
import { createVerify } from "crypto";

const ITEMS_PER_PAGE = 10;

export async function get_support_get_all_cases_page(req: Request, res: Response, backend_pubkey: any, owner: string|null = null) {
    const signature = req.headers.signature as string;
    const message = req.headers.verify as string;
    if (message === undefined || signature === undefined) {
        res.sendStatus(400);
        return;
    }
    const verify = createVerify("sha512");
    verify.write(message);
    verify.end();
    const is_verified = verify.verify(backend_pubkey, signature, "hex");
    if (!is_verified) {
        res.sendStatus(401);
        return;
    }
    console.log(req.body);
    // Get the page number from 'req'
    const page_number = parseInt(req.body.page)-1;
    const items_per_page = parseInt(req.body.itemsPerPage);
    // Calculate how many items we skip (page# * ITEMS_PER_PAGE)
    const skipped = page_number * items_per_page;
    // Generate the search WHERE clauses
    const search = req.body.search as string;
    const searchTerms = search?search.split(" ").map((term: string) => `%${term}%`):[];
    const ownerClause = owner===null?'(':`c.owner = '${owner}' AND (`;
    const whereClause = (owner!==null?` WHERE ${ownerClause}`:' WHERE (')+(search.length>0?searchTerms.map(term => `c.case_id LIKE '${term}' OR c.owner LIKE '${term}')`).join(' OR '): '1=1') + ')';
    const sortBy = req.body.sortBy;
    const sortClause = (sortBy.length > 0)?`ORDER BY '${sortBy[0].key as string}' ${(sortBy[0].order as string).toUpperCase()}`:'ORDER BY c.created_at DESC';
    // Use SQL to query for the top 'ITEMS_PER_PAGE' results, skipping the ammt calculated before
    const count_row = await execute_sql (`SELECT COUNT(guid) as TOTAL FROM cases c${whereClause}`);
    const data = await execute_sql (`SELECT c.guid as guid, c.case_id as case_id, c.owner as owner, c.upload_url_active as upload_url_active, c.created_at as created_at, c.itar as itar, case_size FROM cases c LEFT JOIN (SELECT case_id, SUM(file_size) AS case_size FROM files GROUP BY case_id) f ON c.case_id=f.case_id${whereClause} ${sortClause} LIMIT ${items_per_page} OFFSET ${skipped}`);
    const response = {
        items: data,
        total: Number(count_row[0]['TOTAL']),
    };

    // Return the response after transforming it a bit to only include the data in json in the response
    res.status(200).send(JSON.stringify(response));
}
