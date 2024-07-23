import { readFileSync } from 'fs';
import { createSign } from 'crypto';

// Read private key from file
const privateKey = readFileSync('/srv/sign/backend/tls.key');

export class SignedMessage {
    message!: string;
    signature!: string;
}

export function signMessage(msg: string): SignedMessage {
    const sign = createSign('RSA-SHA256');
    sign.write(msg);
    sign.end();
    const signature = sign.sign(privateKey, 'base64');
    return { message: msg, signature } as SignedMessage;
}
