# p2p-chat
![npm](https://img.shields.io/npm/v/p2p-chat)

Serverless peer to peer chat built on WebRTC.

# [>Demo chat<](https://michal-wrzosek.github.io/p2p-chat/)
The source code of demo chat is [here](https://github.com/michal-wrzosek/p2p-chat/tree/master/example/src)

This is an example of how you can build p2p chat on WebRTC. It should work in both Chrome and Firefox. WebRTC needs STUN and TURN servers to successfully establish p2p connection over the network. In my demo app I used some publicly available endpoints:
 - stun:stun.l.google.com:19302
 - turn:turn.anyfirewall.com:443?transport=tcp (webrtc:webrtc)

 Just to add some additional layer of security to my demo chat I added AES256 encryption to messages that are sent through WebRTC.

# Library

I made a small wrapper around WebRTC for the purpose of constructing a demo chat. It boils down to a function I called `createPeerConnection`.

### To install:
```
npm install --save p2p-chat
```

### To use:

To initiate a new connection (as a HOST):
```typescript
import { createPeerConnection } from 'p2p-chat';

const iceServers: RTCIceServer[] = [
  {
    urls: 'stun:stun.l.google.com:19302',
  },
  {
    urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
    username: 'webrtc',
    credential: 'webrtc',
  },
];

const someAsyncFunc = async () => {
  const onChannelOpen = () => console.log(`Connection ready!`);
  const onMessageReceived = (message: string) => console.log(`New incomming message: ${message}`);
  
  const { localDescription, setAnswerDescription, sendMessage } = await createPeerConnection({ iceServers, onMessageReceived, onChannelOpen });
  
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

const iceServers: RTCIceServer[] = [
  {
    urls: 'stun:stun.l.google.com:19302',
  },
  {
    urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
    username: 'webrtc',
    credential: 'webrtc',
  },
];

const someAsyncFunc = async () => {
  const remoteDescription = 'This is a string you will get from a host...';
  const onChannelOpen = () => console.log(`Connection ready!`);
  const onMessageReceived = (message: string) => console.log(`New incomming message: ${message}`);
  
  const { localDescription, sendMessage } = await createPeerConnection({ remoteDescription, iceServers, onMessageReceived, onChannelOpen });
  
  // Send your local description to HOST and wait for a connection to start
  
  // Later on you can send a message to HOST
  sendMessage('Hello HOST');
};
```

You can take a look how I implemented it in a demo chat app:
[example/src/App.tsx](https://github.com/michal-wrzosek/p2p-chat/blob/master/example/src/App.tsx)

### Typescript
This lib has types already built in. No need for @types/...
