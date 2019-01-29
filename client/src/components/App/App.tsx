import {Button} from '@blueprintjs/core';
import gql from 'graphql-tag';
import React, {memo} from 'react';
import {Query} from 'react-apollo';
import ChatTile, {IChatTileInformation} from '../ChatTile/ChatTile';
import s from './App.module.scss';
import {AllChats, AllChatsVariables} from './types/AllChats';

const GET_CHATS = gql`
  query AllChats($after: String) {
    me {
      chats(pageSize: 1, after: $after) {
        cursor
        hasMore
        chats {
          id
          createdAt
          clientId
          therapistId
        }
      }
    }
  }
`;

const App: React.SFC<{}> = () => {
  return (
    <Query<AllChats, AllChatsVariables> query={GET_CHATS}>
      {({data, loading, error, fetchMore}) => {
        if (loading) return <p>{'Loading...'}</p>;
        if (error) return <p>{error.message}</p>;
        if (!(data && data.me && data.me.chats && data.me.chats.chats)) return <p>{'No chats.'}</p>;

        const handleGetMore = () => {
          fetchMore({
            variables: {after: data.me!.chats.cursor},
            updateQuery: (prev, {fetchMoreResult}) => {
              if (!fetchMoreResult) return prev;
              return {
                ...fetchMoreResult,
                me: {
                  ...fetchMoreResult.me!,
                  chats: {
                    ...fetchMoreResult.me!.chats,
                    chats: [...prev.me!.chats.chats, ...fetchMoreResult.me!.chats.chats],
                  },
                },
              };
            },
          });
        };

        return (
          <div className={s.component}>
            {data.me.chats.chats.map(({id, ...chat}) => (
              <ChatTile key={id} chat={chat} />
            ))}
            {data.me.chats.hasMore ? <Button onClick={handleGetMore}>Load More</Button> : null}
          </div>
        );
      }}
    </Query>
  );
};

export default memo(App);
