import { useState } from 'react';
import { verifyPassphrase } from '../functions/pgp';

export const GetPassphrase = ({ firstTime, keys, callback }) => {
  const [passphrase1, setPassphrase1] = useState('');
  const [passphrase2, setPassphrase2] = useState('');
  const [mismatch, setMismatch] = useState(false);
  const [isWrongPassphrase, setIsWrongPassphrase] = useState(false);

  const handlePassphrase = (event) => {
    event.preventDefault();

    setIsWrongPassphrase(false);

    if (firstTime) {
      if (passphrase1 !== passphrase2) {
        setMismatch(true);
      } else {
        setMismatch(false);
        callback(passphrase1);
      }
    }

    if (!firstTime) {
      setMismatch(false);
      verifyPassphrase(keys, passphrase1).then(valid => {
        if (valid) {
          callback(passphrase1);
        } else {
          setIsWrongPassphrase(true);
        }
      })
    }
  };

  if (firstTime)
    return <>
      <form onSubmit={handlePassphrase}>
        <p>Passphrase <input type="text" name="test" value={passphrase1} onChange={(e) => setPassphrase1(e.target.value)} /></p>
        <p>Repeat Passphrase <input type="text" name="test" value={passphrase2} onChange={(e) => setPassphrase2(e.target.value)} /></p>
        {mismatch && <><p>Passphrases don't match</p></>}
        <button type="submit">Set Passphrase</button>
      </form>
    </>;

  return <>
    <form onSubmit={handlePassphrase}>
      <h2>Welcome back!</h2>
      <p>Provide your encryption passphrase to be able to read your messages.</p>
      <p>Passphrase <input type="text" name="test" value={passphrase1} onChange={(e) => setPassphrase1(e.target.value)} /></p>
      {isWrongPassphrase && <><p>Passphrase is incorrect</p></>}
      <button type="submit">Read My Messages</button>
    </form>
  </>;
};
