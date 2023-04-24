import * as openpgp from 'openpgp';

export const generateKeys = async (name, email, passphrase) => {
  const { privateKey, publicKey } = await openpgp.generateKey({
    type: 'rsa',
    rsaBits: 4096,
    userIDs: [{ name, email }],
    passphrase
  });
  return { privateKey, publicKey };
};
