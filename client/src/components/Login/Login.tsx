import React from 'react';
import gql from 'graphql-tag';
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
  return (
    <ApolloConsumer>
      {client => (
        <Mutation
          mutation={LOGIN_USER}
          onCompleted={({login}) => {
            localStorage.setItem('token', login);
            client.writeData({data: {isLoggedIn: true}});
          }}>
          {(login, {loading, error, data}) => {
            if (loading) return <p>{'Loading...'}</p>;
            if (error) return <p>{error.message}</p>;

            return <button onClick={() => login({variables: {name: 'Liam'}})}>Hey</button>;
          }}
        </Mutation>
      )}
    </ApolloConsumer>
  );
};

export default Login;
