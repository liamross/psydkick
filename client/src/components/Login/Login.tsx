import {Button, FormGroup, InputGroup, Intent} from '@blueprintjs/core';
import gql from 'graphql-tag';
import {History} from 'history';
import React, {useEffect, useState} from 'react';
import {ApolloConsumer, Mutation} from 'react-apollo';
import s from './Login.module.scss';
import {LoginAccount, LoginAccountVariables} from './types/LoginAccount';

const LOGIN_ACCOUNT = gql`
  mutation LoginAccount($name: String!) {
    login(name: $name)
  }
`;

interface ILoginProps {
  redirect?: string;
  history: History<any>;
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
        <Mutation<LoginAccount, LoginAccountVariables>
          mutation={LOGIN_ACCOUNT}
          onCompleted={({login}) => {
            if (login) {
              localStorage.setItem('token', login);
              client.writeData({data: {isLoggedIn: true}});
              if (redirect) {
                history.push(redirect);
              } else {
                history.push('/');
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
                      placeholder={'Enter username'}
                      intent={invalid ? Intent.DANGER : undefined}
                      value={username}
                      autoComplete="off" // Stop autocomplete from covering helper text.
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setUsername(e.target.value)
                      }
                      onKeyPress={e => {
                        if (e.which === 13)
                          login({variables: {name: username}});
                      }}
                    />
                  </FormGroup>
                  <div className={s.buttonFlex}>
                    <Button minimal onClick={() => history.replace('/signup')}>
                      {'Create a new account'}
                    </Button>
                    <Button
                      disabled={!username || invalid}
                      onClick={() => login({variables: {name: username}})}>
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

export default Login;
