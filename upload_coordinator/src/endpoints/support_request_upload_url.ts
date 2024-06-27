import exp from "constants";
import { Request, Response } from "express";
import * as crypto from "crypto";



export async function post_support_request_upload_url(req: Request, res: Response ) {
    // Get CaseID from request body
    // Generate New GUID use 
    const uuid: string = crypto.randomUUID();
    // Create entry in cases table that contains the caseID and guid... the timestamp gets assigned by MariaDB
    // Return the GUID in the response
}