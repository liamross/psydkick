import ApolloClient from 'apollo-client';
import React, {useEffect, useState} from 'react';
import {Route, RouteComponentProps, Switch, withRouter} from 'react-router';
import Chat from '../Chat/Chat';
import Home from '../Home/Home';

interface IAuthCheckProps extends RouteComponentProps {
  client: ApolloClient<any>;
}

const AuthCheck: React.SFC<IAuthCheckProps> = ({client, history}) => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) client.writeData({data: {isLoggedIn: false}});
  }, [history.location.pathname]);

  return (
    <Switch>
      <Route path={`/chat/:chatId?`} component={Chat} />
      <Route component={Home} />
    </Switch>
  );
};

export default withRouter(AuthCheck);
