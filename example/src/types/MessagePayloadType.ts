export type MessagePayloadFileInfoType = {
  fileId: string;
  fileName: string;
  fileSize: number;
};
export type MessagePayloadFileChunkType = {
  fileId: string;
  fileChunkIndex: number;
  fileChunk: string;
};
export type MessagePayloadTextType = string;

export type MessagePayloadType = MessagePayloadTextType | MessagePayloadFileInfoType | MessagePayloadFileChunkType;
