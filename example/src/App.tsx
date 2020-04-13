import React, { memo, FC } from 'react';
import styled from 'styled-components';

import { Chat } from './components/Chat/Chat';
import { HostOrSlave } from './components/HostOrSlave/HostOrSlave';
import { Host } from './components/Host/Host';
import { Slave } from './components/Slave/Slave';
import { AppHeader } from './components/AppHeader/AppHeader';
import { AppFooter } from './components/AppFooter/AppFooter';
import { useChat, useChatPeerConnectionSubscription } from './module/useChat/useChat';
import { PEER_CONNECTION_MODE } from './module/PeerConnection/PeerConnection';

const InnerWrapper = styled.div`
  background-color: white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
`;
const Wrapper = styled.div`
  padding: 12px;
  max-width: 320px;
  margin: 0 auto;
`;

const App: FC = memo(function App() {
  const { mode, isConnected } = useChat();
  useChatPeerConnectionSubscription();

  return (
    <Wrapper>
      <InnerWrapper>
        <AppHeader />
        {!mode && <HostOrSlave />}
        {mode === PEER_CONNECTION_MODE.HOST && !isConnected && <Host />}
        {mode === PEER_CONNECTION_MODE.SLAVE && !isConnected && <Slave />}
        {mode && isConnected && <Chat />}
        <AppFooter version="v3.0.0" homepage="github.com/michal-wrzosek/p2p-chat" />
      </InnerWrapper>
    </Wrapper>
  );
});

export default App;
