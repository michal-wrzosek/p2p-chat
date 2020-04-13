import React, { useState, createRef, FC, memo } from 'react';
import styled from 'styled-components';
import copy from 'copy-to-clipboard';

import { encode, decode } from '../../util/connectionDescriptionEncoding';
import { connectionDescriptionValidator } from '../../util/connectionDescriptionValidator';
import { PageHeader } from '../PageHeader/PageHeader';
import { TextArea } from '../TextArea/TextArea';
import { Button } from '../Button/Button';
import { useChat } from '../../module/useChat/useChat';
import { ConnectionDescription } from '../../module/PeerConnection/PeerConnection';

const ErrorMessage = styled.div``;
const StyledTextArea = styled(TextArea)`
  width: 70%;
`;
const ConnectButton = styled(Button)`
  width: 70%;
  margin-top: 4px;
`;
const CopyButton = styled(Button)`
  width: 70%;
  margin-top: 4px;
`;
const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Instruction = styled.div`
  font-size: 10px;
  color: black;
  margin-bottom: 4px;
`;
const Step = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  width: 18px;
  height: 18px;
  background-color: black;
  color: white;
  font-size: 10px;
  border-radius: 50%;
  line-height: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  > span {
    display: inline-block;
    transform: translate(0.5px, -0.5px);
  }
`;
const Card = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  border: 1px solid black;
  border-top: none;
`;
const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export interface HostProps {
  connectionDescription: ConnectionDescription;
  onSubmit: (remoteConnectionDescription: ConnectionDescription) => any;
}

export const Host: FC = memo(function Host() {
  const { localConnectionDescription, setRemoteConnectionDescription } = useChat();
  const [remoteConnectionDescriptionInputValue, setRemoteConnectionDescriptionInputValue] = useState<string>('');
  const [error, setError] = useState<string>('');
  const copyTextAreaRef = createRef<HTMLTextAreaElement>();

  const encodedConnectionDescription = encode(localConnectionDescription as ConnectionDescription);

  const handleCopyClick = () => {
    if (!copyTextAreaRef.current) return;

    copyTextAreaRef.current.select();
    copy(encodedConnectionDescription);
  };

  const handleRemoteConnectionDescriptionInputChange: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setError('');
    setRemoteConnectionDescriptionInputValue(event.target.value);
  };

  const handleSubmit: React.FormEventHandler = (event) => {
    try {
      event.stopPropagation();
      event.preventDefault();
      const connectionDescriptionObject = decode(remoteConnectionDescriptionInputValue);
      if (connectionDescriptionValidator(connectionDescriptionObject)) throw new Error();
      setRemoteConnectionDescription(connectionDescriptionObject as ConnectionDescription);
    } catch (error) {
      setError('Connection Description invalid!');
    }
  };

  return (
    <Container>
      <PageHeader>Starting a new chat</PageHeader>
      <Card>
        <Step>
          <span>1</span>
        </Step>
        <Instruction>Send this code to your buddy:</Instruction>
        <StyledTextArea ref={copyTextAreaRef} value={encodedConnectionDescription} readOnly />
        <CopyButton onClick={handleCopyClick}>Copy to clipboard</CopyButton>
      </Card>
      <Card>
        <Step>
          <span>2</span>
        </Step>
        <Form onSubmit={handleSubmit}>
          <Instruction>Code from your buddy:</Instruction>
          <StyledTextArea
            value={remoteConnectionDescriptionInputValue}
            onChange={handleRemoteConnectionDescriptionInputChange}
            placeholder="Paste an answer code"
          />
          <ConnectButton type="submit">Connect</ConnectButton>
        </Form>
        {!!error && <ErrorMessage>{error}</ErrorMessage>}
      </Card>
    </Container>
  );
});
