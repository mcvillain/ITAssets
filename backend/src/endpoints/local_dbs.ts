import { Request, Response } from "express";
import { get_auth_lvl } from "./auth";
import { IncomingLocalDB, LocalDatabase, Message, Server } from "../types";
import { LocalDatabases } from "../const";
import NodeCache from "node-cache";

export async function post_localdb(
    req: Request,
    res: Response,
    dataMemcache: NodeCache,
    loginMemcache: NodeCache,
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
    console.log("Local DBs Incoming...");
    const incoming_dbs: IncomingLocalDB[] = req.body;
    res.sendStatus(202);
    let _current_dbs: LocalDatabase[] | undefined = dataMemcache.get(LocalDatabases);
    let current_dbs: LocalDatabase[];
    if (_current_dbs === undefined) current_dbs = [];
    else current_dbs = _current_dbs;
    let new_dbs: LocalDatabase[] = update_db_list(incoming_dbs, current_dbs);
    dataMemcache.set(LocalDatabases, new_dbs);
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
        res.json(dataMemcache.get(LocalDatabases));
        return;
    }
    res.sendStatus(401);
}

function update_db_list(incoming_dbs: IncomingLocalDB[], current_dbs: LocalDatabase[]): LocalDatabase[] {
    let new_db_list: LocalDatabase[] = [];
    incoming_dbs.forEach((db: IncomingLocalDB) => {
        if (current_dbs.some(existing_db => existing_db.database_id === db.database_id)) {
            const matched_db = current_dbs.find(existing_db => existing_db.database_id === db.database_id);
            if (matched_db === undefined) return;
            matched_db.paths.push(db.path);
            matched_db.size += db.size;
            new_db_list.push(matched_db);
        } else {
            new_db_list.push({
                database_id: db.database_id,
                name: db.name,
                paths: [db.path],
                size: db.size,
                version: db.version,
                created: db.created,
            });
        }
    });
    return new_db_list;
}