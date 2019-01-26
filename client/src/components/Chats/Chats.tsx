import React from 'react';

import s from './Chats.module.scss';

interface IChatsProps {}

const Chats: React.SFC<IChatsProps> = () => {
  return <div className={s.chats}>{'Hello World'}</div>;
}

export default Chats;
