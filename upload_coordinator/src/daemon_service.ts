import { execute_sql, ensure_uploaderdb } from './sql';

// Expire uploads after 24hrs
export async function update_failed_status() {
    setTimeout(update_failed_status, 1800000); // update every 30mins
    try {
        // Update all files that have expired
        await execute_sql("UPDATE files SET upload_complete = -1 WHERE upload_complete = 0 AND uploaded_at < NOW() - INTERVAL 1 DAY")
    } catch (err) {
        console.error("Failed to get failed uploads\n"+err);
    }
}