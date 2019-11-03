import React from 'react';
import styled from 'styled-components';

export const Space = styled.div<{ size: number }>`
  padding-top: ${({ size }) => `${size}px`};
`;
