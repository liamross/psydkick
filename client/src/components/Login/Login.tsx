import React, {useState, useEffect} from 'react';
import gql from 'graphql-tag';
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

interface ILoginProps {}

const Login: React.SFC<ILoginProps> = () => {
  const [username, setUsername] = useState('');
  const [invalid, setInvalid] = useState(false);
  useEffect(() => {
    setInvalid(false);
  }, [username]);

  return (
    <ApolloConsumer>
      {client => (
        <Mutation
          mutation={LOGIN_USER}
          onCompleted={({login}) => {
            if (login) {
              localStorage.setItem('token', login);
              client.writeData({data: {isLoggedIn: true}});
            } else {
              setInvalid(true);
            }
          }}>
          {(login, {loading, error}) => {
            if (loading) return <p>{'Loading...'}</p>;
            if (error) return <p>{error.message}</p>;

            return (
              <div className={s.login}>
                <FormGroup
                  helperText={invalid ? 'Invalid username' : undefined}
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
                  />
                </FormGroup>
                <Button onClick={() => login({variables: {name: username}})}>Log in</Button>
              </div>
            );
          }}
        </Mutation>
      )}
    </ApolloConsumer>
  );
};

export default Login;
