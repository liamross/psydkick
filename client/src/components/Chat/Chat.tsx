import gql from 'graphql-tag';
import React, {useState} from 'react';
import {RouteComponentProps} from 'react-router';
import ChatInput from '../ChatInput/ChatInput';
import s from './Chat.module.scss';
import {Mutation} from 'react-apollo';

const SEND_MESSAGE = gql`
  mutation SendMessage($chatId: ID, $recipientId: ID, $content: String!) {
    sendMessage(chatId: $chatId, recipientId: $recipientId, content: $content) {
      chatId
      content
      createdAt
      id
      senderId
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

  return (
    <Mutation
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
        if (loading) return <p>{'Loading...'}</p>;
        if (error) return <p>{error.message}</p>;

        const handleSubmit = () => {
          sendMessage({variables: {chatId, recipientId, content: message}});
          setMessage('');
        };

        return (
          <div className={s.component}>
            <div className={s.messages}>{''}</div>
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

export default Chat;
