import {Card} from '@blueprintjs/core';
import gql from 'graphql-tag';
import React, {useState} from 'react';
import {Mutation, Query} from 'react-apollo';
import {RouteComponentProps} from 'react-router';
import ChatInput from '../ChatInput/ChatInput';
import ErrorState from '../ErrorState/ErrorState';
import {GET_CHATS} from '../Home/Home';
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
      id
      chat(id: $chatId) {
        id
        createdAt
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
            content
            sender {
              id
            }
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

const Chat: React.SFC<IChatProps> = ({match, history}) => {
  const [message, setMessage] = useState('');

  const chatId: string | undefined = match.params.chatId;
  // TODO: Unmock and select recipient eventually.
  const recipientId: string | undefined = chatId ? undefined : '0';

  const renderMutation = (chat?: GetChatMessages_me_chat | null) => {
    return (
      <Mutation<SendMessage, SendMessageVariables>
        mutation={SEND_MESSAGE}
        refetchQueries={() => {
          // If chat exists, refetch get messages to populate message in chat.
          if (chatId) {
            setMessage('');
            return [{query: GET_CHAT_MESSAGES, variables: {chatId}}];
          }
          // If new chat is being made, refetch get chats to populate home.
          return [{query: GET_CHATS}];
        }}
        onCompleted={({sendMessage}) => {
          if (!chatId) {
            setMessage('');
            history.replace(`/chat/${sendMessage.chatId}`);
          }
        }}>
        {(sendMessage, {loading, error}) => {
          // TODO:
          // 1. loading: show sending message
          // 2. error: show 'message not sent, retry?'

          const handleSubmit = () => {
            sendMessage({variables: {chatId, recipientId, content: message}});
          };

          return (
            <div className={s.component}>
              <div className={s.messages}>
                {chat
                  ? chat.messagePage.messages
                      .map(existingMessage => (
                        <Card key={existingMessage.id} className={s.message}>
                          <div>{existingMessage.content}</div>
                        </Card>
                      ))
                      .reverse()
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

        return renderMutation(data!.me.chat);
      }}
    </Query>
  );
};

export default Chat;
