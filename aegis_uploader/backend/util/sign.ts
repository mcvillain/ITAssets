import { createSign, createVerify } from 'crypto';

export class SignedMessage {
    message!: string;
    signature!: string;
}

export function signMessage(message: string, privkey: any): SignedMessage {
    let signer = createSign("sha512");
    signer.write(message);
    signer.end();
    const signature = signer.sign(privkey, 'hex');
    return {message, signature};
}

export function verifyMessage(message: string, signature: string, pubkey: any): boolean {
    let verify = createVerify("sha512");
    verify.write(message);
    verify.end();
    return verify.verify(pubkey, signature, 'hex');
}