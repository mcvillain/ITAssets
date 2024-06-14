import { Request, Response } from "express";
import { get_auth_lvl } from "./auth";
import { IncomingAzureDB, AzureDatabase } from "../types";
import { AzureDatabases } from "../const";
import NodeCache from "node-cache";
import { getAzDBPricePerGB } from "../util";

export async function post_azuredb(
    req: Request,
    res: Response,
    dataMemcache: NodeCache,
    loginMemcache: NodeCache,
    sizePriceCache: NodeCache
) {
    const session_id = req.cookies["session_id"];
    if (session_id === undefined) {
        res.sendStatus(401);
        return;
    }
    const username: string | undefined = loginMemcache.get(session_id);
    if (username === undefined || username != "svc") {
        res.sendStatus(401);
        return;
    }
    console.log("Azure DBs Incoming...");
    const incoming_dbs: IncomingAzureDB[] = req.body;
    res.sendStatus(202);
    let _current_dbs: AzureDatabase[] | undefined =
        dataMemcache.get(AzureDatabases);
    let current_dbs: AzureDatabase[];
    if (_current_dbs === undefined) current_dbs = [];
    else current_dbs = _current_dbs;
    current_dbs = delete_outdated_dbs(incoming_dbs, current_dbs);
    let pricePerGig = await getAzDBPricePerGB(sizePriceCache);
    current_dbs = await update_db_list(
        incoming_dbs,
        current_dbs,
        pricePerGig
    );
    dataMemcache.set(AzureDatabases, current_dbs);
    console.log("Done processing Azure databases...");
    return;
}

export async function get_azuredb(
    req: Request,
    res: Response,
    dataMemcache: NodeCache,
    loginMemcache: NodeCache
) {
    const session_id = req.cookies["session_id"];
    if (session_id === undefined) {
        res.sendStatus(401);
        return;
    }
    const auth_lvl = await get_auth_lvl(session_id, loginMemcache);
    if (auth_lvl > 0) {
        res.json(dataMemcache.get(AzureDatabases));
        return;
    }
    res.sendStatus(401);
}

function delete_outdated_dbs(incoming_dbs: IncomingAzureDB[], current_dbs: AzureDatabase[]): AzureDatabase[] {
    incoming_dbs.forEach((db: IncomingAzureDB) => {
        const matched_db = current_dbs.find((existing_db) => existing_db.database_id === db.database_id);
        if (matched_db !== undefined) {
            let idx = current_dbs.indexOf(matched_db);
            if (idx >= 0) {
                current_dbs.splice(idx, 1);
            }
        }
    })
    return current_dbs;
}

function update_db_list(
    incoming_dbs: IncomingAzureDB[],
    current_dbs: AzureDatabase[],
    pricePerGig: number
): AzureDatabase[] {
    incoming_dbs.forEach(async (db: IncomingAzureDB) => {
        const matched_db = current_dbs.find(
            (existing_db) => existing_db.database_id === db.database_id
        );
        if (matched_db !== undefined) {
            if (matched_db.paths.indexOf(db.path) < 0) {
                matched_db.paths.push(db.path);
                matched_db.size += db.size;
            }
        } else {
            let price = db.size * pricePerGig;
            current_dbs.push({
                database_id: db.database_id,
                name: db.name,
                paths: [db.path],
                size: db.size,
                // version: db.version,
                created: db.created,
                cost: price,
            });
        }
    });
    return current_dbs;
}
