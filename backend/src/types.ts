export class Server {
    Status!: ServerStatus;
    IP!: string;
    LastCheckInTime!: string;
    VMName!: string;
    HyperVisor!: string;
    Hostname!: string;
    Size: string | undefined;
    Cost: number | null | undefined;
}
export enum ServerStatus {
    Offline,
    Running,
}
export class LocalDatabase {
    name!: string;
    size!: number;
    paths!: string[];
    database_id!: number;
    version: string | undefined;
    created!: string;
}
export class IncomingLocalDB {
    name!: string;
    size!: number;
    path!: string;
    created!: string;
    database_id!: number;
    LastCheckInTime!: string;
    version: string | undefined;
}

export class AzureDatabase {
    name!: string;
    size!: number;
    paths!: string[];
    created!: string;
    database_id!: number;
    cost!: number;
}
export class IncomingAzureDB {
    name!: string;
    size!: number;
    path!: string;
    created!: string;
    database_id!: number;
    LastCheckInTime!: Date;
}
export class Users {
    departments!: {};
    totalUsers!: number;
    serviceAccounts!: number;
    title!: {};
    manager!: {};
}
export class Message {
    constructor(msg: string = "", timestamp: Date = new Date()) {
        this.msg = msg;
        this.timestamp = timestamp;
    };
    msg: string;
    timestamp: Date;
}
