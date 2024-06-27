import { execute_sql, ensure_uploaderdb } from './sql';

export async function startup_backend_loop() {
    try {
        await ensure_uploaderdb();
    } catch (e) {
        console.error(e);
        setTimeout(() => {
            startup_backend_loop();
        }, 1000);
    }
}