import React from 'react';
import s from './Chat.module.scss';

interface IChatProps {}

const Chat: React.SFC<IChatProps> = () => {
  return <div className={s.chat}>{'Hello World'}</div>;
};

export default Chat;
