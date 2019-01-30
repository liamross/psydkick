import React, {useState, useRef} from 'react';
import ChatInput from '../ChatInput/ChatInput';
import s from './Chat.module.scss';

interface IChatProps {}

const Chat: React.SFC<IChatProps> = () => {
  const inputEl = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    // TODO: Something with message.
    const chatRef = inputEl.current;
    if (chatRef) chatRef.innerText = '';
  };

  return (
    <div className={s.component}>
      <div className={s.messages}>{''}</div>
      <div className={s.input}>
        <ChatInput ref={inputEl} onType={setMessage} onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default Chat;
