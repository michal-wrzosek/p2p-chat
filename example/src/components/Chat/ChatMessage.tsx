import React, { FC, memo } from 'react';
import styled, { css } from 'styled-components';

import { MESSAGE_SENDER } from '../../types/MessageSenderEnum';
import { ChatMessageType } from '../../types/ChatMessageType';
import { useFileBuffer } from '../../module/FileBuffers/FileBuffers';

const Text = styled.div``;
const Header = styled.div`
  font-size: 12px;

  > span {
    font-weight: 700;
  }
`;
const Message = styled.div<{ sender: MESSAGE_SENDER }>`
  padding: 4px;
  background-color: greenyellow;

  ${({ sender }) =>
    sender === MESSAGE_SENDER.ME
      ? css`
          background-color: cyan;
        `
      : ''};
`;

interface ChatFileMessageType extends ChatMessageType {
  fileId: string;
}

interface ChatFileMessageProps {
  chatMessage: ChatFileMessageType;
}

const ChatFileMessage: FC<ChatFileMessageProps> = memo(function ChatFileMessage({ chatMessage }) {
  const { fileName, fileSize, receivedSize, receivedBlobUrl } = useFileBuffer(chatMessage.fileId);

  if (typeof fileSize === 'undefined' || typeof fileName === 'undefined') {
    return (
      <Message sender={chatMessage.sender}>
        <Header>
          <span>{chatMessage.sender === MESSAGE_SENDER.ME ? 'Me' : 'Friend'}</span> (
          {new Date(chatMessage.timestamp).toLocaleTimeString()})
        </Header>
        <Text>File in progress...</Text>
      </Message>
    );
  }

  if (!receivedBlobUrl) {
    return (
      <Message sender={chatMessage.sender}>
        <Header>
          <span>{chatMessage.sender === MESSAGE_SENDER.ME ? 'Me' : 'Friend'}</span> (
          {new Date(chatMessage.timestamp).toLocaleTimeString()})
        </Header>
        <Text>
          {fileName} {Math.floor((receivedSize / fileSize) * 100)}%
        </Text>
      </Message>
    );
  }

  return (
    <Message sender={chatMessage.sender}>
      <Header>
        <span>{chatMessage.sender === MESSAGE_SENDER.ME ? 'Me' : 'Friend'}</span> (
        {new Date(chatMessage.timestamp).toLocaleTimeString()})
      </Header>
      <Text>
        <a href={receivedBlobUrl} download={fileName}>
          {fileName}
        </a>
      </Text>
    </Message>
  );
});

const ChatTextMessage: FC<Props> = memo(function ChatTextMessage({ chatMessage }) {
  return (
    <Message sender={chatMessage.sender}>
      <Header>
        <span>{chatMessage.sender === MESSAGE_SENDER.ME ? 'Me' : 'Friend'}</span> (
        {new Date(chatMessage.timestamp).toLocaleTimeString()})
      </Header>
      <Text>{chatMessage.text}</Text>
    </Message>
  );
});

interface Props {
  chatMessage: ChatMessageType;
}

export const ChatMessage: FC<Props> = memo(function ChatMessage({ chatMessage }) {
  if (chatMessage.fileId) return <ChatFileMessage chatMessage={chatMessage as ChatFileMessageType} />;

  return <ChatTextMessage chatMessage={chatMessage} />;
});
