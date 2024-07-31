import express, { Request, Response } from "express";
import fs from "fs";
import { createSign, createVerify} from 'crypto';
import { EVENTS, Server, Upload } from "@tus/server";
import { FileStore, MemoryConfigstore } from "@tus/file-store";
import { get_case_id, get_filename } from "./util/get_filename";
import { signMessage, verifyMessage } from "./util/sign";

const coordinator_pubkey=fs.readFileSync('/srv/sign/coordinator/tls.crt'); 
const uploader_privkey=fs.readFileSync('/srv/sign/uploader/tls.key');

const app = express();

const port = 3000;
const UPLOAD_PATH: string = "/mnt/uploads";

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
 

const server = new Server({
    path: "/uploads",
    datastore: new FileStore({
        directory: UPLOAD_PATH,
        configstore: new MemoryConfigstore(),
    }),
    async onUploadCreate(req: any, res: any, upload: any) {
        const case_id = await get_case_id(upload.metadata.upload_guid.toString(), uploader_privkey);
        if (typeof case_id !== 'string') {
            const body = `Case for uploader guid '${upload.metadata.upload_guid.toString()}' does not exist.`;
            throw {status_code: 404, body};
        }
        upload.metadata.filename = get_filename(`${UPLOAD_PATH}/${case_id}/`, upload.metadata.filename);
        const message = JSON.stringify({upload});
        let signer = createSign('sha512');
        signer.write(message);
        signer.end();
        const signature = signer.sign(uploader_privkey, 'hex');
        const headers =  new Headers({'content-type': 'application/json', 'signature': signature});
        fetch(`${process.env.COORDINATOR_URL}/uploader/checkin_new_file/`, {
            method: 'POST',
            headers,
            body: message
        });
        return {res, metadata: {...upload.metadata}};
    },
    async onUploadFinish(req: any, res: any, upload: any) {
        // Get case_id from upload guid
        let case_id = await get_case_id(upload.metadata.upload_guid.toString(), uploader_privkey);
        if (typeof case_id !== 'string') {
            console.error(`Case for uploader guid '${upload.metadata.upload_guid.toString()}' does not exist.`);
            case_id = 'error';
        }
        // Generate paths
        const oldPath = `${UPLOAD_PATH}/${upload.id.toString()}`;
        let newPath = `${UPLOAD_PATH}/${case_id}/`;
        newPath += get_filename(newPath, upload.metadata.filename as string);
        fs.mkdirSync(`${UPLOAD_PATH}/${case_id}`, {recursive: true});
        fs.rename(oldPath, newPath, err => {if (err) console.error(`Error moving file '${oldPath}' to '${newPath}'...\n${err}`);});
        const message = JSON.stringify({upload});
        let signer = createSign('sha512');
        signer.write(message);
        signer.end();
        const signature = signer.sign(uploader_privkey, 'hex');
        const headers =  new Headers({'content-type': 'application/json', 'signature': signature});
        fetch(`${process.env.COORDINATOR_URL}/uploader/update_file_progress/`, {
            method: 'POST',
            headers,
            body: message
        });
        return {res, metadata: {...upload.metadata}};
    },
});


app.use(express.static('./public_html'));

const uploadApp = express();
uploadApp.all("*", server.handle.bind(server));
app.use("/uploads", uploadApp);

app.get('/api/validate_case_id/:case_uuid', async (req: Request, res: Response) => {
    const message = signMessage(req.params.case_uuid, uploader_privkey);
    fetch(`${process.env.COORDINATOR_URL}/uploader/validate/${message.message}`, {
        headers: new Headers({'signature': message.signature})
    })
    .then(async resp => {
        // Check to make sure the uploader can get the case id
        if (!resp.ok) { 
            res.status(resp.status).send(resp.body);
            return;
        }
        const data = await resp.json();
        console.log(data);
        if ((process.env.ITAR != 'true' && (data).itar) || (process.env.ITAR == 'true' && !(data).itar)) {
            let msg = '';
            if (process.env.ITAR != 'true' && (data).itar)
                msg = 'itar';
            else if (process.env.ITAR == 'true' && !(data).itar)
                msg = 'non-itar';
            res.status(400).send(msg);
            return;
        }
        get_case_id(message.message, uploader_privkey).then(async case_id => {
            if (typeof case_id !== 'string') {
                res.sendStatus(case_id);
                return;
            }
            res.status(resp.status).send(JSON.stringify(data));
        })
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        });
    })
    .catch(err => {
        console.error(err);
        res.sendStatus(500);
    });
});

app.delete('/api/delete_files/:case_id', async (req: Request, res: Response) => {
    if (req.params.case_id.length < 2) {
        res.sendStatus(400);
        return;
    }
	const path = `${UPLOAD_PATH}/${req.params.case_id}/`;
    const signature = req.headers.signature as string;
    const isVerified = verifyMessage(req.params.case_id, signature, coordinator_pubkey);
    if(isVerified){
        fs.rm(path, { recursive: true }, (err) => {
            console.error(err);
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            }
            res.sendStatus(200);
        });
    }else{
        res.sendStatus(401);
        return;
    }
});


app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
