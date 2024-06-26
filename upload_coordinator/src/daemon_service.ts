import { Connection, ConnectionConfiguration, Request, TYPES } from "tedious";
import { executeSQL } from "./sql";

const config: ConnectionConfiguration = {
    server: "mssql",
    authentication: {
        type: "default",
        options: { userName: "sa", password: "Test1234" },
    },
    options: { port: 1433, trustServerCertificate: true },
};

export async function backend_loop() {
    executeSQL("SELECT name FROM sys.databases", []).then(resp => {
        console.log(JSON.stringify(resp));
        const db_list = resp.map((row: any[]) => row[0].value);
        console.log(db_list);
    }).catch(err => {
        console.error(err);
    })
    try {
        let db_list = await executeSQL("SELECT name FROM sys.databases", []);
        console.log(JSON.stringify(db_list));
        db_list = db_list.map((row: any[]) => row[0].value);
        console.log(db_list);
    } catch (e) {
        console.error(e);
        setTimeout(() => {
            backend_loop();
        }, 1000);
    }
}
// const connection = new Connection(config);
// connection.connect(async (err: any) => {
//     if (err) {
//         console.log("Connection Failed");
//         throw err;
//     }
//     // createTable();
//     let db_names: string[] = [];

//     const request = new Request(
//         "SELECT name FROM sys.databases",
//         (err: any, rowCount) => {
//             if (err) {
//                 console.log("Request Executed");
//                 console.log(rowCount);
//                 connection.close();
//                 throw err;
//             }
//         }
//     );
//     request.on("row", (columns) => {
//         db_names.push(columns[0].value);
//         // console.log(db_names);
//     });
// request.on("done", (rowCount) => {
//     console.log("done is called");
// });
// request.on("doneInProc", (rowCount, more: any) => {
//     console.log(rowCount + "rows returned");
// });
// // request.on('requestCompleted', function () {
// //     caseExecute();
// // });
// request.on("requestCompleted", function () {
//     // caseExecute();
// });
// await connection.execSql(request);
// console.log(db_names);
// });

// function caseExecute() {
//     const request = new Request(
//         `
//         CREATE TABLE cases (
//             guid varchar(255),
//             caseID varchar(255),
//             PRIMARY KEY (guid)
//         );
//     `,
//         function (err) {
//             if (err) {
//                 console.log(err);
//             } else {
//                 console.log("Table created successfully 1");
//                 connection.close();
//             }
//         }
//     );

//     connection.execSql(request);
// }

// function fileExecute() {
//     const request = new Request(
//         `
//         CREATE TABLE files (
//             file_guid varchar(255),
//             file_path varchar(255),
//             case_guid varchar(255),
//             file_size FLOAT(24),
//             PRIMARY KEY (file_guid),
//             FOREIGN KEY (case_guid)
//         );
//     `,
//         function (err) {
//             if (err) {
//                 console.log(err);
//             } else {
//                 console.log("Table created successfully 2");
//                 connection.close();
//             }
//         }
//     );
//     connection.execSql(request);
// }
// /*
//     function createTable() {
//         const sql = `
//           CREATE TABLE ${table} (
//                guid String,
//                caseID String,
//                file_guid String,
//                file_path String,
//                case_guid String,
//                file_size Number
//           )
//         `;

//         const request = new Request(sql, (err, rowCount) => {
//             if (err) {
//                 throw err;
//             }

//             console.log(`'${table}' created!`);
//             createTableType();
//         });

//         connection.execSql(request);
//     }

//     function createTableType() {
//         /* Create a table type */
//         const defineTypeSql = `
//           CREATE TYPE ${table_type} AS TABLE(
//                guid String,
//                caseID String,
//                file_guid String,
//                file_path String,
//                case_guid String,
//                file_size Number
//           );
//         `;

//         const request = new Request(defineTypeSql, (err) => {
//             if (err) {
//                 console.log("creating table err");
//                 throw err;
//             }

//             console.log(`created table type ${table_type}`);
//             createStoredProcedure();
//         });

//         connection.execSql(request);
//     }

//     function createStoredProcedure() {
//         const defineProcSql = `
//           CREATE PROCEDURE ${storedProcedure}
//             @tvp ${table_type} READONLY
//           As
//           SET NOCOUNT ON
//           INSERT INTO test_tvp (
//                guid,
//                caseID,
//                file_guid,
//                file_path,
//                case_guid,
//                file_size
//           )
//           SELECT *
//           FROM @tvp;
//         `;

//         const request = new Request(defineProcSql, (err) => {
//             if (err) {
//                 console.log("defining tables and types err!");
//                 throw err;
//             }

//             console.log(`created stored procedure ${storedProcedure}`);
//             passingTableValue();
//         });

//         connection.execSqlBatch(request);
//     }

//     function passingTableValue() {
//         /* Setting table value */
//         const table = {
//             columns: [
//                 { name: "guid", type: String },
//                 { name: "caseID", type: String },
//             ],
//         };
//         const table2 = {
//             columns: [
//                 { name: "file_guid", type: String },
//                 { name: "file_path", type: String },
//                 { name: "case_guid", type: String },
//                 { name: "file_size", type: Number },
//             ],
//         };

//         const request = new Request(`${storedProcedure}`, (err) => {
//             if (err) {
//                 throw err;
//             }

//             console.log("successfully passed in table value");
//             console.log("DONE!");
//             connection.close();
//         });

//         request.addParameter("tvp", TYPES.TVP, table);

//         connection.callProcedure(request);
//     }
//     */
// }
//
