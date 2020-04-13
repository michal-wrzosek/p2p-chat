import React, { Fragment, useRef, FC, ChangeEventHandler, MouseEventHandler, memo, useCallback } from 'react';
import styled from 'styled-components';
import shortid from 'shortid';

import { Button } from '../Button/Button';
import { useChat } from '../../module/useChat/useChat';
import { arrayBufferToString } from '../../util/arrayBufferConverter';

export interface FileSharingProps {
  className?: string;
}

const Input = styled.input`
  display: none;
`;
const StyledButton = styled(Button)``;

export const FileSharing: FC<FileSharingProps> = memo(function FileSharing({ className }) {
  const { sendFileInfo, sendFileChunk } = useChat();
  const inputRef = useRef<HTMLInputElement>() as React.MutableRefObject<HTMLInputElement>;

  const handleButtonClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!inputRef.current) return;
      inputRef.current.click();
    },
    [inputRef],
  );

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const file = event.target.files?.[0];

      if (!file) return;

      const fileId = shortid.generate();
      const BYTES_PER_CHUNK = 1200;
      const fileReader = new FileReader();
      let currentChunk = 0;

      const readNextChunk = () => {
        const start = BYTES_PER_CHUNK * currentChunk;
        const end = Math.min(file.size, start + BYTES_PER_CHUNK);
        fileReader.readAsArrayBuffer(file.slice(start, end));
      };

      fileReader.onload = () => {
        if (!(fileReader.result instanceof ArrayBuffer)) return;

        sendFileChunk({ fileId, fileChunkIndex: currentChunk, fileChunk: arrayBufferToString(fileReader.result) });
        currentChunk++;

        if (BYTES_PER_CHUNK * currentChunk < file.size) {
          readNextChunk();
        }
      };

      sendFileInfo({
        fileId,
        fileName: file.name,
        fileSize: file.size,
      });

      readNextChunk();
    },
    [sendFileInfo, sendFileChunk],
  );

  return (
    <Fragment>
      <Input ref={inputRef} type="file" name="file" onChange={handleInputChange} />
      <StyledButton className={className} title="Upload" onClick={handleButtonClick}>
        <span role="img" aria-label="paperclip emoji">
          📎
        </span>
      </StyledButton>
    </Fragment>
  );
});
