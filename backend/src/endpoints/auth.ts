import { Request, Response } from "express";
import { createHash } from "crypto";
import NodeCache from "node-cache";

function hash_pwd(pwd: string, salt: string): string {
    const hash = createHash("sha256");
    hash.update(pwd + salt);
    return hash.digest("hex");
}

class Account {
    constructor(username: string, pass: string, auth_level: number) {
        this.username = username;
        const decode = new TextDecoder();
        this.salt = decode.decode(crypto.getRandomValues(new Uint8Array(32)));
        this.pass_hash = hash_pwd(pass, this.salt);
        this.auth_level = auth_level;
    }
    username!: string;
    pass_hash!: string;
    salt!: string;
    auth_level!: number;
}

const valid_accounts: { [name: string]: Account } = {};
function create_account(
    username: string,
    password: string,
    auth_level: number
) {
    if (
        valid_accounts[username] == undefined ||
        valid_accounts[username] == null
    )
        valid_accounts[username] = new Account(username, username, auth_level);
}
function populate_accounts() {
    create_account("aegis", "aegis", 1);
    create_account("svc", "", 2);
    create_account("admin", "Interns2023@Aegis", 3);
}

async function create_session(
    username: string,
    memcache: NodeCache
): Promise<string> {
    const session_id = crypto.randomUUID();
    await memcache.set(session_id, username);
    return session_id;
}

export async function post_login(
    req: Request,
    res: Response,
    memcache: NodeCache
) {
    populate_accounts();
    const username = req.body.username;
    const password = req.body.password;
    if (
        valid_accounts[username] != undefined &&
        valid_accounts[username] != null
    ) {
        const account: Account = valid_accounts[username];
        const pass_hash = await hash_pwd(password, account.salt);
        if (pass_hash == account.pass_hash) {
            const session_id = await create_session(username, memcache);
            res.cookie("session_id", session_id, {
                maxAge: 28800000, // 8 Hours
                path: "/",
            });
            res.sendStatus(200);
            // res.send(session_id);
            return;
        }
    }
    res.sendStatus(401);
}

export async function get_auth_lvl(
    session_id: string,
    memcache: NodeCache
): Promise<number> {
    const username: string | undefined = await memcache.get(session_id);
    if (username != undefined) {
        const user: Account = valid_accounts[username];
        const auth_level = user.auth_level;
        return auth_level;
    }
    return 0;
}

export async function get_auth(
    req: Request,
    res: Response,
    memcache: NodeCache
) {
    const session_id = req.cookies["session_id"];
    if (session_id == undefined) {
        console.log(req.cookies);
        res.sendStatus(500);
        return;
    }
    const auth_lvl = get_auth_lvl(session_id, memcache);
    res.status(200);
    res.send(auth_lvl);
}
