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
    await openpgp.decryptKey({
      privateKey: await openpgp.readPrivateKey({ armoredKey: keys.privateKey }),
      passphrase
    });
    return true;
  } catch (e) {
    return false;
  }
}

export const encryptMessageWithPublicKey = async (message, armoredPublicKeys) => {
  const pgpMessage = await openpgp.createMessage({ text: message });
  const publicKeys = [];
  for (const armoredPublicKey of armoredPublicKeys) {
    publicKeys.push(await openpgp.readKey({ armoredKey: armoredPublicKey.key }));
  }
  console.log(publicKeys);
  const encrypedMessage = await openpgp.encrypt({
    message: pgpMessage,
    encryptionKeys: publicKeys
  });
  return encrypedMessage;
}

export const decryptMessageWithPrivateKey = async (encryptedMessage, privateKeyArmored, passphrase) => {
  try {
    const privateKey = await openpgp.decryptKey({
      privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
      passphrase
    });
    const message = await openpgp.readMessage({ armoredMessage: encryptedMessage });
    const { data: decrypted } = await openpgp.decrypt({ message, decryptionKeys: privateKey });
    return decrypted;
  } catch (e) {
    return false;
  }
}