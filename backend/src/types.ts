export class Server {
    Status!: 'Running' | 'Offline';
    IP!: string;
    LastCheckInTime!: string;
    VMName!: string;
    HyperVisor!: string;
    Hostname!: string;
    Size: string | undefined;
    Cost: number | null | undefined;
}
export class LocalDatabase {
    name!: string;
    size!: number;
    paths!: string[];
    database_id!: number;
    version: string | undefined;
    created!: string;
    get key(): string {
        return this.name + "_" + this.database_id;
    };
}
export class IncomingLocalDB {
    name!: string;
    size!: number;
    path!: string;
    created!: string;
    database_id!: number;
    LastCheckInTime!: string;
    version: string | undefined;
    get key(): string {
        return this.name + "_" + this.database_id;
    };
}
export function convert_sql_local_db(sql_local_db: SQL_LocalDatabase): LocalDatabase {
    return {
        name: sql_local_db.name,
        size: sql_local_db.size,
        paths: sql_local_db.paths.split("|"),
        database_id: sql_local_db.database_id,
        version: sql_local_db.version,
        created: sql_local_db.created,
    } as LocalDatabase;
}
export class SQL_LocalDatabase {
    name!: string;
    size!: number;
    paths!: string;
    database_id!: number;
    version: string | undefined;
    created!: string;
}

export class AzureDatabase {
    name!: string;
    size!: number;
    paths!: string[];
    created!: string;
    database_id!: number;
    cost!: number;
    version: string | undefined;
    get key(): string {
        return this.name + "_" + this.database_id;
    };
}
export class IncomingAzureDB {
    name!: string;
    size!: number;
    path!: string;
    created!: string;
    database_id!: number;
    LastCheckInTime!: Date;
    version: string | undefined;
}
export function convert_sql_azure_db(sql_azure_db: SQL_AzureDB): AzureDatabase {
    return {
        name: sql_azure_db.name,
        size: sql_azure_db.size,
        paths: sql_azure_db.paths.split("|"),
        created: sql_azure_db.created,
        database_id: sql_azure_db.database_id,
        cost: sql_azure_db.cost,
        version: sql_azure_db.version,
    } as AzureDatabase;
}
export class SQL_AzureDB {
    name!: string;
    size!: number;
    paths!: string;
    created!: string;
    database_id!: number;
    cost!: number;
    version!: string;
}
export class Users {
    departments: Record<string,number> = {};//{ [dept_name: string]: number };
    totalUsers!: number;
    serviceAccounts!: number;
    title: Record<string,number> = {};//{ [title: string]: number };
    manager: Record<string,number> = {};//{ [manager_name: string]: number };
}
export class IncomingUser {
    firstname!: string;
    lastname!: string;
    username!: string;
    title!: string;
    department!: string;
    licensed!: boolean;
    manager!: string;
    managerEmail!: string;
    enabled!: boolean;
    ServiceAccount!: boolean;
}
export class Message {
    constructor(msg: string = "", timestamp: Date = new Date()) {
        this.msg = msg;
        this.timestamp = timestamp;
    }
    msg: string;
    timestamp: Date;
}

export class OutOfDate {
    servers = true;
    localDatabases = true;
    azureDatabases = true;
    itarDatabases = true;
    users = true;
}

export function convertIsoToEst(isoString: any) {
    // Parse the ISO string to a Date object
    const date = new Date(isoString);

    // Convert to EST timezone (-5 hours from UTC)
    const estTime = new Date(date.getTime() - (5*60*60*1000));

    // Format the date and time in MM-DD-YY HH:MM:SSS format
    const formattedDate = estTime.toLocaleString('en-US', {
        timeZone: 'America/New_York',
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).replace(',', '');

    // Extract milliseconds
    const milliseconds = estTime.getMilliseconds().toString().padStart(3, '0');

    // Combine the formatted date and milliseconds
    return `${formattedDate}.${milliseconds}`;
}