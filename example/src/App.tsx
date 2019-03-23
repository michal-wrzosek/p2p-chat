import React, { Component } from "react";
import styled from "styled-components";

import { TestComponent } from "./reactComponentLib";

const StyledDiv = styled.div`
  padding: 10px;
  background-color: blue;
  color: white;
`;

class App extends Component {
  render() {
    return (
      <div>
        <TestComponent text="Styled Component from React library" />
        <StyledDiv>Example App styled component</StyledDiv>
      </div>
    );
  }
}

export default App;
