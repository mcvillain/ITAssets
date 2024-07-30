import { Request, Response } from "express";
import { execute_sql } from "../sql";
import { createVerify } from "crypto";
import { get_support_get_all_cases_page } from "./support_get_all_cases_page";

const ITEMS_PER_PAGE = 10;

export async function get_support_get_current_cases_pages(
    req: Request,
    res: Response,
    backend_pubkey: any
) {
    get_support_get_all_cases_page(req, res, backend_pubkey, req.params.owner);
}
