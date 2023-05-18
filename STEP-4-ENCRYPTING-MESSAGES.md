# Build your own Secure Messenger



![spacer](readme-images/spacer.png)

## Encrypting Messages on Form Submission

👉 ACTION: Open the `start/src/components/Messages.js` file, and find the `handleFormSubmit` function. Take a look to understand what it does, and then replace it with the following:

```js
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
```

_💡&nbsp;TIP: Notice we're grabbing all the `keys` from Supabase here? This makes sure we have all the private keys of all users, so they can all decrypt this message later._

👉 ACTION: Refresh your Messenger App to make sure the latest code is running, enter your passphrase to unlock the PGP keypair, and then try sending another message.

🧪&nbsp;CHECK&nbsp;POINT: You should see that your new message looks something like:

```
-----BEGIN PGP MESSAGE-----
.........................................
.........................................
.........................................
.........................................
-----END PGP MESSAGE-----
-----BEGIN PGP MESSAGE-----
.........................................
.........................................
.........................................
.........................................
-----END PGP MESSAGE-----
```

![spacer](readme-images/spacer.png)

---

[▶️ STEP 5: Decrypting Messages](./STEP-5-DECRYPTING-MESSAGES.md)

_[⎌ Back to step 3: Create a Public/Private Keypair](STEP-3-CREATE-A-PUBLIC-PRIVATE-KEYPAIR.md)_