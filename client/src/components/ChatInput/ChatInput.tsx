import {Button, EditableText, IEditableTextProps} from '@blueprintjs/core';
import classNames from 'classnames';
import React from 'react';
import s from './ChatInput.module.scss';

interface ChatInputProps extends IEditableTextProps {
  value: string;
  onChange: (newValue: string) => any;
  onSubmit: () => any;
}

const ChatInput: React.SFC<ChatInputProps> = ({
  value,
  onChange,
  onSubmit,
  className,
  disabled,
  ...editableTextProps
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      onSubmit();
    }
  };

  return (
    <>
      <div className={s.component} onKeyDown={handleKeyDown}>
        <EditableText
          {...editableTextProps}
          disabled={disabled}
          className={classNames(s.input, className)}
          maxLines={4}
          minLines={1}
          multiline={true}
          placeholder="Send message"
          confirmOnEnterKey
          value={value}
          onChange={onChange}
          // onConfirm={onSubmit} // TODO: Need to just detect enter message
        />
        <Button
          disabled={disabled}
          className={s.button}
          onClick={onSubmit}
          minimal
          icon="arrow-right"
        />
      </div>
    </>
  );
};

export default ChatInput;
