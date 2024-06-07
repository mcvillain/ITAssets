import { Request, Response } from "express";
import { get_auth_lvl } from "./auth";
import { Message, Server } from "../types";
import { Message as CurrentMessage, Servers } from "../const";
import NodeCache from "node-cache";

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
    const username: string | undefined = loginMemcache.get(session_id);
    if (username === undefined || username != "svc") {
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
        if (currSize !== undefined)
            new_servers[i]["Cost"] = await getSizePrice(
                currSize,
                sizePriceCache
            );
        console.log(
            `Server ${i} with size '${currSize}' is \$${new_servers[i].Cost}`
        );
    }
    dataMemcache.set(Servers, new_servers);
    console.log("Done processing servers...");
    return;
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
        res.json(dataMemcache.get(Servers));
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
    return servers;
}

function extract_server_sizes(servers: Server[]): string[] {
    let sizes: string[] = [];
    servers.forEach((server) => {
        if (server.Size !== undefined && !sizes.includes(server.Size)) {
            sizes.push(server.Size);
        }
    });
    return sizes;
}

async function getSizePrice(
    size: string,
    sizePriceCache: NodeCache
): Promise<number> {
    const cachedPrice: number | undefined = sizePriceCache.get(size);
    if (cachedPrice !== undefined) {
        return cachedPrice;
    }
    let url = `https://prices.azure.com/api/retail/prices?$filter=serviceFamily eq 'Compute' and location eq 'US East' and armSkuName eq '${size}' and pricetype eq 'Consumption'`;
    const resp = await fetch(url);
    if (!resp.ok) {
        console.error(`Couldn't get price for size: ${size}`);
        return -1;
    }
    const data = await resp.json();
    const correctItem = data.Items.filter(
        (i: any) =>
            !i.meterName.toLowerCase().includes("spot") &&
            !i.meterName.toLowerCase().includes("low") &&
            i.productName.toLowerCase().includes("windows")
    )[0];
    const serverPriceHourly = correctItem.retailPrice;
    const price = serverPriceHourly * 24 * 30;
    console.log(`Size '${size}' is \$${Math.ceil(price * 100) / 100}`);
    return Math.ceil(price * 100) / 100;
}
