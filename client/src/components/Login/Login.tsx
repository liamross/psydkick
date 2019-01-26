import React, {useState, useEffect, memo} from 'react';
import gql from 'graphql-tag';
import {History} from 'history';
import {FormGroup, InputGroup, Button, Intent} from '@blueprintjs/core';
import {ApolloConsumer, Mutation} from 'react-apollo';

import s from './Login.module.scss';

const LOGIN_USER = gql`
  mutation login($name: String!) {
    login(name: $name)
  }
`;

const CREATE_ACCOUNT = gql`
  mutation login($name: String!) {
    createAccount(name: $name)
  }
`;

interface ILoginProps {
  redirect?: string;
  history?: History<any>;
}

const Login: React.SFC<ILoginProps> = ({redirect, history}) => {
  const [username, setUsername] = useState('');
  const [invalid, setInvalid] = useState(false);
  useEffect(() => {
    setInvalid(false);
  }, [username]);

  useEffect(() => {
    document.title = 'Sign in - Psydkick';
  }, []);

  return (
    <ApolloConsumer>
      {client => (
        <Mutation
          mutation={LOGIN_USER}
          onCompleted={({login}) => {
            if (login) {
              localStorage.setItem('token', login);
              client.writeData({data: {isLoggedIn: true}});
              if (history && redirect) {
                history.push(redirect);
              }
            } else {
              setInvalid(true);
            }
          }}>
          {(login, {error}) => {
            if (error) return <p>{error.message}</p>;

            return (
              <div className={s.component}>
                <div className={s.container}>
                  <FormGroup
                    helperText={invalid ? 'User does not exist' : undefined}
                    intent={invalid ? Intent.DANGER : undefined}
                    label={'Username'}
                    labelFor={'login-username'}
                    labelInfo={'*'}>
                    <InputGroup
                      id={'login-username'}
                      placeholder={'Enter your username'}
                      intent={invalid ? Intent.DANGER : undefined}
                      value={username}
                      autoComplete="off" // Stop autocomplete from covering helper text.
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                      onKeyPress={e => {
                        if (e.which === 13) login({variables: {name: username}});
                      }}
                    />
                  </FormGroup>
                  <div className={s.buttonFlex}>
                    <Button
                      disabled={!username || invalid}
                      onClick={() => {
                        login({variables: {name: username}});
                      }}>
                      {'Sign in'}
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

export default memo(Login);
