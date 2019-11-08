import { MESSAGE_SENDER } from './MessageSenderEnum';

export type TextMessageType = {
  id: string;
  sender: MESSAGE_SENDER;
  payload: string;
};
