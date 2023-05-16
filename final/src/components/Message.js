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

  }, [message.message, privateKey, passphrase, setSender, setDecryptedMessage]);

  if (sender === false || decryptedMessage === false)
    return <div key={message.id} className="message">
      <span><i>Decrypting</i></span>
    </div>;

  if (censored)
    return <div key={message.id} className="message censored">
      <span><i>This message cannot be decrypted</i></span>
    </div>;

  return <div key={message.id} className="message">
    <date>{dayjs.utc(message.created_at).local().format('HH:mm')}</date>
    <span>
      {sender ? sender : "someone"} wrote:
      <span className='userMessage'>{decryptedMessage ? decryptedMessage : 'Decrypting...'}</span>
    </span>
  </div>;
};
