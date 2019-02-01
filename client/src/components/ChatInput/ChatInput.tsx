import {Button, EditableText} from '@blueprintjs/core';
import React, {memo} from 'react';
import s from './ChatInput.module.scss';

interface IChatInputProps {
  value: string;
  onChange: (newValue: string) => any;
  onSubmit?: () => any;
}

const ChatInput: React.SFC<IChatInputProps> = ({value, onChange, onSubmit}) => {
  return (
    <>
      <div className={s.component}>
        <EditableText
          className={s.input}
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
          className={s.button}
          onClick={onSubmit}
          minimal
          icon="arrow-right"
        />
      </div>
    </>
  );
};

export default memo(ChatInput);
