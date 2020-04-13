import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';
import { PeerConnectionProvider } from './module/PeerConnection/PeerConnection';
import { FileBuffersProvider } from './module/FileBuffers/FileBuffers';
import { GlobalStyle } from './styles/globalStyle';
import App from './App';

ReactDOM.render(
  <PeerConnectionProvider>
    <FileBuffersProvider>
      <Fragment>
        <GlobalStyle />
        <App />
      </Fragment>
    </FileBuffersProvider>
  </PeerConnectionProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
