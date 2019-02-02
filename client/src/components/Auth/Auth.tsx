import {Button, FormGroup, InputGroup, Intent} from '@blueprintjs/core';
import gql from 'graphql-tag';
import {History} from 'history';
import React, {useEffect, useState} from 'react';
import {ApolloConsumer, Mutation} from 'react-apollo';
import ErrorState from '../ErrorState/ErrorState';
import s from './Auth.module.scss';

const LOGIN_ACCOUNT = gql`
  mutation LoginAccount($name: String!) {
    login(name: $name)
  }
`;

const CREATE_ACCOUNT = gql`
  mutation CreateAccount($name: String!) {
    createAccount(name: $name)
  }
`;

interface IAuthProps {
  redirect?: string;
  history: History<any>;
}

const Auth: React.SFC<IAuthProps> = ({redirect, history}) => {
  const isLogin = history.location.pathname === '/login';

  const [username, setUsername] = useState('');
  const [invalid, setInvalid] = useState(false);
  useEffect(() => {
    setInvalid(false);
  }, [username, isLogin]);

  useEffect(() => {
    if (isLogin) document.title = 'Log in - Psydkick';
    if (!isLogin) document.title = 'Sign up - Psydkick';
  }, [isLogin]);

  const helperText = isLogin ? 'User does not exist' : 'Username is taken';
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
                    intent={invalid ? Intent.DANGER : undefined}
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
                      onKeyPress={e => {
                        if (e.which === 13) {
                          login({variables: {name: username}});
                        }
                      }}
                    />
                  </FormGroup>
                  <div className={s.buttonFlex}>
                    <Button minimal onClick={() => history.replace(route)}>
                      {routeButton}
                    </Button>
                    <Button
                      disabled={loading || !username || invalid}
                      onClick={() => login({variables: {name: username}})}>
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
