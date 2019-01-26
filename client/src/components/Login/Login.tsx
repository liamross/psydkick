import React, {useState} from 'react';
import gql from 'graphql-tag';
import {FormGroup, InputGroup, Button} from '@blueprintjs/core';
import {ApolloConsumer, Mutation} from 'react-apollo';

import s from './Login.module.scss';

export const LOGIN_USER = gql`
  mutation login($name: String!) {
    login(name: $name)
  }
`;

interface ILoginProps {
  // someProp: string;
}

const Login: React.SFC<ILoginProps> = () => {
  const [username, setUsername] = useState('');

  return (
    <ApolloConsumer>
      {client => (
        <Mutation
          mutation={LOGIN_USER}
          onCompleted={({login}) => {
            localStorage.setItem('token', login);
            client.writeData({data: {isLoggedIn: true}});
          }}>
          {(login, {loading, error}) => {
            if (loading) return <p>{'Loading...'}</p>;
            if (error) return <p>{error.message}</p>;

            // login({ variables: { name: someName } })

            return (
              <div className={s.login}>
                <FormGroup
                  helperText={undefined} // If you need to show an error
                  intent={undefined} // If you need to show an error
                  label={'Username'}
                  labelFor={'login-username'}
                  labelInfo={'*'}>
                  <InputGroup
                    id={'login-username'}
                    placeholder={'Enter your username'}
                    intent={undefined} // If you need to show an error
                    value={username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  />
                </FormGroup>
                <Button onClick={() => login({variables: {name: username}})}>Login</Button>
              </div>
            );
          }}
        </Mutation>
      )}
    </ApolloConsumer>
  );
};

export default Login;
