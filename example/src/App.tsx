import React from 'react';
import { Input } from 'antd';
import 'antd/es/input/style/css';
import { Card } from 'antd';
import 'antd/es/card/style/css';
import { Button } from 'antd';
import 'antd/es/button/style/css';
import { Typography } from 'antd';
import 'antd/es/typography/style/css';
import { createPeerConnection } from './typescript-lib';
import { Chat } from './components/Chat/Chat';
import { MessageType } from './types/MessageType';
import { MESSAGE_SENDER } from './types/MessageSenderEnum';
import { MESSAGE_TYPE } from './types/MessageTypeEnum';
import { Space } from './components/Space/Space';
import styled from 'styled-components';
import { Base64 } from 'js-base64';
import copy from 'copy-to-clipboard';

enum Mode {
  HOST = 'HOST',
  SLAVE = 'SLAVE',
};

const Version = styled.div`
  text-align: center;
  font-size: 10px;
`;
const Wrapper = styled.div`
  padding: 12px;
  max-width: 400px;
  margin: 0 auto;
`;

const App: React.FC = () => {
  const [mode, setMode] = React.useState<Mode | undefined>();
  const [isReady, setIsReady] = React.useState<boolean>(false);
  const [localDescription, setLocalDescription] = React.useState<string | undefined>();
  const [remoteDescription, setRemoteDescription] = React.useState<string>('');
  const [messages, setMessages] = React.useState<MessageType[]>([]);
  const setAnswerDescriptionRef = React.useRef<((answerDescription: string) => void) | undefined>();
  const sendMessageRef = React.useRef<((message: string) => void) | undefined>();

  const onMessageReceived = (messageString: string) => {
    try {
      const message = JSON.parse(messageString) as MessageType;
      setMessages((messages) => [...messages, message]);
    } catch {}
  }

  const onChannelOpen = () => setIsReady(true);

  const handleHostBtnClick = async () => {
    setMode(Mode.HOST);
    const { localDescription, setAnswerDescription, sendMessage } = await createPeerConnection({ onMessageReceived, onChannelOpen });
    sendMessageRef.current = sendMessage;
    setAnswerDescriptionRef.current = setAnswerDescription;
    setLocalDescription(Base64.encode(localDescription));
  }

  const handleAnswerBtnClick = () => {
    if (remoteDescription && setAnswerDescriptionRef.current) {
      setAnswerDescriptionRef.current(Base64.decode(remoteDescription));
    }
  }

  const handleRemoteDescriptionInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setRemoteDescription(event.target.value);
  }

  const handleSlaveBtnClick = async () => {
    if (remoteDescription) {
      setMode(Mode.SLAVE);
      const { localDescription, sendMessage } = await createPeerConnection({ remoteDescription: Base64.decode(remoteDescription), onMessageReceived, onChannelOpen });
      sendMessageRef.current = sendMessage;
      setLocalDescription(Base64.encode(localDescription));
    }
  }

  const handleLocalDescriptionCopy = () => {
    localDescription && copy(localDescription);
  }

  const handleChatSendMessage = (messageToSend: string) => {
    if (sendMessageRef.current) {
      const message: MessageType = {
        id: Math.random().toFixed(10),
        sender: MESSAGE_SENDER.STRANGER,
        type: MESSAGE_TYPE.TEXT,
        payload: messageToSend,
      };

      sendMessageRef.current(JSON.stringify(message));
      setMessages((messages) => [...messages, {
        ...message,
        sender: MESSAGE_SENDER.ME,
      }])
    }
  }

  const textMessages = messages.filter(m => m.type === MESSAGE_TYPE.TEXT);
  
  return (
    <Wrapper>
      <Typography.Title style={{ textAlign: 'center' }}>p2p chat</Typography.Title>
      {!mode &&
        <div>
          <Card>
            <Button onClick={handleHostBtnClick} type="primary" block>New chat</Button>
          </Card>
          <Space size={24} />
          <Card>
            <Input type="text" value={remoteDescription} onChange={handleRemoteDescriptionInputChange} placeholder="Paste connection code here..." />
            <Space size={12} />
            <Button onClick={handleSlaveBtnClick} type="primary" block>Join a chat</Button>
          </Card>
        </div>
      }
      {mode === Mode.HOST && !isReady &&
        <div>
          <Typography.Text>Send this code to other person:</Typography.Text>
          <Space size={4} />
          <Input.Search
            type="text"
            value={localDescription ? localDescription : 'preparing connection...'}
            enterButton="Copy to clipboard"
            onSearch={handleLocalDescriptionCopy}
          />
          <Space size={24} />
          <Typography.Text>Code from your buddy:</Typography.Text>
          <Space size={4} />
          <Input.Search
            type="text"
            value={remoteDescription}
            onChange={handleRemoteDescriptionInputChange}
            placeholder="Paste an answer code"
            enterButton="Connect"
            onSearch={handleAnswerBtnClick}
          />
        </div>
      }
      {mode === Mode.SLAVE && !isReady &&
        <div>
          <Typography.Text>Send this code to other person:</Typography.Text>
          <Space size={4} />
          <Input.Search
            type="text"
            value={localDescription ? localDescription : 'preparing connection...'}
            enterButton="Copy to clipboard"
            onSearch={handleLocalDescriptionCopy}
          />
        </div>
      }
      {mode && isReady &&
        <Chat messages={textMessages} sendMessage={handleChatSendMessage} />
      }
      <Version>v0.0.2</Version>
    </Wrapper>
  );
};

export default App;
