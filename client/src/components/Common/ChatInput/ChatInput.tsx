import React, {useEffect, memo} from 'react';

import s from './ChatInput.module.scss';

interface IChatInputProps {
  onType: (newValue: string) => any;
}

const CHAT_ID = 'chat-input-id';

const ChatInput: React.SFC<IChatInputProps> = ({onType}) => {
  useEffect(() => {
    const chatElement = document.getElementById(CHAT_ID);
    const onChangeListener = () => {
      if (chatElement) {
        const content = chatElement.textContent!;
        onType(content);
      }
    };

    if (chatElement) chatElement.addEventListener('input', onChangeListener);

    return () => {
      if (chatElement) {
        chatElement.removeEventListener('input', onChangeListener);
      }
    };
  }, []);

  return <div contentEditable id={CHAT_ID} className={s.component} />;
};

export default memo(ChatInput);
