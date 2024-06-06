import { Request, Response } from "express";
import { get_auth_lvl } from "./auth";
import { Message, Server } from "../types";
import { Message as CurrentMessage, Servers } from "../const";
import NodeCache from "node-cache";

export async function post_servers(
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
    if (auth_lvl == 2) {
        const incoming_servers: Server[] = req.body.Servers;
        res.sendStatus(202);
        let _servers: Server[] | undefined = dataMemcache.get(Servers);
        let servers: Server[];
        if (_servers === undefined) servers = [];
        else servers = _servers;
        const new_servers: Server[] = update_server_list(
            incoming_servers,
            servers
        );
        const sizes = extract_server_sizes(new_servers);
        const size_price_map = generate_size_price_map(sizes);
        for (let i = 0; i < new_servers.length; i++) {
            let currSize: string | undefined = new_servers[i].Size;
            if (currSize !== undefined)
                new_servers[i].Cost = size_price_map[currSize];
        }
        dataMemcache.set(Servers, new_servers);
        return;
    }
    res.sendStatus(401);
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
    }
    res.sendStatus(401);
}

function update_server_list(
    servers: Server[],
    oldserverlist: Server[]
): Server[] {
    let newserverlist: Server[] = [];
    servers.forEach((server: Server) => {
        //check if the VM is already in the list
        if (
            oldserverlist.some(
                (existingServer) => existingServer.VMName === server.VMName
            )
        ) {
            //check if the last check in time is newer
            var curServer = oldserverlist.find(
                (existingServer) => existingServer.VMName === server.VMName
            );
            if (curServer === undefined) return;
            if (server.LastCheckInTime > curServer.LastCheckInTime) {
                //update masterServerList with newer attributes
                curServer.LastCheckInTime = server.LastCheckInTime;
                curServer.IP = server.IP;
                curServer.HyperVisor = server.HyperVisor;
                curServer.Hostname = server.Hostname;
                curServer.Status = server.Status;
                curServer.Size = server.Size;
                curServer.Cost = 0;
                newserverlist.push(curServer);
            }
        } else {
            newserverlist.push(server);
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

function generate_size_price_map(sizes: string[]): { [size: string]: number } {
    const pricemap: { [size: string]: number } = {};
    sizes.forEach((size) => {
        const url = `https://prices.azure.com/api/retail/prices?$filter=serviceFamily eq 'Compute' and location eq 'US East' and armSkuName eq '${size}' and pricetype eq 'Consumption'`;
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    console.error(`Couldn't get price for size: ${size}`);
                    return;
                }
                return response.json();
            })
            .then((data) => {
                // Handle the data
                let body = data;
                let correctItem = body.Items.filter(
                    (i: any) =>
                        !i.meterName.toLowerCase().includes("spot") &&
                        !i.meterName.toLowerCase().includes("low") &&
                        i.productName.toLowerCase().includes("windows")
                )[0];
                var serverPriceHourly = correctItem.retailPrice;
                var cost = serverPriceHourly * 24 * 30;
                pricemap[size] = Math.ceil(cost * 100) / 100;
            });
    });
    return pricemap;
}
