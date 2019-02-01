import {Card} from '@blueprintjs/core';
import gql from 'graphql-tag';
import moment from 'moment';
import React from 'react';
import {Query} from 'react-apollo';
import {AllChats_me_chats_chats} from '../Home/types/AllChats';
import s from './ChatTile.module.scss';
import {GetUserInfo, GetUserInfoVariables} from './types/GetUserInfo';

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

interface IChatTileProps {
  chat: AllChats_me_chats_chats;
  onClick: () => any;
}

const ChatTile: React.SFC<IChatTileProps> = ({chat, onClick}) => {
  return (
    <Query<GetUserInfo, GetUserInfoVariables>
      query={GET_USER_INFO}
      variables={{therapistId: chat.therapistId, clientId: chat.clientId}}>
      {({data, loading, error}) => {
        if (loading) return <p>{'Loading...'}</p>;
        if (error) return <p>{error.message}</p>;
        if (!data) return <p>{'Error fetching data.'}</p>;

        return (
          <Card interactive onClick={onClick} className={s.component}>
            <div>Chat</div>
            <div>
              Client: {data.client ? data.client.name : 'No client found'}
            </div>
            <div>
              Therapist:{' '}
              {data.therapist ? data.therapist.name : 'No therapist found'}
            </div>
            <div>Created: {moment(chat.createdAt).fromNow()}</div>
          </Card>
        );
      }}
    </Query>
  );
};

export default ChatTile;
