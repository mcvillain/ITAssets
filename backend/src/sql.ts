import mariadb from "mariadb";
import NodeCache from "node-cache";
import {
    SQL_AzureDB,
    SQL_LocalDatabase,
    Server,
    Users,
    convert_sql_azure_db,
    convert_sql_local_db,
} from "./types";
import {
    AzureDatabases,
    ItarDatabases,
    LocalDatabases,
    Servers,
    Users as UserCache,
} from "./const";
let _pool: mariadb.Pool | undefined;
function getPool(): mariadb.Pool {
    if (!_pool) {
        _pool = mariadb.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            connectionLimit: 1000,
            database: "itassets",
        });
    }
    return _pool;
}

export async function ensure_db_structure() {
    let conn;
    try {
        const _conn = await mariadb.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
        });
        await _conn.query("CREATE DATABASE IF NOT EXISTS itassets;");
        await _conn.end();
        conn = await getPool().getConnection();
        /*
        await conn.query(`
        CREATE FUNCTION ConvertIsoToEst(@isoTimestamp DATETIME)
            RETURNS NVARCHAR(50)
            AS
            BEGIN
            DECLARE @estTime DATETIMEOFFSET;
            -- Convert the DATETIME to EST timezone (-5 hours from UTC)
            SET @estTime = SWITCHOFFSET(TODATETIMEOFFSET(@isoTimestamp, '+00:00'), '-05:00');
            -- Format the date and time in MM-DD-YY HH:MM:SSS format
            RETURN FORMAT(@estTime, 'MM-dd-yy HH:mm:ss.fff', 'en-US');
            END;
        `);
        */
        await conn.query(`
            CREATE TABLE IF NOT EXISTS azure_dbs (
                name VARCHAR(255) PRIMARY KEY,
                size FLOAT,
                paths TEXT,
                created VARCHAR(22),
                database_id INT,
                cost FLOAT,
                version VARCHAR(15) DEFAULT NULL,
                itar BOOLEAN DEFAULT FALSE,
                LastCheckInTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                -- UPDATE azure_dbs SET LastCheckInTime = dbo.ConvertIsoToEst(current_timestamp());
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS local_dbs (
                id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255),
                size FLOAT,
                paths TEXT,
                database_id INT,
                version VARCHAR(15) DEFAULT NULL,
                created VARCHAR(22),
                LastCheckInTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS servers (
                Status VARCHAR(7),
                IP VARCHAR(15),
                VMName VARCHAR(255) PRIMARY KEY,
                HyperVisor VARCHAR(255),
                Hostname VARCHAR(255),
                Size VARCHAR(255) NULL,
                Cost FLOAT NULL,
                LastCheckInTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS users (
                guid CHAR(36) PRIMARY KEY DEFAULT (UUID()),
                name VARCHAR(255) DEFAULT NULL,
                value INT,
                totalUsers BOOLEAN DEFAULT FALSE,
                serviceAccounts BOOLEAN DEFAULT FALSE,
                department BOOLEAN DEFAULT FALSE,
                title BOOLEAN DEFAULT FALSE,
                manager BOOLEAN DEFAULT FALSE
            );
        `);
        conn.release();
        console.log("SQL Setup!");
    } catch (err) {
        console.error("Waiting for sql server..." + err );
        let prom;
        if (conn) conn.release();
        setTimeout(() => (prom = ensure_db_structure()), 1000);
        await prom;
    }
}

export async function execute_sql(
    query: string | mariadb.QueryOptions
): Promise<any> {
    let conn;
    let resp;
    try {
        conn = await getPool().getConnection();
        resp = await conn.query(query);
    } catch (error) {
        console.error('Error executing query:', error);
        throw error; // Re-throw the error after logging it
    } finally {
        if (conn) {
            try {
                conn.release();
            } catch (releaseError) {
                console.error('Error releasing connection:', releaseError);
            }
        }
    }
    return resp;
}

export async function restore_state(data_cache: NodeCache) {
    restore_azure_dbs(data_cache);
    restore_itar_dbs(data_cache);
    restore_local_dbs(data_cache);
    restore_servers(data_cache);
    restore_users(data_cache);
}

async function restore_azure_dbs(data_cache: NodeCache) {
    let az_dbs: SQL_AzureDB[] = await execute_sql(
        "SELECT * FROM azure_dbs WHERE itar = 0;"
    );
    data_cache.set(
        AzureDatabases,
        az_dbs.map((db: SQL_AzureDB) => convert_sql_azure_db(db))
    );
}

async function restore_itar_dbs(data_cache: NodeCache) {
    let az_dbs: SQL_AzureDB[] = await execute_sql(
        "SELECT * FROM azure_dbs WHERE itar = 1;"
    );
    data_cache.set(
        ItarDatabases,
        az_dbs.map((db: SQL_AzureDB) => convert_sql_azure_db(db))
    );
}

async function restore_local_dbs(data_cache: NodeCache) {
    let local_dbs: SQL_LocalDatabase[] = await execute_sql(
        "SELECT * FROM local_dbs"
    );
    data_cache.set(
        LocalDatabases,
        local_dbs.map((db: SQL_LocalDatabase) => convert_sql_local_db(db))
    );
}

async function restore_servers(data_cache: NodeCache) {
    let servers: Server[] = await execute_sql("SELECT * FROM servers");
    data_cache.set(Servers, servers);
}

async function restore_users(data_cache: NodeCache) {
    // Query Data
    let total_users = (
        await execute_sql("SELECT value FROM users WHERE totalUsers = TRUE")
    )[0]?.value;
    let service_accounts = (
        await execute_sql(
            "SELECT value FROM users WHERE serviceAccounts = TRUE"
        )
    )[0]?.value;
    let departments = await execute_sql(
        "SELECT name, value FROM users WHERE department = TRUE"
    );
    let titles = await execute_sql(
        "SELECT name, value FROM users WHERE title = TRUE"
    );
    let managers = await execute_sql(
        "SELECT name, value FROM users WHERE manager = TRUE"
    );
    // Structure Data
    let users = new Users();
    users.totalUsers = total_users;
    users.serviceAccounts = service_accounts;
    departments.forEach((dept: { name: string; value: number }) => {
        users.departments[dept.name] = dept.value;
    });
    titles.forEach((title: { name: string; value: number }) => {
        users.title[title.name] = title.value;
    });
    managers.forEach((manager: { name: string; value: number }) => {
        users.manager[manager.name] = manager.value;
    });
    data_cache.set(UserCache, users);
}
