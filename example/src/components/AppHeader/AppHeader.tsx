import React, { FC } from 'react';
import styled from 'styled-components';

const SubTitle = styled.h2`
  font-size: 10px;
  font-weight: 400;
  text-align: center;
  margin: 0;
  padding: 4px;
`;
const Title = styled.h1`
  font-size: 16px;
  font-weight: 400;
  background-color: black;
  color: white;
  text-align: center;
  margin: 0;
  padding: 4px;

  > span {
    display: inline-block;
    padding-left: 3px;
    transform: translate(0, 2px);
  }
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  border-bottom: none;
`;

export const AppHeader: FC = () => (
  <Container>
    <Title>
      <span role="img" aria-label="smile emoji">
        😃
      </span>
      pitu-pitu
      <span role="img" aria-label="smile emoji">
        😃
      </span>
    </Title>
    <SubTitle>p2p chat on WebRTC with additional AES256 encryption and file sharing</SubTitle>
  </Container>
);
