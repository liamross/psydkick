import {History} from 'history';
import React, {useEffect, useState} from 'react';
import {Route, Switch} from 'react-router';
import Chat from '../Chat/Chat';
import ErrorState from '../ErrorState/ErrorState';
import Home from '../Home/Home';

interface IAuthCheckProps {
  history: History<any>;
}

const AuthCheck: React.SFC<IAuthCheckProps> = ({history}) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, [history.location.pathname]);

  if (!token) {
    return <ErrorState />;
  }

  return (
    <Switch>
      <Route path={`/chat/:chatId?`} component={Chat} />
      <Route component={Home} />
    </Switch>
  );
};

export default AuthCheck;
