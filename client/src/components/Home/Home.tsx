import {Button, Card} from '@blueprintjs/core';
import gql from 'graphql-tag';
import {History} from 'history';
import React from 'react';
import {Query} from 'react-apollo';
import ChatTile from '../ChatTile/ChatTile';
import ErrorState from '../ErrorState/ErrorState';
import Loading from '../Loading/Loading';
import s from './Home.module.scss';
import {AllChats, AllChatsVariables} from './types/AllChats';

export const GET_CHATS = gql`
  query AllChats($after: String) {
    me {
      id
      chatPage(pageSize: 1, after: $after) {
        cursor
        hasMore
        chats {
          id
          createdAt
          client {
            id
            name
          }
          therapist {
            id
            name
          }
        }
      }
    }
  }
`;

interface IHomeProps {
  history: History<any>;
}

const Home: React.SFC<IHomeProps> = ({history}) => {
  // useEffect(() => {

  // }, [history])

  const mergeResults = (prev: AllChats, fetched: AllChats) => ({
    ...fetched,
    me: {
      ...fetched.me!,
      chats: {
        ...fetched.me!.chatPage,
        chats: [...prev.me!.chatPage.chats, ...fetched.me!.chatPage.chats],
      },
    },
  });

  return (
    <Query<AllChats, AllChatsVariables> query={GET_CHATS}>
      {({data, loading, error, fetchMore}) => {
        if (loading) return <Loading />;
        if (error) return <ErrorState error={error} />;

        const hasChats: boolean = !!(
          data &&
          data.me &&
          data.me.chatPage.chats.length
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
              data!.me!.chatPage.chats.map(chat => (
                <ChatTile
                  key={chat.id}
                  chat={chat}
                  onClick={() => history.push(`/chat/${chat.id}`)}
                />
              ))}
            {hasChats && data!.me!.chatPage.hasMore ? (
              <Button
                onClick={() => {
                  fetchMore({
                    variables: {after: data!.me!.chatPage.cursor},
                    updateQuery: (prev, {fetchMoreResult}) => {
                      if (!fetchMoreResult) return prev;
                      return mergeResults(prev, fetchMoreResult);
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
