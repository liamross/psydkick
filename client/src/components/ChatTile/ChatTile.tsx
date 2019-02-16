import {Card} from '@blueprintjs/core';
import moment from 'moment';
import React from 'react';
import {
  AllChats_me_chatPage_chats,
  AllChats_me_chatPage_chats_messagePage_messages,
} from '../Home/types/AllChats';
import s from './ChatTile.module.scss';

interface ChatTileProps {
  chat: AllChats_me_chatPage_chats;
  onClick: () => any;
  messages: AllChats_me_chatPage_chats_messagePage_messages[];
}

const ChatTile: React.SFC<ChatTileProps> = ({chat, onClick, messages}) => {
  return (
    <Card interactive onClick={onClick} className={s.component}>
      <div>Client: {chat.client.name}</div>
      <div>Therapist: {chat.therapist.name}</div>
      <div>Created: {moment(chat.createdAt).fromNow()}</div>
      <div>Preview: {messages.length ? messages[0].content : null}</div>
    </Card>
  );
};

export default ChatTile;
