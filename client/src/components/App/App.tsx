import React, {memo} from 'react';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import {Button} from '@blueprintjs/core';
import s from './App.module.scss';
import ChatTile, {IChatTileInformation} from '../ChatTile/ChatTile';

const GET_CHATS = gql`
  query AllChats($after: String) {
    me {
      chats(pageSize: 10, after: $after) {
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

function App() {
  return (
    <Query query={GET_CHATS}>
      {({data, loading, error, fetchMore}) => {
        if (loading) return <p>{'Loading...'}</p>;
        if (error) return <p>{error.message}</p>;
        if (!(data.me && data.me.chats && data.me.chats.chats)) return 'No chats.';

        return (
          <div className={s.component}>
            {data.me.chats.chats.map(({id, ...chat}: IChatTileInformation & {id: string}) => (
              <ChatTile key={id} chat={chat} />
            ))}
            {data.me.chats && data.me.chats.hasMore && (
              <Button
                onClick={() =>
                  fetchMore({
                    variables: {
                      after: data.me.chats.cursor,
                    },
                    updateQuery: (prev, {fetchMoreResult}) => {
                      if (!fetchMoreResult) return prev;
                      return {
                        ...fetchMoreResult,
                        me: {
                          ...fetchMoreResult.me,
                          chats: {
                            ...fetchMoreResult.me.chats,
                            chats: [...prev.me.chats.chats, ...fetchMoreResult.me.chats.chats],
                          },
                        },
                      };
                    },
                  })
                }>
                Load More
              </Button>
            )}
          </div>
        );
      }}
    </Query>
  );
}

export default memo(App);
