import { createSign } from "crypto";
import fs from "fs";
import { signMessage } from "./sign";

export function get_filename(path: string, filename: string): string {
    if (fs.existsSync(`${path}${filename}`)) {
        const file_ext_separator = filename.lastIndexOf('.');
        let file_name = filename.substring(0,file_ext_separator);
        let file_ext = filename.substring(file_ext_separator);
        let dupCounter = 1;
        while (fs.existsSync(`${path}${file_name}_${dupCounter}${file_ext}`)) {
            dupCounter++;
        }
        return `${file_name}_${dupCounter}${file_ext}`;
    } else {
        return filename
    }
}

export async function get_case_id(upload_guid: string, privkey: any): Promise<string | number> {
    try {
        const message = signMessage(upload_guid, privkey);
        const resp = await fetch(`${process.env.COORDINATOR_URL}/uploader/get_case_id_from_upload_guid/${upload_guid}`, {
            headers: new Headers({'signature': message.signature}),
        });
        if (!resp.ok) {
            console.error(`Couldn't get case_id for guid ${upload_guid}`);
            return resp.status;
        }
       return await resp.text();
    } catch (err) {
        console.error(err);
        return 500;
    }
}


/*

try {
    let sign = createSign('sha512');
    sign.write(req.params.case_uuid);
    sign.end();
    const sig = sign.sign(uploader_privkey, 'hex');
    const resp = await fetch(`${process.env.COORDINATOR_URL}/uploader/get_case_id_from_upload_guid/${req.params.case_uuid}`, {
        headers: new Headers({'signature': sig}),
    });
    if (!resp.ok) {
        res.sendStatus(resp.status);
        return;
    }
} catch (err) {
    console.error(err);
    res.sendStatus(500);
    return;
}


*/