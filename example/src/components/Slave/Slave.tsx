import React, { FC, createRef, memo } from 'react';
import styled from 'styled-components';
import copy from 'copy-to-clipboard';

import { encode } from '../../util/connectionDescriptionEncoding';
import { PageHeader } from '../PageHeader/PageHeader';
import { Button } from '../Button/Button';
import { TextArea } from '../TextArea/TextArea';
import { useChat } from '../../module/useChat/useChat';
import { ConnectionDescription } from '../../module/PeerConnection/PeerConnection';

const CopyButton = styled(Button)`
  width: 70%;
  margin-top: 4px;
`;
const StyledTextArea = styled(TextArea)`
  width: 70%;
`;
const Instruction = styled.div`
  font-size: 10px;
  color: black;
  margin-bottom: 4px;
`;
const Card = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  border: 1px solid black;
  border-top: none;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Slave: FC = memo(function Slave() {
  const { localConnectionDescription } = useChat();
  const copyTextAreaRef = createRef<HTMLTextAreaElement>();

  const encodedConnectionDescription = encode(localConnectionDescription as ConnectionDescription);

  const handleCopyClick = () => {
    if (!copyTextAreaRef.current) return;

    copyTextAreaRef.current.select();
    copy(encodedConnectionDescription);
  };

  return (
    <Container>
      <PageHeader>Joining a chat</PageHeader>
      <Card>
        <Instruction>Send back this code to your buddy:</Instruction>
        <StyledTextArea ref={copyTextAreaRef} value={encodedConnectionDescription} readOnly />
        <CopyButton onClick={handleCopyClick}>Copy to clipboard</CopyButton>
      </Card>
    </Container>
  );
});
