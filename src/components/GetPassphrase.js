import { useState } from 'react';
import { verifyPassphrase } from '../functions/pgp';
import { useAuth0 } from '@auth0/auth0-react';

export const GetPassphrase = ({ firstTime, keys, callback }) => {
  const { user } = useAuth0();

  // States for passphrase read to unlock keys
  const [newPassphrase, setNewPassphrase] = useState('');
  const [isWrongPassphrase, setIsWrongPassphrase] = useState(false);

  // States for passphrase read to create keys
  const [passphrase1, setPassphrase1] = useState('');
  const [passphrase2, setPassphrase2] = useState('');
  const [mismatch, setMismatch] = useState(false);

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
      verifyPassphrase(keys, newPassphrase).then(valid => {
        if (valid) {
          callback(newPassphrase);
        } else {
          setIsWrongPassphrase(true);
        }
      })
    }
  };

  if (firstTime)
    return <>
      <form onSubmit={handlePassphrase}>
        <h1>Welcome!</h1>
        <p>Hello {user.nickname}. Welcome to Secure Messenger.</p>
        <p>To continue, we need to create an encryption key that we'll use to secure your messages. Give us a secure passphrase that you'll use in future to unlock this key. It's probably best to use something other than your login password...</p>
        <p>Passphrase <input type="text" value={passphrase1} onChange={(e) => setPassphrase1(e.target.value)} /></p>
        <p>Repeat Passphrase <input type="text" value={passphrase2} onChange={(e) => setPassphrase2(e.target.value)} /></p>
        {mismatch && <><p>Passphrases don't match</p></>}
        <button type="submit">Set Passphrase</button>
      </form>
    </>;

  return <>
    <form onSubmit={handlePassphrase}>
      <h1>Welcome back {user.nickname}!</h1>
      <p>When you first logged in, we created an encryption key to secure your messages. During this process, we asked you for a secure passphrase to allow us to unlock this key. We recommended you use something other than your login password.</p>
      <p>Now's the time to enter this passphrase again...</p>
      <p>Passphrase <input type="text" value={newPassphrase} onChange={(e) => setNewPassphrase(e.target.value)} /></p>
      {isWrongPassphrase && <><p>Passphrase is incorrect</p></>}
      <button type="submit">Unlock My Messages</button>
    </form>
  </>;
};
