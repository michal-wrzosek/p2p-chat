import { generateKey, encrypt, decrypt } from "./encryption";

describe('/util/encryption', () => {
  describe('generateKey()', () => {
    it('returns a random string of 64 characters', () => {
      expect(typeof generateKey()).toBe('string');
      expect(generateKey().length).toBe(64);
      expect(generateKey()).not.toBe(generateKey());
    });
  });

  describe('encrypt() and decrypt()', () => {
    it('encrypt and decrypt successfully', () => {
      const message = 'Text that will be encrypted';
      const key = 'key';
      const encrypted = encrypt(message, key);
      const decrypted = decrypt(encrypted, key);
      expect(message).not.toBe(encrypted);
      expect(decrypted).toBe(message);
    });
  });

  describe('full flow', () => {
    it('generates a key, encrypt and decrypt successfully', () => {
      const message = 'Text that will be encrypted';
      const key = generateKey();
      const encrypted = encrypt(message, key);
      const decrypted = decrypt(encrypted, key);
      expect(message).not.toBe(encrypted);
      expect(decrypted).toBe(message);
    });
  })
})