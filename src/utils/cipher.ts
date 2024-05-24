import crypto from "crypto";

export type CipherType = "aes-128-gcm" | "aes-128-ccm" | "aes-192-gcm" | "aes-192-ccm" | "aes-256-gcm" | "aes-256-ccm";

interface CipherTypes {
    type: CipherType,
    numAuthTagBytes?: number,
    numIvBytes?: number,
    stringBase?: "base64",
}

export function createKeyForCipher(cipherType: CipherType): string {
    let numBytes: number;
    switch (cipherType) {
        case "aes-128-gcm": numBytes = 128 / 8; break;
        default: throw new Error(`TODO: support cipherType "${cipherType}"`);
    }
    return crypto.randomBytes(numBytes).toString("base64");
}

export class Cipher {
    constructor(private key: string, private config: {
        type: CipherType,
        numAuthTagBytes?: number,
        numIvBytes?: number,
        stringBase?: "base64",
    }) {
        config.numAuthTagBytes = config.numAuthTagBytes || 16;
        config.numIvBytes = config.numIvBytes || 12;
        config.stringBase = config.stringBase || "base64";
        if (config.numAuthTagBytes < 16) { console.warn(`Be careful of short auth tags`); }
        if (config.numIvBytes < 12) { console.warn(`Be careful of short ivs`); }
    }


    public encrypt(msg: string) {
        const {type , numIvBytes, numAuthTagBytes, stringBase}: CipherTypes = this.config;
        const iv = crypto.randomBytes(numIvBytes as number);
        const cipher = crypto.createCipheriv(
            type,
            Buffer.from(this.key, stringBase),
            iv,
            { 'authTagLength': numAuthTagBytes } as any
        );

        return [
            iv.toString(stringBase),
            cipher.update(msg, "utf8", stringBase as "base64"),
            cipher.final(stringBase as "base64"),
            (cipher as any).getAuthTag().toString(stringBase)
        ].join("");
    }


    public decrypt(cipherText: string) {
        const {type, numIvBytes, numAuthTagBytes, stringBase} = this.config;
        let authTagCharLength: number = 24; // TODO: compute from numAuthTagBytes and stringBase
        let ivCharLength: number = 16; // TODO: compute from numIvBytes and stringBase

        const authTag = Buffer.from(cipherText.slice(-authTagCharLength), stringBase);
        const iv = Buffer.from(cipherText.slice(0, ivCharLength), stringBase);
        const encryptedMessage = Buffer.from(cipherText.slice(ivCharLength, -authTagCharLength), stringBase);

        const decipher = crypto.createDecipheriv(
            type,
            Buffer.from(this.key, stringBase),
            iv,
            { 'authTagLength': numAuthTagBytes } as any
        );
        (decipher as any).setAuthTag(authTag);

        return [
            decipher.update(encryptedMessage as any, stringBase as "base64", "utf8"),
            decipher.final()
        ].join("");
    }
}