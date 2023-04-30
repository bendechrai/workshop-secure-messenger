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

export const verifyPassphrase = async (keys, passphrase) => {
  try {
    const publicKey = await openpgp.readKey({ armoredKey: keys.publicKey });
    const privateKey = await openpgp.decryptKey({
      privateKey: await openpgp.readPrivateKey({ armoredKey: keys.privateKey }),
      passphrase
    });
    console.log(privateKey);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}