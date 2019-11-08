import React from 'react';
import styled from 'styled-components';
import { Base64 } from 'js-base64';

import { Card } from 'antd';
import 'antd/es/card/style/css';

import { createPeerConnection } from './typescript-lib';
import { Chat } from './components/Chat/Chat';
import { MessageType } from './types/MessageType';
import { MESSAGE_SENDER } from './types/MessageSenderEnum';
import { MESSAGE_TYPE } from './types/MessageTypeEnum';
import { encrypt, generateKey, decrypt } from './util/encryption';
import { HostOrSlave } from './components/HostOrSlave/HostOrSlave';
import { ConnectionDescription } from './types/ConnectionDescription';
import { Host } from './components/Host/Host';
import { Slave } from './components/Slave/Slave';
import { Space } from './components/Space/Space';

enum Mode {
  HOST = 'HOST',
  SLAVE = 'SLAVE',
}

const DetailsValue = styled.pre`
  font-size: 10px;
`;
const DetailsLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
`;
const DetailsWrapper = styled.div``;
const Version = styled.div`
  text-align: center;
  font-size: 10px;
`;
const Subtitle = styled.div`
  text-align: center;
  font-size: 12px;
`;
const Title = styled.div`
  text-align: center;
  font-size: 16px;
  font-weight: 700;
`;
const Wrapper = styled.div`
  padding: 12px;
  max-width: 400px;
  margin: 0 auto;
`;

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

const App: React.FC = () => {
  const [mode, setMode] = React.useState<Mode | undefined>();
  const [isReady, setIsReady] = React.useState<boolean>(false);
  const [encryptionKey, setEncryptionKey] = React.useState<string | undefined>();
  const [localDescription, setLocalDescription] = React.useState<string | undefined>();
  const [encryptedMessages, setEncryptedMessages] = React.useState<string[]>([]);
  const [messages, setMessages] = React.useState<MessageType[]>([]);
  const setAnswerDescriptionRef = React.useRef<((answerDescription: string) => void) | undefined>();
  const sendMessageRef = React.useRef<((message: string) => void) | undefined>();

  const onMessageReceived = (encryptionKey: string) => (messageString: string) => {
    if (encryptionKey) {
      try {
        const decryptedMessageString = decrypt(messageString, encryptionKey);
        const message = JSON.parse(decryptedMessageString) as MessageType;
        setEncryptedMessages(m => [messageString, ...m]);
        setMessages(messages => [...messages, message]);
      } catch {}
    }
  };

  const onChannelOpen = () => setIsReady(true);

  const handleHostSelection = async () => {
    const encryptionKey = generateKey();
    setEncryptionKey(encryptionKey);
    const { localDescription, setAnswerDescription, sendMessage } = await createPeerConnection({
      iceServers,
      onMessageReceived: onMessageReceived(encryptionKey),
      onChannelOpen,
    });
    setMode(Mode.HOST);
    sendMessageRef.current = sendMessage;
    setAnswerDescriptionRef.current = setAnswerDescription;
    setLocalDescription(Base64.encode(localDescription));
  };

  const handleRemoteConnectionDescriptionSubmit = (remoteConnectionDescription: ConnectionDescription) => {
    if (setAnswerDescriptionRef.current) {
      setAnswerDescriptionRef.current(Base64.decode(remoteConnectionDescription.description));
    }
  };

  const handleSlaveSelection = async (connectionDescription: ConnectionDescription) => {
    const { encryptionKey } = connectionDescription;
    setEncryptionKey(encryptionKey);
    const { localDescription, sendMessage } = await createPeerConnection({
      iceServers,
      remoteDescription: Base64.decode(connectionDescription.description),
      onMessageReceived: onMessageReceived(encryptionKey),
      onChannelOpen,
    });
    setMode(Mode.SLAVE);
    sendMessageRef.current = sendMessage;
    setLocalDescription(Base64.encode(localDescription));
  };

  const handleChatSendMessage = (messageToSend: string) => {
    if (sendMessageRef.current && encryptionKey) {
      const message: MessageType = {
        id: Math.random().toFixed(10),
        sender: MESSAGE_SENDER.STRANGER,
        type: MESSAGE_TYPE.TEXT,
        payload: messageToSend,
      };

      const messageString = JSON.stringify(message);
      const encryptedMessageString = encrypt(messageString, encryptionKey);
      sendMessageRef.current(encryptedMessageString);
      setEncryptedMessages(m => [encryptedMessageString, ...m]);
      setMessages(messages => [
        ...messages,
        {
          ...message,
          sender: MESSAGE_SENDER.ME,
        },
      ]);
    }
  };

  const localConnectionDescription = {
    description: localDescription as string,
    encryptionKey: encryptionKey as string,
  } as ConnectionDescription;
  const textMessages = messages.filter(m => m.type === MESSAGE_TYPE.TEXT);

  return (
    <Wrapper>
      <Title style={{ textAlign: 'center' }}>pitu-pitu</Title>
      <Subtitle style={{ textAlign: 'center' }}>p2p chat on WebRTC with additional AES256 encryption</Subtitle>
      <Space size={24} />
      {!mode && <HostOrSlave onHost={handleHostSelection} onSlave={handleSlaveSelection} />}
      {mode === Mode.HOST && !isReady && (
        <Host connectionDescription={localConnectionDescription} onSubmit={handleRemoteConnectionDescriptionSubmit} />
      )}
      {mode === Mode.SLAVE && !isReady && <Slave connectionDescription={localConnectionDescription} />}
      {mode && isReady && <Chat messages={textMessages} sendMessage={handleChatSendMessage} />}
      <Space size={24} />
      <Version>v2.0.0</Version>
      <Space size={64} />
      <Card>
        <DetailsWrapper>
          <DetailsLabel>ICE Servers used to establish connection:</DetailsLabel>
          <DetailsValue>{JSON.stringify(iceServers, null, 2)}</DetailsValue>
        </DetailsWrapper>
        <DetailsWrapper>
          <DetailsLabel>Encryption key:</DetailsLabel>
          <DetailsValue>{encryptionKey}</DetailsValue>
        </DetailsWrapper>
        <DetailsWrapper>
          <DetailsLabel>Encrypted messages:</DetailsLabel>
          <DetailsValue>{JSON.stringify(encryptedMessages, null, 2)}</DetailsValue>
        </DetailsWrapper>
      </Card>
    </Wrapper>
  );
};

export default App;
