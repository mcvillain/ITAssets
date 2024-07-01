import { Request, Response } from "express";

import { execute_sql } from "../sql";

const ITEMS_PER_PAGE = 10;

export async function get_support_get_all_cases_page(req: Request, res: Response ) {
    // Get the page number from 'req'
    const page_number = parseInt(req.params.page, 10);
    // Calculate how many items we skip (page# * ITEMS_PER_PAGE)
    const skipped = page_number * ITEMS_PER_PAGE;
    // Use SQL to query for the top 'ITEMS_PER_PAGE' results, skipping the ammt calculated before
    const response = await execute_sql (`SELECT * FROM cases ORDER BY created_at DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${skipped}`);

    // Return the response after transforming it a bit to only include the data in json in the response
    res.status(200);
    res.send(JSON.stringify(response));
}
