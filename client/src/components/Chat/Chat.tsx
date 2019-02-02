import {Card} from '@blueprintjs/core';
import gql from 'graphql-tag';
import React, {useState} from 'react';
import {Mutation, Query} from 'react-apollo';
import {RouteComponentProps} from 'react-router';
import ChatInput from '../ChatInput/ChatInput';
import ErrorState from '../ErrorState/ErrorState';
import Loading from '../Loading/Loading';
import s from './Chat.module.scss';
import {
  GetChatMessages,
  GetChatMessagesVariables,
  GetChatMessages_me_chat,
} from './types/GetChatMessages';
import {SendMessage, SendMessageVariables} from './types/SendMessage';

const GET_CHAT_MESSAGES = gql`
  query GetChatMessages($chatId: ID!, $after: String) {
    me {
      chat(id: $chatId) {
        id
        createdAt
        updatedAt
        client {
          id
        }
        therapist {
          id
        }
        messagePage(pageSize: 10, after: $after) {
          messages {
            id
            createdAt
            updatedAt
            content
            sender {
              id
            }
            chatId
          }
        }
      }
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($chatId: ID, $recipientId: ID, $content: String!) {
    sendMessage(chatId: $chatId, recipientId: $recipientId, content: $content) {
      chatId
      content
      createdAt
      id
      sender {
        id
        name
      }
      updatedAt
    }
  }
`;

interface IChatProps extends RouteComponentProps<{chatId?: string}, any, any> {}

const Chat: React.SFC<IChatProps> = ({match}) => {
  const [message, setMessage] = useState('');

  const chatId: string | undefined = match.params.chatId;
  // TODO: Unmock and select recipient eventually.
  const recipientId: string | undefined = chatId ? undefined : '0';

  const renderMutation = (chat?: GetChatMessages_me_chat | null) => {
    return (
      <Mutation<SendMessage, SendMessageVariables>
        mutation={SEND_MESSAGE}
        onCompleted={({sendMessage}) => {
          if (chatId) {
            // Push message to chat
          } else {
            // 1. Push chat to state
            // 2. Push message to chat
            // 3. Push chat ID to URL
          }
        }}>
        {(sendMessage, {loading, error}) => {
          if (loading) return <Loading />;
          if (error) return <ErrorState error={error} />;

          const handleSubmit = () => {
            sendMessage({variables: {chatId, recipientId, content: message}});
            setMessage('');
          };

          return (
            <div className={s.component}>
              <div className={s.messages}>
                {chat
                  ? chat.messagePage.messages.reverse().map(existingMessage => (
                      <Card key={existingMessage.id} className={s.message}>
                        <div>{existingMessage.content}</div>
                      </Card>
                    ))
                  : null}
              </div>
              <div className={s.input}>
                <ChatInput
                  value={message}
                  onChange={setMessage}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
          );
        }}
      </Mutation>
    );
  };

  if (!chatId) return renderMutation();

  return (
    <Query<GetChatMessages, GetChatMessagesVariables>
      query={GET_CHAT_MESSAGES}
      variables={{chatId}}>
      {({data, loading, error, fetchMore}) => {
        if (loading) return <Loading />;
        if (error) return <ErrorState error={error} />;

        if (!(data && data.me)) return; // TODO: sign out and maybe do this everywhere.

        return renderMutation(data.me.chat);
      }}
    </Query>
  );
};

export default Chat;
