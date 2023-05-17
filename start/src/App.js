import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Messages } from './components/Messages';
import './App.css';

function App() {

  const { logout } = useAuth0();

  // Paste code here to pull keys from user_metadata, or generate them if they don't exist

  return (
    <div className="App">
      <header>
        <button onClick={logout}>Logout</button>
      </header>

      <main>
        <Messages />
      </main>

    </div>
  );
}

export default withAuthenticationRequired(App);
