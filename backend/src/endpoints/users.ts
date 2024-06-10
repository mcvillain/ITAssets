import { Request, Response } from "express";
import { get_auth_lvl } from "./auth";
import { Users, IncomingUser } from "../types";
import { Users as UserStore } from "../const";
import NodeCache from "node-cache";

export async function post_users(
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
    const username: string | undefined = loginMemcache.get(session_id);
    if (username === undefined || username != "svc") {
        res.sendStatus(401);
        return;
    }
    console.log("Users Incoming...");
    const incoming_users: IncomingUser[] = req.body.users;
    res.sendStatus(202);
    let new_user_meta = await calculate_user_stats(incoming_users);
    dataMemcache.set(UserStore, new_user_meta);
    console.log("Done processing Users...");
    return;
}

export async function get_users(
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
        res.json(dataMemcache.get(UserStore));
        return;
    }
    res.sendStatus(401);
}

async function calculate_user_stats(
    incoming_users: IncomingUser[]
): Promise<Users> {
    let departments = calc_dept_totals(incoming_users);
    let totalUsers = calc_user_total(incoming_users);
    let serviceAccounts = calc_svc_acc_total(incoming_users);
    let title = calc_title_totals(incoming_users);
    let manager = calc_manager_totals(incoming_users);
    //
    return {
        departments: await departments,
        totalUsers: await totalUsers,
        serviceAccounts: await serviceAccounts,
        title: await title,
        manager: await manager,
    };
}

async function calc_dept_totals(
    incoming_users: IncomingUser[]
): Promise<{ [dept_name: string]: number }> {
    let depts: { [dept_name: string]: number } = {};
    incoming_users.forEach((user: IncomingUser) => {
        if (user.enabled && user.ServiceAccount !== true && user.department !== undefined && user.department !== null) {
            if (depts[user.department]===undefined||depts[user.department]===null)
                depts[user.department] = 0;
            depts[user.department]++;
        }
    });
    return depts;
}

async function calc_title_totals(
    incoming_users: IncomingUser[]
): Promise<{ [title: string]: number }> {
    let titles: { [title: string]: number } = {};
    incoming_users.forEach((user: IncomingUser) => {
        if (user.enabled && user.ServiceAccount !== true && user.title !== undefined && user.title !== null) {
            if (titles[user.title]===undefined||titles[user.title]===null)
                titles[user.title] = 0;
            titles[user.title]++;
        }
    });
    return titles;
}

async function calc_manager_totals(
    incoming_users: IncomingUser[]
): Promise<{ [manager_name: string]: number }> {
    let managers: { [manager_name: string]: number } = {};
    incoming_users.forEach((user: IncomingUser) => {
        if (user.enabled && user.ServiceAccount !== true && user.manager !== undefined && user.manager !== null) {
            if (managers[user.manager]===undefined||managers[user.manager]===null)
                managers[user.manager] = 0;
            managers[user.manager]++;
        }
    });
    return managers;
}

async function calc_user_total(
    incoming_users: IncomingUser[]
): Promise<number> {
    let users = 0;
    incoming_users.forEach((user: IncomingUser) => {
        if (user.enabled && user.ServiceAccount !== true) {
            users++;
        }
    });
    return users;
}

async function calc_svc_acc_total(
    incoming_users: IncomingUser[]
): Promise<number> {
    let svcAccts = 0;
    incoming_users.forEach((user: IncomingUser) => {
        if (user.enabled && user.ServiceAccount === true) {
            svcAccts++;
        }
    });
    return svcAccts;
}
