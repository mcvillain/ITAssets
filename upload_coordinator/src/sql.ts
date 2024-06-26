import { Connection, ConnectionConfiguration, Request, TYPES } from "tedious";
import { DataType } from "tedious/lib/data-type";

const config: ConnectionConfiguration = {
    server: "mssql.docker.internal",
    authentication: {
        type: "default",
        options: { userName: "sa", password: "Test1234" },
    },
    options: { port: 1433, trustServerCertificate: true },
};

export const executeSQL = (query: string, params: [string, DataType, any][]) => new Promise((resolve: (rows:any[][])=>void, reject) => {
    let rows: any[][] = [];
    const conn = new Connection(config);
    conn.on('connect', err => {
        const req = new Request(query, err => {return err});
        // params.forEach((param: [string, DataType, any]) => {
        //     req.addParameter(param[0], param[1], param[2]);
        // });
        req.on('row', (cols: any[]) => {rows.push(cols);console.log("new_row")});
        req.on('done', () => resolve(rows));
        req.on('doneProc', () => resolve(rows));
        req.on('doneInProc', () => resolve(rows));
        req.on('error', err => reject(err));
        conn.execSql(req);
    });
    conn.on('error', err => reject(err));
    conn.connect();
});
// export async function get_sql_connection(config: ConnectionConfiguration) {
//     const connection = new Connection(config);
//     connection.connect();
// }