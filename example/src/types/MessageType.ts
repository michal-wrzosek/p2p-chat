import { MESSAGE_SENDER } from './MessageSenderEnum';
import { MESSAGE_TYPE } from './MessageTypeEnum';

export type MessageType = {
  id: string;
  sender: MESSAGE_SENDER;
  type: MESSAGE_TYPE;
  payload: string;
};
