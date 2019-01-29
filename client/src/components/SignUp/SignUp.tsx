import {Button, FormGroup, InputGroup, Intent} from '@blueprintjs/core';
import gql from 'graphql-tag';
import {History} from 'history';
import React, {useEffect, useState} from 'react';
import {ApolloConsumer, Mutation} from 'react-apollo';
import s from './SignUp.module.scss';
import {CreateAccount, CreateAccountVariables} from './types/CreateAccount';

const CREATE_ACCOUNT = gql`
  mutation CreateAccount($name: String!) {
    createAccount(name: $name)
  }
`;

interface ISignUpProps {
  redirect?: string;
  history: History<any>;
}

const SignUp: React.SFC<ISignUpProps> = ({redirect, history}) => {
  const [username, setUsername] = useState('');
  const [invalid, setInvalid] = useState(false);
  useEffect(() => {
    setInvalid(false);
  }, [username]);

  useEffect(() => {
    document.title = 'Create an account - Psydkick';
  }, []);

  return (
    <ApolloConsumer>
      {client => (
        <Mutation<CreateAccount, CreateAccountVariables>
          mutation={CREATE_ACCOUNT}
          onCompleted={({createAccount}) => {
            if (createAccount) {
              localStorage.setItem('token', createAccount);
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
          {(signUp, {error}) => {
            if (error) return <p>{error.message}</p>;

            return (
              <div className={s.component}>
                <div className={s.container}>
                  <FormGroup
                    helperText={invalid ? 'Name already exists' : undefined}
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                      onKeyPress={e => {
                        if (e.which === 13) signUp({variables: {name: username}});
                      }}
                    />
                  </FormGroup>
                  <div className={s.buttonFlex}>
                    <Button minimal onClick={() => history.replace('/login')}>
                      {'Sign in as existing user'}
                    </Button>
                    <Button
                      disabled={!username || invalid}
                      onClick={() => {
                        signUp({variables: {name: username}});
                      }}>
                      {'Create account'}
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

export default SignUp;
