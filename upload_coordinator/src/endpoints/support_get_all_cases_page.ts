import { Request, Response } from "express";
import { execute_sql } from "../sql";
import { createVerify } from "crypto";

const ITEMS_PER_PAGE = 10;

export async function get_support_get_all_cases_page(req: Request, res: Response, backend_pubkey: any ) {
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
    console.log(req.body.sortBy);
    // Use SQL to query for the top 'ITEMS_PER_PAGE' results, skipping the ammt calculated before
    const count_row = await execute_sql (`SELECT COUNT(guid) as TOTAL FROM cases ORDER BY created_at DESC`);
    const data = await execute_sql (`SELECT * FROM cases ORDER BY created_at DESC LIMIT ${items_per_page} OFFSET ${skipped}`);
    const response = {
        items: data,
        total: Number(count_row[0]['TOTAL']),
    };

    // Return the response after transforming it a bit to only include the data in json in the response
    res.status(200).send(JSON.stringify(response));
}
