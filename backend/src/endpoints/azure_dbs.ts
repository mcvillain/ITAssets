import { Request, Response } from "express";
import { get_auth_lvl } from "./auth";
import { IncomingAzureDB, AzureDatabase, OutOfDate, convertIsoToEst } from "../types";
import { AzureDatabases, OutOfDate as OutOfDateCache } from "../const";
import NodeCache from "node-cache";
import { getAzDBPricePerGB } from "../util";
import { execute_sql } from "../sql";
import { Stream } from "stream";

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
    let auth_lvl = await get_auth_lvl(session_id, dataMemcache);
    if (auth_lvl !== 2) {
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
    current_dbs = await update_db_list(incoming_dbs, current_dbs, pricePerGig);
    dataMemcache.set(AzureDatabases, current_dbs);
    let ood: OutOfDate = dataMemcache.get(OutOfDateCache) as OutOfDate;
    ood.azureDatabases = false;
    dataMemcache.set(OutOfDateCache, ood);
    await delete_dbs_sql();
    await update_dbs_sql(current_dbs);
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
        let ood: OutOfDate = dataMemcache.get(OutOfDateCache) as OutOfDate;
        let resp = {
            data: dataMemcache.get(AzureDatabases),
            ood: ood.azureDatabases,
        };
        res.json(resp);
        return;
    }
    res.sendStatus(401);
}

export async function get_azuredb_csv(
    req: Request,
    res: Response,
    dataMemcache: NodeCache,
    loginMemcache: NodeCache
) {
    // Check authentication level
    const session_id = req.cookies["session_id"];
    if (session_id === undefined) {
        res.sendStatus(401);
        return;
    }
    const auth_lvl = await get_auth_lvl(session_id, loginMemcache);
    if (auth_lvl > 0) {
        const _data: AzureDatabase[] | undefined =
            dataMemcache.get(AzureDatabases);
        if (_data === undefined) res.sendStatus(500);
        // Send Databases to Client
        const data: AzureDatabase[] = _data as AzureDatabase[];
        let filedata = 'Name, Size, Created, Version, Cost, File Paths\n';
        data.forEach((db:AzureDatabase) => {
            filedata+=`${db.name}, ${db.size}, ${convertIsoToEst(db.created)}, ${db.version}, ${db.cost}, ${db.paths.join('|')}\n`;
        });
        res.status(200).contentType('text/csv').send(filedata);
        return;
    }
    res.sendStatus(401);
}

function delete_outdated_dbs(
    incoming_dbs: IncomingAzureDB[],
    current_dbs: AzureDatabase[]
): AzureDatabase[] {
    incoming_dbs.forEach((db: IncomingAzureDB) => {
        const matched_db = current_dbs.find(
            (existing_db) => existing_db.database_id === db.database_id
        );
        if (matched_db !== undefined) {
            let idx = current_dbs.indexOf(matched_db);
            if (idx >= 0) {
                current_dbs.splice(idx, 1);
            }
        }
    });
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
                version: db.version,
                created: db.created,
                cost: price,
            } as AzureDatabase);
        }
    });
    return current_dbs;
}

function delete_dbs_sql() {
    execute_sql( // database_id = '${db.database_id}' AND 
        `DELETE FROM azure_dbs WHERE itar = FALSE`
    );
}
function update_dbs_sql(current_dbs: AzureDatabase[]) {
    current_dbs.forEach((db: AzureDatabase) => {
        const sql_query = `INSERT INTO azure_dbs (name, size, paths, created, database_id, cost${db.version === undefined || db.version === "null"? "": ", version"}, itar) 
            VALUES 
            ('${db.name}', '${db.size}', '${db.paths.join("|")}', '${db.created}', ${db.database_id}, ${db.cost}${db.database_id}${db.version === undefined || db.version === "null"? "" : ", '" + db.version + "'"}, FALSE)`;
        execute_sql(sql_query)
        .catch((error: any) => console.error(`An SQL error occured updating the local databases.\nSQL Query: ${sql_query}\nError:\n${error}`));
    });
}
