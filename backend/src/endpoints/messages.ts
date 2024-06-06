import { Request, Response } from "express";
import { get_auth_lvl } from "./auth";
import { Message } from "../types";
import { Message as CurrentMessage } from '../const';
import NodeCache from "node-cache";

export async function post_messages(req: Request, res: Response, dataMemcache: NodeCache, loginMemcache: NodeCache) {
    const session_id = req.cookies['session_id'];
    const auth_lvl = await get_auth_lvl(session_id, loginMemcache);
    if (auth_lvl >= 3) {
        const msg: string = req.body.message;
        const timestamp: Date = req.body.timestamp;
        const new_msg = new Message(msg, timestamp);
        await dataMemcache.set(CurrentMessage, new_msg);
        res.sendStatus(200);
    }
    res.sendStatus(401);
}

export async function get_messages(req: Request, res: Response, dataMemcache: NodeCache, loginMemcache: NodeCache) {
    const session_id = req.cookies['session_id'];
    const auth_lvl = await get_auth_lvl(session_id, loginMemcache);
    if (auth_lvl > 0) {
        const msg: Message | undefined = await dataMemcache.get(CurrentMessage);
        if (msg != undefined) {
            res.status(200).send(JSON.stringify({ message: msg.data, timestamp: msg.timestamp }));
            return;
        } else {
            res.sendStatus(500);
            return;
        }
    }
    res.sendStatus(401);
}