import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { encryptMessageWithPublicKey } from '../functions/pgp';
import { Message } from './Message';
import { useAuth0 } from '@auth0/auth0-react';

export const Messages = ({ keys, passphrase }) => {

  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const { user } = useAuth0();

  useEffect(() => {

    // Load messages from the messages table in supabase
    const fetchMessages = async () => {
      const { data: messages } = await supabase.from('messages').select('*');
      setMessages(messages);
    };
    fetchMessages();

    // Subscribe to table changes and receive updates in realtime
    const messageSubscription = supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          // When a new message is inserted, update the messages state
          setMessages((messages) => [...messages, payload.new]);
        }
      )
      .subscribe()

    // Unsubscribe from the channel when the component unmounts
    return () => {
      messageSubscription.unsubscribe();
    };

    // We need the supabase client to be available before we can subscribe to changes,
    // but adding it as a dependency to useEffect will cause an infinite loop.
    // To avoid this, we can disable the eslint rule for this line.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Get the public keys from supabase and encrypt the sender name and message
    const { data: publicKeys } = await supabase.from('keys').select('*');
    const encryptedMessage = await encryptMessageWithPublicKey(newMessage, publicKeys);
    const encryptedSender = await encryptMessageWithPublicKey(user.nickname, publicKeys);

    // Insert the sender and message into the messages table
    await supabase.from('messages').insert([
      {
        sender: encryptedSender,
        message: encryptedMessage
      }
    ]);

    // Reset the input
    setNewMessage('');
  };

  return (
    <div>
      <h1>Chat Room</h1>
      <div>
        {messages.length === 0 && <p>Loading messages...</p>}
        {messages.map((message) => (
          <Message key={message.id} message={message} privateKey={keys.privateKey} passphrase={passphrase} />
        ))}
      </div>
      <form onSubmit={handleFormSubmit} className='newMessage'>
        <input type="text" placeholder='Write a new message...' value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
        <button type="submit">Post 📨</button>
      </form>
    </div>
  );


};
