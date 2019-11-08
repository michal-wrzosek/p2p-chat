import React from 'react';
import copy from 'copy-to-clipboard';

import { Input } from 'antd';
import 'antd/es/input/style/css';
import { Card } from 'antd';
import 'antd/es/card/style/css';
import { Typography } from 'antd';
import 'antd/es/typography/style/css';

import { ConnectionDescription } from '../../types/ConnectionDescription';
import { Space } from '../Space/Space';
import { encode, decode } from '../../util/connectionDescriptionEncoding';
import { connectionDescriptionValidator } from '../../util/connectionDescriptionValidator';

export interface HostProps {
  connectionDescription: ConnectionDescription;
  onSubmit: (remoteConnectionDescription: ConnectionDescription) => any;
}

export const Host: React.FC<HostProps> = ({ connectionDescription, onSubmit }) => {
  const [remoteConnectionDescription, setRemoteConnectionDescription] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');

  const encodedConnectionDescription = encode(connectionDescription);

  const handleCopyClick = () => {
    copy(encodedConnectionDescription);
  };

  const handleRemoteConnectionDescriptionInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    event.preventDefault();
    event.stopPropagation();
    setError('');
    setRemoteConnectionDescription(event.target.value);
  };

  const handleSubmit = () => {
    try {
      const connectionDescriptionObject = decode(remoteConnectionDescription);
      if (connectionDescriptionValidator(connectionDescriptionObject)) throw new Error();
      onSubmit(connectionDescriptionObject);
    } catch (error) {
      setError('Connection Description invalid!');
    }
  };

  return (
    <Card>
      <Typography.Text>Send this code to other person:</Typography.Text>
      <Space size={4} />
      <Input.Search
        type="text"
        value={encodedConnectionDescription}
        enterButton="Copy to clipboard"
        onSearch={handleCopyClick}
      />
      <Space size={24} />
      <Typography.Text>Code from your buddy:</Typography.Text>
      <Space size={4} />
      <Input.Search
        type="text"
        value={remoteConnectionDescription}
        onChange={handleRemoteConnectionDescriptionInputChange}
        placeholder="Paste an answer code"
        enterButton="Connect"
        onSearch={handleSubmit}
      />
      {!!error && (
        <React.Fragment>
          <Space size={8} />
          <Typography.Text>{error}</Typography.Text>
        </React.Fragment>
      )}
    </Card>
  );
};
