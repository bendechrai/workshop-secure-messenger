# Build your own Secure Messenger



![spacer](readme-images/spacer.png)

## Decrypting Messages during render

👉 ACTION: Open the `start/src/components/Messages.js` file, and find the call to the `<Message />` component in the `return` block at the end of the file. Replace it with the following:

```html
          <Message key={message.id} message={message} privateKey={keys.privateKey} passphrase={passphrase} />
```

👉 ACTION: Open the `start/src/components/Message.js` file. Take a look to understand what it does, and then replace it with the following:

```js
import { useEffect, useState } from 'react';
import { decryptMessageWithPrivateKey } from '../functions/pgp';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const Message = ({ message, privateKey, passphrase }) => {

  const [sender, setSender] = useState(false);
  const [decryptedMessage, setDecryptedMessage] = useState(false);
  const [censored, setCensored] = useState(false);

  useEffect(() => {

    decryptMessageWithPrivateKey(message.sender, privateKey, passphrase)
      .then(result => {
        if (result)
          setSender(result);
        else {
          setSender('');
          setCensored(true);
        }
      });

    decryptMessageWithPrivateKey(message.message, privateKey, passphrase)
      .then(result => {
        if (result)
          setDecryptedMessage(result);
        else {
          setDecryptedMessage('');
          setCensored(true);
        }
      });

  }, [message.message, message.sender, privateKey, passphrase, setSender, setDecryptedMessage]);

  if (sender === false || decryptedMessage === false)
    return <div key={message.id} className="message">
      <span><i>Decrypting</i></span>
    </div>;

  if (censored)
    return <div key={message.id} className="message censored">
      <span><i>This message cannot be decrypted</i></span>
    </div>;

  return <div key={message.id} className="message">
    <span className='date'>{dayjs.utc(message.created_at).local().format('HH:mm')}</span>
    <span className='sender'>{sender ? sender : "someone"} wrote:{" "}</span>
    <span className='messageText'>{decryptedMessage ? decryptedMessage : 'Decrypting...'}</span>
  </div>;
};
```

👉 ACTION: Refresh your Messenger App to make sure the latest code is running, enter your passphrase to unlock the PGP keypair, and take a look at what the message lis looks like now.

🧪&nbsp;CHECK&nbsp;POINT: You should see that your latest message is now readable, but the others aren't.

![spacer](readme-images/spacer.png)

---

[▶️ STEP 6: Testing Multi-User Cryptography](./STEP-6-TESTING-MULTIUSER-CRYPTOGRAPHY.md)

_[⎌ Back to step 4: Encrypting Messages](./STEP-4-ENCRYPTING-MESSAGES.md)_