import CryptoAES from "crypto-js/aes";
import CryptoENCUtf8 from "crypto-js/enc-utf8";
import { lib as CryptoLib } from "crypto-js";
import CryptoPBKDF2 from "crypto-js/pbkdf2";

export function encrypt(string: string, key: string): string {
  return CryptoAES.encrypt(string, key).toString();
}

export function decrypt(string: string, key: string): string {
 return CryptoAES.decrypt(string, key).toString(CryptoENCUtf8);
}

export function generateKey(): string {
  const passphrase = CryptoLib.WordArray.random(128/8);
  const salt = CryptoLib.WordArray.random(128/8);
  return CryptoPBKDF2(passphrase, salt, { keySize: 256/32, iterations: 1000 }).toString();
}
