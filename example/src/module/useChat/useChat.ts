import { useCallback } from 'react';
import shortid from 'shortid';

import { MessageType, MessageTextType, MessageFileInfoType, MessageFileChunkType } from '../../types/MessageType';
import { usePeerConnection, usePeerConnectionSubscription } from '../PeerConnection/PeerConnection';
import { useOnFileBufferReceived } from '../FileBuffers/FileBuffers';
import { MESSAGE_SENDER } from '../../types/MessageSenderEnum';
import { MESSAGE_TYPE } from '../../types/MessageTypeEnum';
import { useChatMessages } from '../ChatMessages/ChatMessages';
import { ChatMessageType } from '../../types/ChatMessageType';

export interface SendFileInfoProps {
  fileId: string;
  fileName: string;
  fileSize: number;
}

export interface SendFileChunkProps {
  fileId: string;
  fileChunkIndex: number;
  fileChunk: string;
}

export const useChat = () => {
  const { onFileInfoUploaded, onFileChunkUploaded } = useOnFileBufferReceived();
  const { chatMessages, sendChatMessage } = useChatMessages();

  const {
    mode,
    isConnected,
    localConnectionDescription,
    startAsHost,
    startAsSlave,
    setRemoteConnectionDescription,
    sendMessage,
  } = usePeerConnection<ChatMessageType>();

  const sendTextChatMessage = useCallback(
    (messageText: string) => {
      const message: MessageTextType = {
        id: shortid.generate(),
        sender: MESSAGE_SENDER.STRANGER,
        type: MESSAGE_TYPE.TEXT,
        timestamp: +new Date(),
        payload: messageText,
      };

      sendMessage(message);
      sendChatMessage({
        id: message.id,
        sender: MESSAGE_SENDER.ME,
        timestamp: message.timestamp,
        text: message.payload,
      });
    },
    [sendMessage, sendChatMessage],
  );

  const sendFileInfo = useCallback(
    ({ fileId, fileName, fileSize }: SendFileInfoProps) => {
      const message: MessageFileInfoType = {
        id: shortid.generate(),
        sender: MESSAGE_SENDER.STRANGER,
        type: MESSAGE_TYPE.FILE_INFO,
        timestamp: +new Date(),
        payload: {
          fileId,
          fileName,
          fileSize,
        },
      };

      sendMessage(message);
      onFileInfoUploaded(message.payload);
      sendChatMessage({
        id: message.id,
        sender: MESSAGE_SENDER.ME,
        timestamp: message.timestamp,
        fileId,
      });
    },
    [sendMessage, onFileInfoUploaded, sendChatMessage],
  );

  const sendFileChunk = useCallback(
    ({ fileId, fileChunkIndex, fileChunk }: SendFileChunkProps) => {
      const message: MessageFileChunkType = {
        id: shortid.generate(),
        sender: MESSAGE_SENDER.STRANGER,
        type: MESSAGE_TYPE.FILE_CHUNK,
        timestamp: +new Date(),
        payload: {
          fileId,
          fileChunkIndex,
          fileChunk,
        },
      };

      sendMessage(message);
      onFileChunkUploaded(message.payload);
    },
    [sendMessage, onFileChunkUploaded],
  );

  return {
    mode,
    isConnected,
    localConnectionDescription,
    chatMessages,
    startAsHost,
    startAsSlave,
    setRemoteConnectionDescription,
    sendTextChatMessage,
    sendFileInfo,
    sendFileChunk,
  };
};

// This hook should be used only in one place since it's connecting Chat to PeerConnection
export const useChatPeerConnectionSubscription = () => {
  const { onFileInfoReceived, onFileChunkReceived } = useOnFileBufferReceived();
  const { sendChatMessage } = useChatMessages();

  const onMessageReceived = useCallback(
    (message: MessageType) => {
      if (message.type === MESSAGE_TYPE.TEXT) {
        sendChatMessage({
          id: message.id,
          sender: MESSAGE_SENDER.STRANGER,
          timestamp: message.timestamp,
          text: message.payload,
        });
      } else if (message.type === MESSAGE_TYPE.FILE_INFO) {
        onFileInfoReceived(message.payload);
        sendChatMessage({
          id: message.id,
          sender: MESSAGE_SENDER.STRANGER,
          timestamp: message.timestamp,
          fileId: message.payload.fileId,
        });
      } else if (message.type === MESSAGE_TYPE.FILE_CHUNK) {
        onFileChunkReceived(message.payload);
      }
    },
    [sendChatMessage, onFileInfoReceived, onFileChunkReceived],
  );

  usePeerConnectionSubscription(onMessageReceived);
};
