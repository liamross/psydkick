import {Button} from '@blueprintjs/core';
import React, {memo} from 'react';
import useEventListener from '../../hooks/useEventListener';
import s from './ChatInput.module.scss';

interface IChatInputProps {
  onType: (newValue: string) => any;
  onSubmit?: () => any;
}

const CHAT_ID = 'chat-input-id';

const ChatInput = React.forwardRef<HTMLDivElement, IChatInputProps>(
  ({onType, onSubmit}, ref) => {
    // Listen for inputs, call onType with text content.
    const onChangeListener = () => {
      const chatElement = document.getElementById(CHAT_ID);
      if (chatElement) onType(chatElement.innerText || '');
    };
    useEventListener(CHAT_ID, 'input', onChangeListener);

    // Listen for `Enter` keypress without shift to fire onSubmit.
    const onKeyPressListener = (event: KeyboardEvent) => {
      if (onSubmit && event.keyCode === 13 && !event.shiftKey) {
        event.preventDefault();
        // event.stopImmediatePropagation();
        onSubmit();
      }
    };
    useEventListener(CHAT_ID, 'keypress', onKeyPressListener);

    return (
      <>
        <div className={s.component}>
          <div ref={ref} contentEditable id={CHAT_ID} className={s.input} />
          <Button onClick={onSubmit} minimal icon="arrow-right" />
        </div>
      </>
    );
  },
);

export default memo(ChatInput);
