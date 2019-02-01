import {Card} from '@blueprintjs/core';
import moment from 'moment';
import React from 'react';
import {AllChats_me_chats_chats} from '../Home/types/AllChats';
import s from './ChatTile.module.scss';

interface IChatTileProps {
  chat: AllChats_me_chats_chats;
  onClick: () => any;
}

const ChatTile: React.SFC<IChatTileProps> = ({chat, onClick}) => {
  return (
    <Card interactive onClick={onClick} className={s.component}>
      <div>Chat</div>
      <div>Client: {/* chat.client.name */ ''}</div>
      <div>Therapist: {/* chat.therapist.name */ ''}</div>
      <div>Created: {moment(chat.createdAt).fromNow()}</div>
    </Card>
  );
};

export default ChatTile;
