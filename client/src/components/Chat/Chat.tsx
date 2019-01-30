import React, {useState} from 'react';
import ChatInput from '../ChatInput/ChatInput';
import s from './Chat.module.scss';

interface IChatProps {}

const Chat: React.SFC<IChatProps> = () => {
  const [message, setMessage] = useState('');

  console.log(message);

  return (
    <div className={s.component}>
      <div className={s.messages}>{''}</div>
      <div className={s.input}>
        <ChatInput
          value={message}
          onType={setMessage}
          onSubmit={() => setMessage('')}
        />
      </div>
    </div>
  );
};

export default Chat;
