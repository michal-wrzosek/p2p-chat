import { MESSAGE_SENDER } from './MessageSenderEnum';

export type ChatMessageType = {
  id: string;
  sender: MESSAGE_SENDER;
  timestamp: number;
  text?: string;
  fileId?: string;
};
