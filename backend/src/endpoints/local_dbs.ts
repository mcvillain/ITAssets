import { Request, Response } from "express";
import { get_auth_lvl } from "./auth";
import { IncomingLocalDB, LocalDatabase, OutOfDate } from "../types";
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
    const sqldel = delete_outdated_dbs_sql(incoming_dbs);
    current_dbs = delete_outdated_dbs(incoming_dbs, current_dbs);
    current_dbs = update_db_list(incoming_dbs, current_dbs);
    dataMemcache.set(LocalDatabases, current_dbs);
    let ood: OutOfDate = dataMemcache.get(OutOfDateCache) as OutOfDate;
    ood.localDatabases = false;
    dataMemcache.set(OutOfDateCache, ood);
    await sqldel;
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

function delete_outdated_dbs(incoming_dbs: IncomingLocalDB[], current_dbs: LocalDatabase[]): LocalDatabase[] {
    incoming_dbs.forEach((db: IncomingLocalDB) => {
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

function delete_outdated_dbs_sql(incoming_dbs: IncomingLocalDB[]) {
    incoming_dbs.forEach((db: IncomingLocalDB) => {
        execute_sql(`DELETE FROM local_dbs WHERE database_id = '${db.database_id}'`);
    })
}

function update_db_list(
    incoming_dbs: IncomingLocalDB[],
    current_dbs: LocalDatabase[]
): LocalDatabase[] {
    incoming_dbs.forEach((db: IncomingLocalDB) => {
        const matched_db = current_dbs.find(
            (existing_db) => existing_db.database_id === db.database_id
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
            });
        }
    });
    return current_dbs;
}

function update_dbs_sql(current_dbs: LocalDatabase[]) {
    current_dbs.forEach((db: LocalDatabase) => {
        execute_sql(`INSERT INTO local_dbs (name, size, paths, created, database_id${db.version===undefined||db.version==='null'?'':', version'}) VALUES ('${db.name}', '${db.size}', '${db.paths.join('|')}', '${db.created}', ${db.database_id}${db.version===undefined?'':', \''+db.version+'\''})`);
    });
}