import React, { FC } from 'react';
import styled from 'styled-components';

const Homepage = styled.div``;
const Version = styled.div``;
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: black;
  color: white;
  font-size: 8px;
  padding: 4px 8px;
`;

interface Props {
  version: string;
  homepage: string;
}

export const AppFooter: FC<Props> = ({ version, homepage }) => (
  <Container>
    <Version>{version}</Version>
    <Homepage>{homepage}</Homepage>
  </Container>
);
