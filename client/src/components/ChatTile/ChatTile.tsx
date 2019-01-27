import React from 'react';
import moment from 'moment';
import {Card} from '@blueprintjs/core';

import s from './ChatTile.module.scss';

export interface IChatTileInformation {
  createdAt: string;
  clientId: string;
  therapistId: string;
}

interface IChatTileProps {
  chat: IChatTileInformation;
}

const ChatTile: React.SFC<IChatTileProps> = ({chat}) => {
  return (
    <Card interactive onClick={() => console.log('click')} className={s.component}>
      <div>Chat</div>
      <div>Client: {chat.clientId}</div>
      <div>Therapist: {chat.therapistId}</div>
      <div>Created: {moment(chat.createdAt).fromNow()}</div>
    </Card>
  );
};

export default ChatTile;
