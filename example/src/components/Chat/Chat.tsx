import React from 'react';
import { Input } from 'antd';
import 'antd/es/input/style/css';
import styled, { css } from 'styled-components';
import { TextMessageType } from '../../types/TextMessageType';
import { MESSAGE_SENDER } from '../../types/MessageSenderEnum';

export interface ChatProps {
  messages: TextMessageType[];
  sendMessage: (message: string) => any;
};

const InputForm = styled.form``;
const Message = styled.div<{ sender: MESSAGE_SENDER }>`
  ${({ sender }) => sender === MESSAGE_SENDER.ME ? css`
    text-align: right;
  ` : ''};
`;
const MessagesWrapper = styled.div``;
const Wrapper = styled.div``;

export const Chat: React.FC<ChatProps> = ({ messages, sendMessage }) => {
  const [messageToSend, setMessageToSend] = React.useState<string>('');

  const handleMessageToSendInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setMessageToSend(event.target.value);
  }

  const handleMessageToSendFormSubmit: React.FormEventHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    sendMessage(messageToSend);
    setMessageToSend('');
  }

  return (
    <Wrapper>
      <MessagesWrapper>
        {messages.map(message =>
          <Message key={message.id} sender={message.sender}>{message.payload}</Message>  
        )}
      </MessagesWrapper>
      <InputForm onSubmit={handleMessageToSendFormSubmit}>
        <Input type="text" placeholder="Message..." value={messageToSend} onChange={handleMessageToSendInputChange} />
      </InputForm>
    </Wrapper>
  );
}
