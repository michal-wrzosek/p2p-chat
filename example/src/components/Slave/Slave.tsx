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
import { encode } from '../../util/connectionDescriptionEncoding';

export interface SlaveProps {
  connectionDescription: ConnectionDescription;
}

export const Slave: React.FC<SlaveProps> = ({ connectionDescription }) => {
  const encodedConnectionDescription = encode(connectionDescription);

  const handleCopyClick = () => {
    copy(encodedConnectionDescription);
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
    </Card>
  );
};
