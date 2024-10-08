import mariadb from "mariadb";

let _pool: mariadb.Pool | undefined;

function getPool(): mariadb.Pool {
    if (!_pool) {
        console.log("Making new pool...");
        _pool = mariadb.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            connectionLimit: 10,
            database: "uploader_db",
        });
    }
    return _pool;
}

export async function ensure_uploaderdb() {
    let _conn;
    let conn;
    try {
        _conn = await mariadb.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
        });
        await _conn.query("CREATE DATABASE IF NOT EXISTS uploader_db;");
        await _conn.end();
        conn = await getPool().getConnection();
        await conn.query(`
            CREATE TABLE IF NOT EXISTS cases (
                guid CHAR(36) UNIQUE,
                case_id INT PRIMARY KEY,
                owner VARCHAR(255),
                upload_url_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                itar BOOLEAN DEFAULT FALSE
            );
        `);
        await conn.query(`
            CREATE TABLE IF NOT EXISTS files (
                guid VARCHAR(255) PRIMARY KEY,
                file_path VARCHAR(255),
                case_id INT,
                file_size FLOAT,
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                upload_complete TINYINT(1) DEFAULT 0,
                FOREIGN KEY (case_id) REFERENCES cases(case_id)
            );
        `);
        // conn.release();
        console.log("SQL Setup!");
    } catch (err) {
        console.warn("Waiting for sql server...");
        // console.error(err)
        let prom;
        // if (conn) conn.release();
        setTimeout(()=>prom=ensure_uploaderdb(), 1000);
        await prom;
    } finally {
        conn?.release();
    }
}

export async function execute_sql(query: string): Promise<any> {
    let conn;
    let resp;
    try {
        conn = await getPool().getConnection();
        resp = await conn.query(query);
    } finally {
        conn?.release();
    }
    return resp;
}
