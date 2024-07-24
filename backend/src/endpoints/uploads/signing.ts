import { readFileSync } from 'fs';
import { createSign } from 'crypto';

// Read private key from file
const privateKey = readFileSync('/srv/sign/backend/tls.key');

export class SignedMessage {
    message!: string;
    signature!: string;
}

export function signMessage(msg: string): SignedMessage {
    const sign = createSign('sha512');
    sign.write(msg);
    sign.end();
    const signature = sign.sign(privateKey, 'hex');
    return { message: msg, signature } as SignedMessage;
}
