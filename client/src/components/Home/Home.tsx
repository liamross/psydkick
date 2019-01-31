import {Button, Card} from '@blueprintjs/core';
import gql from 'graphql-tag';
import React from 'react';
import {Query} from 'react-apollo';
import ChatTile from '../ChatTile/ChatTile';
import s from './Home.module.scss';
import {AllChats, AllChatsVariables} from './types/AllChats';
import {History} from 'history';

export const GET_CHATS = gql`
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

interface IHomeProps {
  history: History<any>;
}

const Home: React.SFC<IHomeProps> = ({history}) => {
  return (
    <Query<AllChats, AllChatsVariables> query={GET_CHATS}>
      {({data, loading, error, fetchMore}) => {
        if (loading) return <p>{'Loading...'}</p>;
        if (error) return <p>{error.message}</p>;

        const hasChats: boolean = !!(
          data &&
          data.me &&
          data.me.chats.chats.length
        );

        return (
          <div className={s.component}>
            <Card
              interactive
              onClick={() => history.push('/chat')}
              className={s.new}>
              <div>Create a new chat</div>
            </Card>
            {hasChats &&
              data!.me!.chats.chats.map(({id, ...chat}) => (
                <ChatTile key={id} chat={chat} />
              ))}
            {hasChats && data!.me!.chats.hasMore ? (
              <Button
                onClick={() => {
                  fetchMore({
                    variables: {after: data!.me!.chats.cursor},
                    updateQuery: (prev, {fetchMoreResult}) => {
                      if (!fetchMoreResult) return prev;
                      return {
                        ...fetchMoreResult,
                        me: {
                          ...fetchMoreResult.me!,
                          chats: {
                            ...fetchMoreResult.me!.chats,
                            chats: [
                              ...prev.me!.chats.chats,
                              ...fetchMoreResult.me!.chats.chats,
                            ],
                          },
                        },
                      };
                    },
                  });
                }}>
                Load More
              </Button>
            ) : null}
          </div>
        );
      }}
    </Query>
  );
};

export default Home;
