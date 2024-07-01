import { Request, Response } from "express";
import { get_auth_lvl } from "./auth";
import { Users, IncomingUser, OutOfDate } from "../types";
import { Users as UserStore, OutOfDate as OutOfDateCache } from "../const";
import NodeCache from "node-cache";
import { execute_sql } from "../sql";

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
    let auth_lvl = await get_auth_lvl(session_id, dataMemcache);
    if (auth_lvl !== 2) {
        res.sendStatus(401);
        return;
    }
    console.log("Users Incoming...");
    const incoming_users: IncomingUser[] = req.body.users;
    res.sendStatus(202);
    let new_user_meta = await calculate_user_stats(incoming_users);
    dataMemcache.set(UserStore, new_user_meta);
    let ood: OutOfDate = dataMemcache.get(OutOfDateCache) as OutOfDate;
    ood.users = false;
    dataMemcache.set(OutOfDateCache, ood);
    await update_users_sql(new_user_meta);
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
        let ood: OutOfDate = dataMemcache.get(OutOfDateCache) as OutOfDate;
        let resp = {
            data: dataMemcache.get(UserStore),
            ood: ood.users
        };
        res.json(resp);
        return;
    }
    res.sendStatus(401);
}

async function update_users_sql(users: Users) {
    await execute_sql(`DELETE FROM users WHERE 1`);
    await execute_sql(`INSERT INTO users (totalUsers, value) VALUES (TRUE, ${users.totalUsers})`);
    await execute_sql(`INSERT INTO users (serviceAccounts, value) VALUES (TRUE, ${users.serviceAccounts})`);
    Object.keys(users.departments).forEach(async (dept_name: string) => {
        await execute_sql(`INSERT INTO users (department, name, value) VALUES (TRUE, '${dept_name}', ${users.departments[dept_name]})`);
    });
    Object.keys(users.manager).forEach(async (manager_name: string) => {
        await execute_sql(`INSERT INTO users (manager, name, value) VALUES (TRUE, '${manager_name}', ${users.manager[manager_name]})`);
    });
    Object.keys(users.title).forEach(async (title_name: string) => {
        await execute_sql(`INSERT INTO users (title, name, value) VALUES (TRUE, '${title_name}', ${users.title[title_name]})`);
    });
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
