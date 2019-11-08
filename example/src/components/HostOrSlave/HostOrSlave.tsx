import React from 'react';

import { Input } from 'antd';
import 'antd/es/input/style/css';
import { Card } from 'antd';
import 'antd/es/card/style/css';
import { Button } from 'antd';
import 'antd/es/button/style/css';
import { Typography } from 'antd';
import 'antd/es/typography/style/css';

import { ConnectionDescription } from '../../types/ConnectionDescription';
import { Space } from '../Space/Space';
import { connectionDescriptionValidator } from '../../util/connectionDescriptionValidator';
import { decode } from '../../util/connectionDescriptionEncoding';

export interface HostOrSlaveProps {
  onHost: () => any;
  onSlave: (connectionDescription: ConnectionDescription) => any;
}

export const HostOrSlave: React.FC<HostOrSlaveProps> = ({ onHost, onSlave }) => {
  const [connectionDescription, setConnectionDescription] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');

  const handleHostBtnClick: React.MouseEventHandler<HTMLButtonElement> = event => {
    event.preventDefault();
    event.stopPropagation();
    onHost();
  };

  const handleConnectionDescriptionInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    event.preventDefault();
    event.stopPropagation();
    setError('');
    setConnectionDescription(event.target.value);
  };

  const handleSlaveFormSubmit: React.FormEventHandler = event => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const connectionDescriptionObject = decode(connectionDescription);
      if (connectionDescriptionValidator(connectionDescriptionObject)) throw new Error();
      onSlave(connectionDescriptionObject);
    } catch (error) {
      setError('Connection Description invalid!');
    }
  };

  return (
    <React.Fragment>
      <Card>
        <Button onClick={handleHostBtnClick} type="primary" block>
          New chat
        </Button>
      </Card>
      <Space size={24} />
      <Card>
        <form onSubmit={handleSlaveFormSubmit}>
          <Input
            type="text"
            value={connectionDescription}
            onChange={handleConnectionDescriptionInputChange}
            placeholder="Paste Connection Description here..."
          />
          {!!error && (
            <React.Fragment>
              <Space size={8} />
              <Typography.Text>{error}</Typography.Text>
            </React.Fragment>
          )}
          <Space size={12} />
          <Button type="primary" htmlType="submit" block>
            Join a chat
          </Button>
        </form>
      </Card>
    </React.Fragment>
  );
};
