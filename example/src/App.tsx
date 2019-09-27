import React, { Component } from 'react';

import { test } from './typescript-lib';

class App extends Component {
  render() {
    return (
      <div>
        {test('something')}
      </div>
    );
  }
}

export default App;
