import { Request, Response } from "express";
import { execute_sql } from "../sql";

export async function get_support_get_case_owner(req: Request, res: Response) {
    // Use SQL to query for the top 'ITEMS_PER_PAGE' results, skipping the ammt calculated before
    const response = await execute_sql (`SELECT owner FROM cases WHERE guid = ${req.params.case_uuid}`);
    res.status(200);
    res.send(JSON.stringify(response));
}