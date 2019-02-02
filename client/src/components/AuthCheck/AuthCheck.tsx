import ApolloClient from 'apollo-client';
import React from 'react';
import {Route, Switch} from 'react-router';
import Chat from '../Chat/Chat';
import Home from '../Home/Home';

interface IAuthCheckProps {
  client: ApolloClient<any>;
}

const AuthCheck: React.SFC<IAuthCheckProps> = ({client}) => {
  const token = localStorage.getItem('token');
  if (!token) client.writeData({data: {isLoggedIn: false}});

  return (
    <Switch>
      <Route path={`/chat/:chatId?`} component={Chat} />
      <Route component={Home} />
    </Switch>
  );
};

export default AuthCheck;
