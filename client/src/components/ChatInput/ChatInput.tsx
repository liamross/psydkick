import React, {memo, useEffect} from 'react';
import useEventListener from '../../hooks/useEventListener';
import s from './ChatInput.module.scss';

interface IChatInputProps {
  value: string;
  onType: (newValue: string) => any;
  onSubmit?: () => any;
}

const CHAT_ID = 'chat-input-id';

const ChatInput = React.forwardRef<undefined, IChatInputProps>(
  ({value, onType, onSubmit}, ref) => {
    useEffect(() => {
      const chatElement = document.getElementById(CHAT_ID);
      if (chatElement) chatElement.innerText = value;
    }, [value]);

    // Listen for inputs, call onType with text content.
    const onChangeListener = () => {
      const chatElement = document.getElementById(CHAT_ID);
      if (chatElement) onType(chatElement.innerText || '');
    };
    useEventListener(CHAT_ID, 'input', onChangeListener);

    // Listen for `Enter` keypress without shift to fire onSubmit.
    const onKeyPressListener = (event: KeyboardEvent) => {
      if (onSubmit && event.keyCode === 13 && !event.shiftKey) onSubmit();
    };
    useEventListener(CHAT_ID, 'keypress', onKeyPressListener);

    return <div contentEditable id={CHAT_ID} className={s.component} />;
  },
);

export default memo(ChatInput);
