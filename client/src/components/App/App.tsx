import React, {memo} from 'react';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import {Button} from '@blueprintjs/core';
import s from './App.module.scss';

const GET_CHATS = gql`
  query AllChats($after: String) {
    me {
      chats(pageSize: 1, after: $after) {
        cursor
        hasMore
        chats {
          id
          createdAt
          # Add more...
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
          <div>
            <div>Cursor: {data.me.chats.cursor}</div>
            {data.me.chats.chats.map(({id, createdAt}: {id: string; createdAt: string}) => (
              <div key={id}>{`[id=${id}; createdAt=${new Date(Number(createdAt)).toString()}]`}</div>
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
