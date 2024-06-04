export class Server {
    LastCheckInTime!: String;
    IP!: String;
    HyperVisor!: String;
    Hostname!: String;
    Status!: ServerStatus;
    Size!: Number;
    Cost!: Number;
}
export enum ServerStatus {
    Offline, Running
}
export class Database {
    name!: String;
    size!: Number;
    path!: String;
    created!: String;
    database_id!: Number;
    LastCheckInTime!: String;
    version: String | undefined;
}
export class AzureDatabase {
    name!: String;
    size!: Number;
    path!: String;
    created!: String;
    database_id!: Number;
    LastCheckInTime!: String;
    version: String | undefined;
}
export class Users {
    departments!: {};
    totalUsers!: Number;
    serviceAccounts!: Number;
    title!: {};
    manager!: {};
}

// curServer.LastCheckInTime = server.LastCheckInTime;
// curServer.IP = server.IP;
// curServer.HyperVisor = server.HyperVisor;
// curServer.Hostname = server.Hostname;
// curServer.Status = server.Status;
// curServer.Size = server.Size;
// curServer.Cost = 0;

// user_data = {
//     departments: {},
//     totalUsers: 0,
//     serviceAccounts: 0,
//     title: {},
//     manager: {}
//   };

// {
//     "name":  "TestDB2",
//     "size":  0,
//     "path":  "/var/opt/mssql/data/TestDB2.mdf",
//     "created":  "6/4/2024 3:12:50 PM",
//     "database_id":  6,
//     "LastCheckInTime":  "2024-06-04T11:12:56",
//     "version":  "1.0.1"
// },