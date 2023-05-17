import { useEffect, useState } from 'react';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { GetPassphrase } from './components/GetPassphrase';
import { Messages } from './components/Messages';
import { generateKeys } from './functions/pgp';
import './App.css';

function App() {

  const { isAuthenticated, logout, user, getAccessTokenSilently } = useAuth0();
  const [passphrase, setPassphrase] = useState(null);
  const [keys, setKeys] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {

      // Does the user object contain Auth0 user_metadata?
      if (!user['http://localhost:8888/user_metadata']) {
        console.error("ID Token didn't contain user_metadata");
        return;
      }

      // Get the keys object from the user_metadata
      if (user['http://localhost:8888/user_metadata'].keys) {
        setKeys(user['http://localhost:8888/user_metadata'].keys);
        return;
      }

      // We haven't found any keys. If we have the user's passphrase, generate a new keypair
      if (passphrase) {
        generateKeys(user.nickname, user.email, passphrase).then(keys => {

          // Save the keys into this app's state
          setKeys(keys);

          // Save the keys for future retrieval
          getAccessTokenSilently().then(accessToken => {
            fetch(`/.netlify/functions/savekeys`, {
              method: 'post',
              body: JSON.stringify({
                'userId': user.sub,
                'accessToken': accessToken,
                'data': keys
              })
            })
          });

        });
      }

    }
  }, [isAuthenticated, user, passphrase, setKeys, getAccessTokenSilently]);

  return (
    <div className="App">
      <header>
        <button onClick={logout}>Logout</button>
      </header>

      <main>
        {!passphrase && <GetPassphrase firstTime={!keys} keys={keys} callback={setPassphrase} />}
        {passphrase && !keys && <p>Generating Keys</p>}
        {passphrase && keys && <Messages keys={keys} passphrase={passphrase} />}
      </main>

    </div>
  );
}

export default withAuthenticationRequired(App);
