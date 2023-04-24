import { useState } from 'react';

export const GetPassphrase = ({ firstTime, callback }) => {
  const [passphrase1, setPassphrase1] = useState('');
  const [passphrase2, setPassphrase2] = useState('');
  const [mismatch, setMismatch] = useState(false);

  const handlePassphrase = (event) => {
    event.preventDefault();
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
      callback(passphrase1);
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
      <p>Passphrase <input type="text" name="test" value={passphrase1} onChange={(e) => setPassphrase1(e.target.value)} /></p>
      <button type="submit">Set Passphrase</button>
    </form>
  </>;
};
