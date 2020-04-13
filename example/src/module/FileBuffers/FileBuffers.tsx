import React, { createContext, FC, useContext, useState, useEffect, useCallback } from 'react';
import { Subject } from 'rxjs';
import { MessagePayloadFileChunkType, MessagePayloadFileInfoType } from '../../types/MessagePayloadType';
import { stringToArrayBuffer } from '../../util/arrayBufferConverter';

export type FILE_BUFFER_MODES = 'downloading' | 'uploading';

export type FileBuffer = {
  fileId: string;
  fileName: string;
  fileSize: number;
  mode: FILE_BUFFER_MODES;
  receivedSize: number;
  receivedBuffer: ArrayBuffer[];
  receivedBlob?: Blob;
  receivedBlobUrl?: string;
};
export type FileBuffersType = { [index: string]: FileBuffer };

const fileBuffers: FileBuffersType = {};

export type FileBuffersUpdate = {
  fileId: string;
};

const fileBuffersUpdates = new Subject<FileBuffersUpdate>();

type FileBuffersContextType = { fileBuffersUpdates: typeof fileBuffersUpdates };

const contextValue = { fileBuffersUpdates };

const FileBuffersContext = createContext<FileBuffersContextType>(contextValue);

export const FileBuffersProvider: FC = ({ children }) => {
  return <FileBuffersContext.Provider value={contextValue}>{children}</FileBuffersContext.Provider>;
};

export const useOnFileBufferReceived = () => {
  const { fileBuffersUpdates } = useContext(FileBuffersContext);

  const onFileInfoUploaded = useCallback(
    ({ fileId, fileSize, fileName }: MessagePayloadFileInfoType) => {
      const file = fileBuffers[fileId];

      if (!file) {
        fileBuffers[fileId] = {
          fileId,
          fileName,
          fileSize,
          mode: 'uploading',
          receivedSize: 0,
          receivedBuffer: [],
        };
      } else {
        file.fileName = fileName;
        file.fileSize = fileSize;
      }

      fileBuffersUpdates.next({ fileId });
    },
    [fileBuffersUpdates],
  );

  const onFileChunkUploaded = useCallback(
    ({ fileId, fileChunk }: MessagePayloadFileChunkType) => {
      let file = fileBuffers[fileId];

      if (!file) {
        fileBuffers[fileId] = {
          fileId,
          fileName: '',
          fileSize: -1,
          mode: 'uploading',
          receivedSize: 0,
          receivedBuffer: [],
        };

        file = fileBuffers[fileId];
      }

      const arrayBuffer = stringToArrayBuffer(fileChunk);
      file.receivedSize += arrayBuffer.byteLength;

      fileBuffersUpdates.next({ fileId });
    },
    [fileBuffersUpdates],
  );

  const onFileInfoReceived = useCallback(
    ({ fileId, fileSize, fileName }: MessagePayloadFileInfoType) => {
      const file = fileBuffers[fileId];

      if (!file) {
        fileBuffers[fileId] = {
          fileId,
          fileName,
          fileSize,
          mode: 'downloading',
          receivedSize: 0,
          receivedBuffer: [],
        };
      } else {
        file.fileName = fileName;
        file.fileSize = fileSize;
      }

      fileBuffersUpdates.next({ fileId });
    },
    [fileBuffersUpdates],
  );

  const onFileChunkReceived = useCallback(
    ({ fileId, fileChunkIndex, fileChunk }: MessagePayloadFileChunkType) => {
      let file = fileBuffers[fileId];

      if (!file) {
        fileBuffers[fileId] = {
          fileId,
          fileName: '',
          fileSize: -1,
          mode: 'downloading',
          receivedSize: 0,
          receivedBuffer: [],
        };

        file = fileBuffers[fileId];
      }

      const arrayBuffer = stringToArrayBuffer(fileChunk);
      file.receivedBuffer[fileChunkIndex] = arrayBuffer;
      file.receivedSize += arrayBuffer.byteLength;

      if (file.receivedSize === file.fileSize) {
        file.receivedBlob = new Blob(file.receivedBuffer);
        file.receivedBuffer = [];
        file.receivedBlobUrl = URL.createObjectURL(file.receivedBlob);
      }

      fileBuffersUpdates.next({ fileId });
    },
    [fileBuffersUpdates],
  );

  return { onFileInfoUploaded, onFileChunkUploaded, onFileInfoReceived, onFileChunkReceived };
};

export const useFileBuffer = (fileId: string) => {
  const { fileBuffersUpdates } = useContext(FileBuffersContext);

  const [fileName, setFileName] = useState<FileBuffer['fileName'] | undefined>(undefined);
  const [fileSize, setFileSize] = useState<FileBuffer['fileSize'] | undefined>(undefined);
  const [mode, setMode] = useState<FileBuffer['mode'] | undefined>(undefined);
  const [receivedSize, setReceivedSize] = useState<FileBuffer['receivedSize']>(0);
  const [receivedBlobUrl, setReceivedBlobUrl] = useState<FileBuffer['receivedBlobUrl'] | undefined>(undefined);

  useEffect(() => {
    const subscription = fileBuffersUpdates.subscribe((fileBufferUpdate) => {
      if (fileBufferUpdate.fileId === fileId) {
        const fileBuffer = fileBuffers[fileId] as FileBuffer | undefined;

        if (!fileBuffer) return;

        setFileName(fileBuffer.fileName);
        setFileSize(fileBuffer.fileSize);
        setMode(fileBuffer.mode);
        setReceivedSize(fileBuffer.receivedSize);
        setReceivedBlobUrl(fileBuffer.receivedBlobUrl);
      }
    });

    return () => subscription.unsubscribe();
  }, [fileBuffersUpdates, fileId]);

  return { fileName, fileSize, mode, receivedSize, receivedBlobUrl };
};
