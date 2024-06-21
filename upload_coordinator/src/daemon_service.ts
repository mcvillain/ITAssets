import { error } from "console";
import { Connection, ConnectionConfiguration, Request } from "tedious";

const config:ConnectionConfiguration = {
    server: "localhost",
    authentication: {
        type: 'default',
        options: { userName: "sa", password: "Test1234" },
    },
    options: { port: 1433, trustServerCertificate: true },
};

export async function backend_loop() {
    const connection = new Connection(config);
    connection.connect((err:any)=> {
        if(err){
            console.log("Connection Failed");
            throw err;
        }
        const request = new Request("SELECT * FROM sys.databases", (err: any, rowCount) => {
            if(err){
                console.log("Request Executed");
                console.log(rowCount);
                connection.close();
                throw err;
            }
        });
        request.on("row", (columns) => {
            columns.forEach((column: any)  => {
                if(column.value === null){
                    console.log("NULL");
                }else{
                    console.log(column.value);
                }
            });
        });
        request.on("done", (rowCount) => {
            console.log("done is called");
        });
        request.on("doneInProc", (rowCount, more: any) => {
            console.log(rowCount + "rows returned");
        });
        connection.execSql(request);
    });
}
