import {Card} from '@blueprintjs/core';
import gql from 'graphql-tag';
import moment from 'moment';
import React from 'react';
import {ChildDataProps, graphql} from 'react-apollo';
import s from './ChatTile.module.scss';
import {GetUserInfo, GetUserInfoVariables} from './types/GetUserInfo';

export interface IChatTileInformation {
  createdAt: string;
  clientId: string;
  therapistId: string;
}

interface IChatTileProps {
  chat: IChatTileInformation;
}

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

type ChildProps = ChildDataProps<IChatTileProps, GetUserInfo, GetUserInfoVariables>;
const withGraph = graphql<IChatTileProps, GetUserInfo, GetUserInfoVariables, ChildProps>(GET_USER_INFO, {
  options: ({chat: {clientId, therapistId}}) => ({
    variables: {clientId, therapistId},
  }),
});

const ChatTile = withGraph(({chat, data: {loading, error, client, therapist}}) => {
  if (loading) return <p>{'Loading...'}</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <Card interactive onClick={undefined} className={s.component}>
      <div>Chat</div>
      <div>Client: {client ? client.name : 'No client found'}</div>
      <div>Therapist: {therapist ? therapist.name : 'No therapist found'}</div>
      <div>Created: {moment(chat.createdAt).fromNow()}</div>
    </Card>
  );
});

export default ChatTile;
