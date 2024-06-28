import mariadb from "mariadb";

let _pool: mariadb.Pool | undefined;

function getPool(): mariadb.Pool {
    if (!_pool) {
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
    const _conn = await mariadb.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
    });
    await _conn.query("CREATE DATABASE IF NOT EXISTS uploader_db;");
    await _conn.end();
    const conn = await getPool().getConnection();
    await conn.query(`
        CREATE TABLE IF NOT EXISTS cases (
            guid CHAR(36) PRIMARY KEY,
            case_id INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
    await conn.query(`
        CREATE TABLE IF NOT EXISTS files (
            guid VARCHAR(255) PRIMARY KEY,
            file_path VARCHAR(255),
            case_guid CHAR(36),
            file_size FLOAT,
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (case_guid) REFERENCES cases(guid)
        );
    `);
    conn.release();
}

export async function execute_sql(query: string): Promise<any> {
    let conn;
    let resp;
    try {
        conn = await getPool().getConnection();
        resp = await conn.query(query);
    } finally {
        if (conn) conn.release();
    }
    return resp;
}
