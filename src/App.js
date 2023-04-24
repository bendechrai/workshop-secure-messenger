import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import './App.css';
import { GetPassphrase } from './components/GetPassphrase';
import { generateKeys } from './functions/pgp';

function App() {

  const { isAuthenticated, logout, user, getAccessTokenSilently } = useAuth0();
  const [passphrase, setPassphrase] = useState(null);
  const [keys, setKeys] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {


      if (!user['http://localhost:8888/user_metadata']) {
        console.error("ID Token didn't contain user_metedata");
        return;
      }

      if (user['http://localhost:8888/user_metadata'].keys) {
        setKeys(user['http://localhost:8888/user_metadata'].keys);
        return;
      }

      if (passphrase) {
        generateKeys("Anonymous", user.email, passphrase).then(keys => {
          setKeys(keys);
          getAccessTokenSilently().then(accessToken => {
            fetch(`/.netlify/functions/savekeys`, {
              method: 'post',
              body: JSON.stringify({
                'userId': user.sub,
                'accessToken': accessToken,
                'data': { 'user_metadata': { keys } }
              })
            })
          });

        });
      }

    }
  }, [isAuthenticated, user, passphrase, setKeys, getAccessTokenSilently])

  return (
    <div className="App">
      {!passphrase && <GetPassphrase firstTime={!keys} callback={setPassphrase} />}
      {passphrase && !keys && <>
        <p>Generating Keys</p>
      </>}
      <button onClick={logout}>Logout</button>


      <pre>{JSON.stringify({
        passphrase,
        keys
      }, null, 4)}</pre>


    </div>
  );
}

export default withAuthenticationRequired(App);
