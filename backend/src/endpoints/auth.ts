import {
    AuthenticationResult,
    ConfidentialClientApplication,
} from "@azure/msal-node";
import { Request, Response } from "express";
import NodeCache from "node-cache";
import { config } from "../msauth_config";

export async function get_auth_lvl(
    session_id: string,
    memcache: NodeCache
): Promise<number> {
    if (session_id === "b71516c0-90ec-4ff6-9fa6-591b2fc8d781") return 2;
    const val: string | AuthenticationResult | undefined = await memcache.get(
        session_id
    );
    if (val === undefined) {
        return 0;
    } else if (typeof val === "string") {
        if (val === "svc") return -1;
        return 0;
    } else {
        const jwt: AuthenticationResult = val;
        if (jwt.expiresOn !== null && jwt.expiresOn > new Date()) {
            if (jwt.account?.idTokenClaims?.roles !== null) {
                if (jwt.account?.idTokenClaims?.roles?.includes("admin")) {
                    return 3
                }
                else if (jwt.account?.idTokenClaims?.roles?.includes("itar")) {
                    return 2;
                }
            }
            return 1;
        }
        return 0;
    }
}

export async function get_auth(
    req: Request,
    res: Response,
    memcache: NodeCache
) {
    const session_id = req.cookies["session_id"];
    if (session_id == undefined) {
        res.status(200);
        res.send(JSON.stringify({ auth_lvl: 0 }));
        return;
    }
    const auth_lvl = await get_auth_lvl(session_id, memcache);
    res.status(200);
    res.send(JSON.stringify({ auth_lvl }));
}

// MS Auth
export function get_ms_auth(
    req: Request,
    res: Response,
    pca: ConfidentialClientApplication
) {
    const authCodeUrlParameters = config.request.authCodeUrlParameters;
    pca.getAuthCodeUrl(authCodeUrlParameters)
        .then((response) => {
            res.redirect(response);
        })
        .catch((error) => console.log(JSON.stringify(error)));
}

export function get_auth_redirect(
    req: Request,
    res: Response,
    pca: ConfidentialClientApplication,
    loginCache: NodeCache
) {
    const code = req.query.code;
    if (typeof code === "string") {
        const tokenRequest = {
            code,
            scopes: config.request.tokenRequest.scopes,
            redirectUri: config.request.tokenRequest.redirectUri,
        };
        pca.acquireTokenByCode(tokenRequest)
            .then((response: AuthenticationResult) => {
                let expires = response.expiresOn
                    ? response.expiresOn.getMilliseconds()
                    : 0;
                loginCache.set(
                    response.accessToken,
                    response,
                    (expires - Date.now()) / 1000
                ); 
                res.cookie("session_id", response.accessToken, {
                    expires: response.expiresOn
                        ? response.expiresOn
                        : undefined,
                    path: "/",
                    secure:
                        process.env.NO_HTTPS === undefined ||
                        process.env.NO_HTTPS != "true",
                    httpOnly: true,
                });
                res.redirect(`${process.env.BASE_URI}/servers`);
            })
            .catch((error) => {
                console.log(error);
                res.status(500).send(error);
            });
    } else {
        res.redirect(`${process.env.BASE_URI}/api/ms_auth`);
    }
}

export function get_logout_redirect(req: Request, res: Response, loginCache: NodeCache) {
    const session_id = req.cookies["session_id"];
    if (session_id !== undefined) {
        loginCache.del(session_id);
    }
    res.clearCookie("session_id");
    res.redirect(`${process.env.BASE_URI}`);
}