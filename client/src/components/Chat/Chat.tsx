import React, {useState} from 'react';
import ChatInput from '../ChatInput/ChatInput';
import s from './Chat.module.scss';

interface IChatProps {}

const Chat: React.SFC<IChatProps> = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    // TODO: Something with message.
    console.log('Submit: ', message);
    setMessage('');
  };

  return (
    <div className={s.component}>
      <div className={s.messages}>{''}</div>
      <div className={s.input}>
        <ChatInput
          value={message}
          onChange={setMessage}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Chat;
