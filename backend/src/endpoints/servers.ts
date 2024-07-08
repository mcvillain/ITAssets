import request from "then-request";
import { Request, Response } from "express";
import { get_auth_lvl } from "./auth";
import { OutOfDate, Server } from "../types";
import { OutOfDate as OutOfDateCache, Servers } from "../const";
import NodeCache from "node-cache";
import { execute_sql } from "../sql";

export async function post_servers(
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
    console.log("Servers Incoming...");
    const incoming_servers: Server[] = req.body.Servers;
    res.sendStatus(202);
    let _servers: Server[] | undefined = dataMemcache.get(Servers);
    let servers: Server[];
    if (_servers === undefined) servers = [];
    else servers = _servers;
    let new_servers: Server[] = update_server_list(incoming_servers, servers);
    for (let i = 0; i < new_servers.length; i++) {
        let currSize: string | undefined = new_servers[i].Size;
        if (currSize !== undefined && currSize !== null && currSize !== 'null')
            new_servers[i]["Cost"] = await getSizePrice(
                currSize,
                sizePriceCache
            );
        // console.log(
        //     `Server ${i} with size '${currSize}' is \$${new_servers[i].Cost}`
        // );
    }
    dataMemcache.set(Servers, new_servers);
    let ood: OutOfDate = dataMemcache.get(OutOfDateCache) as OutOfDate;
    ood.servers = false;
    dataMemcache.set(OutOfDateCache, ood);
    await update_servers_sql(new_servers);
    console.log("Done processing servers...");
    return;
}

function update_servers_sql(servers: Server[]) {
    servers.forEach(async (server: Server) => {
        await execute_sql(`DELETE FROM servers WHERE VMName = '${server.VMName}'`);
        await execute_sql(`INSERT INTO servers (status, IP, VMName, HyperVisor, Hostname, Size, Cost) VALUES ('${server.Status}', '${server.IP}', '${server.VMName}', '${server.HyperVisor}', '${server.Hostname!==null&&server.Hostname.length>0?server.Hostname:' '}', '${server.Size===undefined?null:server.Size}', ${server.Cost===undefined?null:server.Cost})`);
    })
}

export async function get_servers(
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
            data: dataMemcache.get(Servers),
            ood: ood.servers
        };
        res.json(resp);
        return;
    }
    res.sendStatus(401);
}

function update_server_list(
    servers: Server[],
    oldserverlist: Server[]
): Server[] {
    servers.forEach((server: Server) => {
        //check if the last check in time is newer
        var curServer = oldserverlist.find(
            (existingServer) => existingServer.VMName === server.VMName
        );
        if (curServer !== undefined) {
            if (server.LastCheckInTime > curServer.LastCheckInTime) {
                //update masterServerList with newer attributes
                curServer.LastCheckInTime = server.LastCheckInTime;
                curServer.IP = server.IP;
                curServer.HyperVisor = server.HyperVisor;
                curServer.Hostname = server.Hostname;
                curServer.Status = server.Status;
                curServer.Size = server.Size;
                curServer.Cost = 0;
            }
        } else {
            if (
                (server.Cost === null || server.Cost === undefined) &&
                server.Size !== undefined &&
                server.Size !== null
            )
                server.Cost = 0;
            oldserverlist.push(server);
        }
    });
    return oldserverlist;
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getSizePrice(
    size: string,
    sizePriceCache: NodeCache
): Promise<number> {
    const cachedPrice: number | undefined = sizePriceCache.get(size);
    if (cachedPrice !== undefined) {
        return cachedPrice;
    }
    await sleep(1000); // Wait 1 second to avoid rate limiting
    let url = `https://prices.azure.com/api/retail/prices?$filter=serviceFamily eq 'Compute' and location eq 'US East' and armSkuName eq '${size}' and pricetype eq 'Consumption'`;
    // const resp = await fetch(url);
    const resp: any = await request('GET', url);
    if (resp.isError() || resp.statusCode !== 200) {
        console.error(`Couldn't get price for size: ${size}`);
        return -1;
    }
    const data = JSON.parse(resp.body);
    const correctItem = data.Items.filter(
        (i: any) =>
            !i.meterName.toLowerCase().includes("spot") &&
            !i.meterName.toLowerCase().includes("low") &&
            i.productName.toLowerCase().includes("windows")
    )[0];
    if (correctItem === undefined || correctItem === null) {
        console.error(`Couldn't get correct price item for size: ${size}`);
        return -1;
    }
    const serverPriceHourly = correctItem.retailPrice;
    const price = serverPriceHourly * 24 * 30;
    console.log(`Size '${size}' is \$${Math.ceil(price * 100) / 100}`);
    const size_price = Math.ceil(price*100)/100;
    sizePriceCache.set(size, size_price);
    return size_price;
}
