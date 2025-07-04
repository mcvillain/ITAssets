import { Request, Response } from "express";
import { get_auth_lvl } from "./auth";
import { IncomingLocalDB, LocalDatabase, OutOfDate} from "../types";
import { LocalDatabases, OutOfDate as OutOfDateCache } from "../const";
import NodeCache from "node-cache";
import { execute_sql } from "../sql";

export async function post_localdb(
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
    let auth_lvl = await get_auth_lvl(session_id, dataMemcache);
    if (auth_lvl !== 2) {
        res.sendStatus(401);
        return;
    }
    console.log("Local DBs Incoming...");
    const incoming_dbs: IncomingLocalDB[] = req.body;
    res.sendStatus(202);
    let _current_dbs: LocalDatabase[] | undefined =
        dataMemcache.get(LocalDatabases);
    let current_dbs: LocalDatabase[];
    if (_current_dbs === undefined) current_dbs = [];
    else current_dbs = _current_dbs;
    current_dbs = delete_outdated_dbs(incoming_dbs, current_dbs);
    current_dbs = update_db_list(incoming_dbs, current_dbs);
    dataMemcache.set(LocalDatabases, current_dbs);
    let ood: OutOfDate = dataMemcache.get(OutOfDateCache) as OutOfDate;
    ood.localDatabases = false;
    dataMemcache.set(OutOfDateCache, ood);
    await delete_dbs_sql();
    await update_dbs_sql(current_dbs);
    console.log("Done processing local databases...");
    return;
}

export async function get_localdb(
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
            data: dataMemcache.get(LocalDatabases),
            ood: ood.localDatabases
        };
        res.json(resp);
        return;
    }
    res.sendStatus(401);
}

export async function get_localdb_csv(
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
        const _data: LocalDatabase[] | undefined =
            dataMemcache.get(LocalDatabases);
        if (_data === undefined) res.sendStatus(500);
        // Send Databases to Client
        const data: LocalDatabase[] = _data as LocalDatabase[];
        let filedata = 'Name, Size, Created, Version, File Paths\n';
        data.forEach((db:LocalDatabase) => {
            filedata+=`${db.name}, ${db.size}, ${db.created}, ${db.version}, ${db.paths.join('|')}\n`;
        });
        res.status(200).contentType('text/csv').send(filedata);
        return;
    }
    res.sendStatus(401);
}

//original but incorrect logic
/*
function delete_outdated_dbs(incoming_dbs: IncomingLocalDB[], current_dbs: LocalDatabase[]): LocalDatabase[] {
    incoming_dbs.forEach((db: IncomingLocalDB) => {
        const matched_db = current_dbs.find((existing_db) => `${existing_db.name}_${existing_db.database_id}` === `${db.name}_${db.database_id}`);
        if (matched_db !== undefined) {
            let idx = current_dbs.indexOf(matched_db);
            if (idx >= 0) {
                current_dbs.splice(idx, 1);
            }
        }
    })
    return current_dbs;
}
*/

//ChatGPT solution
function delete_outdated_dbs(incoming_dbs: IncomingLocalDB[], current_dbs: LocalDatabase[]): LocalDatabase[] {
    const incoming_keys = new Set(incoming_dbs.map(db => `${db.name}_${db.database_id}`));
    return current_dbs.filter(db => incoming_keys.has(`${db.name}_${db.database_id}`));
}


function update_db_list(
    incoming_dbs: IncomingLocalDB[],
    current_dbs: LocalDatabase[]
): LocalDatabase[] {
    incoming_dbs.forEach((db: IncomingLocalDB) => {
        const matched_db = current_dbs.find(
            (existing_db) => `${existing_db.name}_${existing_db.database_id}` === `${db.name}_${db.database_id}`
        );
        if (matched_db !== undefined) {
            matched_db.paths.push(db.path);
            matched_db.size += db.size;
        } else {
            current_dbs.push({
                database_id: db.database_id,
                name: db.name,
                paths: [db.path],
                size: db.size,
                version: db.version,
                created: db.created,
            } as LocalDatabase);
        }
    });
    return current_dbs;
}

function delete_dbs_sql() {
    return execute_sql( // database_id = '${db.database_id}' AND 
        `DELETE FROM local_dbs WHERE 1 = 1`
    );
}
function update_dbs_sql(current_dbs: LocalDatabase[]) {
    current_dbs.forEach((db: LocalDatabase) => {
        const sql_query = `INSERT INTO local_dbs (dbkey, name, size, paths, created, database_id, LastCheckInTime${db.version===undefined||db.version==='null'?'':', version'}) VALUES ('${db.name}_${db.database_id}', '${db.name}', '${db.size}', '${db.paths.join('|')}', '${db.created}', ${db.database_id}, CURRENT_TIMESTAMP()${db.version===undefined?'':', \''+db.version+'\''})`;
        execute_sql(sql_query)
        .catch((error: any) => console.error(`An SQL error occured updating the local databases.\nSQL Query: ${sql_query}\nError:\n${error}`));
    });
}
