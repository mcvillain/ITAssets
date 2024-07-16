const fs = require('fs');
const { createSign, createVerify } = require('crypto');
// Read private key from file
const privateKey = fs.readFileSync('private.key');

// Read public key from file
const publicKey = fs.readFileSync('pubKey.crt');
export async function verifyMessage(msg: string, signature: string): Promise<boolean> {
    // Verification
    const verify = createVerify('SHA256');
    verify.write(msg);
    verify.end();
    const isVerified = verify.verify(publicKey, signature, 'base64');
    return isVerified;

}

export async function signMessage(msg: string): Promise<string> {
    const sign = createSign('SHA256');
    sign.write(msg);
    sign.end();
    const signature = sign.sign(privateKey, 'base64');
    return signature;

}
