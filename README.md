# p2p-chat
![npm](https://img.shields.io/npm/v/p2p-chat)

Serverless peer to peer chat built on WebRTC.

# [Demo chat](https://michal-wrzosek.github.io/p2p-chat/)

This is an example of how you can build p2p chat on WebRTC. Currently it works only in Firefox. As of writing this package (November 2019) Chrome STUN servers connection doesn't work and if 2 parties are in different networks, p2p connection will not work.

I made a small wrapper around WebRTC for the purpose of constructing a demo chat. It boils down to a function I called `createPeerConnection`.

### To install:
```
npm install --save p2p-chat
```

### To use:

To initiate a new connection (as a HOST):
```typescript
import { createPeerConnection } from 'p2p-chat';

const someAsyncFunc = async () => {
  const onChannelOpen = () => console.log(`Connection ready!`);
  const onMessageReceived = (message: string) => console.log(`New incomming message: ${message}`);
  
  const { localDescription, setAnswerDescription, sendMessage } = await createPeerConnection({ onMessageReceived, onChannelOpen });
  
  // you will send localDescription to your SLAVE and he will give you his localDescription. You will set it as an answer to establish connection
  const answerDescription = 'This is a string you will get from a SLAVE trying to connect with your localDescription';
  setAnswerDescription(answerDescription);
  
  // later on you can send a message to SLAVE
  sendMessage('Hello SLAVE');
}
```

To join a connection (as a SLAVE):
```typescript
import { createPeerConnection } from 'p2p-chat';

const someAsyncFunc = async () => {
  const remoteDescription = 'This is a string you will get from a host...';
  const onChannelOpen = () => console.log(`Connection ready!`);
  const onMessageReceived = (message: string) => console.log(`New incomming message: ${message}`);
  
  const { localDescription, sendMessage } = await createPeerConnection({ remoteDescription, onMessageReceived, onChannelOpen });
  
  // Send your local description to HOST and wait for a connection to start
  
  // Later on you can send a message to HOST
  sendMessage('Hello HOST');
};
```

You can take a look how I implemented it in a demo chat app:
[example/src/App.tsx](https://github.com/michal-wrzosek/p2p-chat/blob/master/example/src/App.tsx)

### Typescript
This lib has types already built in. No need for @types/...
