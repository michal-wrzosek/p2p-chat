import React, { useState, useCallback, createContext, FC, useContext, useEffect } from 'react';
import { ReplaySubject } from 'rxjs';

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

const chatMessagesSubject = new ReplaySubject<ChatMessageType>();

const ChatMessagesContext = createContext(chatMessagesSubject);

export const ChatMessagesProvider: FC = ({ children }) => {
  return <ChatMessagesContext.Provider value={chatMessagesSubject}>{children}</ChatMessagesContext.Provider>;
};

export const useChatMessages = () => {
  const chatMessagesSubject = useContext(ChatMessagesContext);
  const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([]);

  useEffect(() => {
    const subscription = chatMessagesSubject.subscribe((chatMessage) => {
      setChatMessages((chatMessages) => [...chatMessages, chatMessage]);
    });

    return () => subscription.unsubscribe();
  }, [chatMessagesSubject, setChatMessages]);

  const sendChatMessage = useCallback(
    (chatMessage: ChatMessageType) => {
      chatMessagesSubject.next(chatMessage);
    },
    [chatMessagesSubject],
  );

  return { chatMessages, sendChatMessage };
};
