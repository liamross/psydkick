import {Button, FormGroup, InputGroup, Intent} from '@blueprintjs/core';
import gql from 'graphql-tag';
import {History} from 'history';
import React, {useEffect, useState} from 'react';
import {ApolloConsumer, Mutation} from 'react-apollo';
import ErrorState from '../ErrorState/ErrorState';
import s from './Auth.module.scss';

const LOGIN_ACCOUNT = gql`
  mutation LoginAccount($name: String!, $password: String!) {
    login(name: $name, password: $password)
  }
`;

const CREATE_ACCOUNT = gql`
  mutation CreateAccount($name: String!, $password: String!) {
    createAccount(name: $name, password: $password)
  }
`;

interface IAuthProps {
  redirect?: string;
  history: History<any>;
}

const Auth: React.SFC<IAuthProps> = ({redirect, history}) => {
  const isLogin = history.location.pathname === '/login';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [invalid, setInvalid] = useState(false);
  useEffect(() => {
    setInvalid(false);
  }, [username]);
  useEffect(() => {
    if (isLogin) setInvalid(false);
  }, [password]);
  useEffect(() => {
    setInvalid(false);
  }, [isLogin]);

  useEffect(() => {
    if (isLogin) document.title = 'Log in - Psydkick';
    if (!isLogin) document.title = 'Sign up - Psydkick';
  }, [isLogin]);

  const helperText = isLogin
    ? 'Incorrect username or password'
    : 'Username is taken';
  const route = isLogin ? '/signup' : '/login';
  const routeButton = isLogin
    ? 'Create a new account'
    : 'Login as existing user';
  const actionButton = isLogin ? 'Log in' : 'Sign up';

  return (
    <ApolloConsumer>
      {client => (
        <Mutation
          mutation={isLogin ? LOGIN_ACCOUNT : CREATE_ACCOUNT}
          onCompleted={({
            login,
            createAccount,
          }: {
            login?: string | null;
            createAccount?: string | null;
          }) => {
            const token = isLogin ? login : createAccount;
            if (token) {
              localStorage.setItem('token', token);
              client.writeData({data: {isLoggedIn: true}});
              if (redirect) {
                history.replace(redirect);
              } else {
                history.replace('/');
              }
            } else {
              setInvalid(true);
            }
          }}>
          {(login, {loading, error}) => {
            if (error) return <ErrorState error={error} />;

            return (
              <div className={s.component}>
                <div className={s.container}>
                  <FormGroup
                    helperText={invalid ? helperText : undefined}
                    intent={invalid && isLogin ? Intent.DANGER : undefined}
                    label={'Username'}
                    labelFor={'auth-username'}
                    labelInfo={'*'}>
                    <InputGroup
                      id={'auth-username'}
                      placeholder={'Enter username'}
                      intent={invalid ? Intent.DANGER : undefined}
                      value={username}
                      autoComplete="off" // Stop autocomplete from covering helper text.
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setUsername(e.target.value)
                      }
                    />
                  </FormGroup>
                  <FormGroup
                    intent={invalid ? Intent.DANGER : undefined}
                    label={'Password'}
                    labelFor={'auth-password'}
                    labelInfo={'*'}>
                    <InputGroup
                      type="password"
                      id={'auth-password'}
                      placeholder={'Enter password'}
                      intent={invalid ? Intent.DANGER : undefined}
                      value={password}
                      autoComplete="off" // Stop autocomplete from covering helper text.
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)
                      }
                    />
                  </FormGroup>
                  <div className={s.buttonFlex}>
                    <Button minimal onClick={() => history.replace(route)}>
                      {routeButton}
                    </Button>
                    <Button
                      disabled={loading || !username || !password || invalid}
                      onClick={() =>
                        login({variables: {name: username, password}})
                      }>
                      {actionButton}
                    </Button>
                  </div>
                </div>
              </div>
            );
          }}
        </Mutation>
      )}
    </ApolloConsumer>
  );
};

export default Auth;
