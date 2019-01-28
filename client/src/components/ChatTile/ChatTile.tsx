import React from 'react';
import moment from 'moment';
import {Query} from 'react-apollo';
import {Card} from '@blueprintjs/core';
import gql from 'graphql-tag';

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
    <Query query={GET_USER_INFO} variables={{therapistId: chat.therapistId, clientId: chat.clientId}}>
      {({data, loading, error}) => {
        if (loading) return <p>{'Loading...'}</p>;
        if (error) return <p>{error.message}</p>;

        return (
          <Card interactive onClick={undefined} className={s.component}>
            <div>Chat</div>
            <div>Client: {data.client ? data.client.name : 'No client found'}</div>
            <div>Therapist: {data.therapist ? data.therapist.name : 'No therapist found'}</div>
            <div>Created: {moment(chat.createdAt).fromNow()}</div>
          </Card>
        );
      }}
    </Query>
  );
};

const GET_USER_INFO = gql`
  query GetUserInfo($therapistId: ID!, $clientId: ID!) {
    therapist: userInfo(id: $therapistId) {
      name
    }
    client: userInfo(id: $clientId) {
      name
    }
  }
`;

export default ChatTile;
