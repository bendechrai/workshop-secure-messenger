# Build your own Secure Messenger



![spacer](readme-images/spacer.png)

## Storing keys in Supabase

_💡&nbsp;TIP: We'll be storing the public keys in Supabase. This will allow us to encrypt messages for all users later. More on that to come._

👉 ACTION: Run another SQL script in Supabase (click the command prompt looking icon on the left of your dashboard, then **"Create table"**):

```sql
create table keys (
  id serial primary key,
  key text not null,
  created_at timestamp default now()
);
```



![spacer](readme-images/spacer.png)

## Storing keys in Auth0

_💡&nbsp;TIP: Nothing to do here. The Netlify Function at `start/netlify/functions/savekeys.js` does all the work for us already. We'll discuss the pros and cons of this approach in the workshop though._




![spacer](readme-images/spacer.png)

## Generating keys in JavaScript

_💡&nbsp;TIP: This starter app already has the [`openpgp` NPM module](https://openpgpjs.org/) installed, but if you're working on something like this in another project, don't forget to install it!_

👉 ACTION: Replace the contents of `start/src/App.js` with the following:

```js
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

      // We haven't found any keys. If we have the user's passphrase,
      // generate a new keypair
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
```

_💡&nbsp;TIP: We'll go through any code that you're asked to copy and paste during the workshop so that you understand what's going on._

_💡&nbsp;TIP #2: Take a look at `start/src/functions/pgp.js` to see what the `generateKeys` function does. It's surprisingly straight-forward!_

👉 ACTION: Refresh the Messenger App and you'll be prompted for a passphrase. Pick something easy to type for the purposes of this workshop - you'll need to do it often. I use `123`. Don't judge me!

🧪&nbsp;CHECK&nbsp;POINT: Once you see the "Generating keys" messages appear and disappear, you can verify all is well by looking at the `keys` table in Supabase, and the `user_metadata` area of the user profile in Auth0. You should see the public key, and the public/private keypair respectively.



![spacer](readme-images/spacer.png)

---

[▶️ STEP 4: Encrypting Messages](./STEP-4-ENCRYPTING-MESSAGES.md)

_[⎌ Back to step 2: Get the starter application working](STEP-2-STARTER-APP.md)_