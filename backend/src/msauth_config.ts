export const config = {
    authOptions: {
        clientId: process.env.ENTRA_AUTH_CLIENT_ID!==undefined?process.env.ENTRA_AUTH_CLIENT_ID:"",
        authority: `https://login.microsoftonline.com/${process.env.ENTRA_AUTH_TENANT_ID}/`,
    },
    request: {
        authCodeUrlParameters: {
            scopes: ["user.read"],
            redirectUri: `${process.env.BASE_URI}/api/auth_redirect`,
        },
        tokenRequest: {
            redirectUri: `${process.env.BASE_URI}/api/auth_redirect`,
            scopes: ["user.read"],
        },
    },
    resourceApi: {
        endpoint: ""
    }
}

export const clientConfig = {
    auth: {
        clientId: config.authOptions.clientId,
        authority: config.authOptions.authority,
        clientSecret: process.env.ENTRA_AUTH_CLIENT_SECRET,
        knownAuthorities: [config.authOptions.authority]
    },
};