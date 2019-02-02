import {Button, NonIdealState} from '@blueprintjs/core';
import {ApolloError} from 'apollo-client';
import React from 'react';
import {RouteComponentProps, withRouter} from 'react-router';
import {DatabaseError, InputError, ValidationError} from './errorParams';
import s from './ErrorState.module.scss';
import {ApolloConsumer} from 'react-apollo';

interface IErrorStateProps extends RouteComponentProps {
  error?: ApolloError;
  /**
   * Only shown if the error is not a validaiton error.
   */
  actionButton?: {buttonText: string; onClick: () => any};
}

const ErrorState: React.SFC<IErrorStateProps> = ({
  error,
  actionButton,
  history,
  location: {pathname},
}) => {
  return (
    <ApolloConsumer>
      {client => {
        let title;
        let description;
        // let moreInformation;
        let localActionButton;
        if (error) {
          title = error.name;
          description =
            error.message.length > 100 ? 'An error has occured' : error.message;
          // moreInformation = error.extraInfo;
          localActionButton = actionButton;

          if (error.graphQLErrors && error.graphQLErrors.length) {
            const graphQLError = error.graphQLErrors[0];
            const code =
              graphQLError.extensions && graphQLError.extensions.exception
                ? graphQLError.extensions.exception.code
                : undefined;
            // moreInformation = graphQLError.message;

            if (code === InputError.code) {
              title = 'Internal server error';
              description =
                "This is bad and there isn't anything you can do about it!";
            }

            if (code === DatabaseError.code) {
              title = 'Error finding resources';
              description =
                "Some of the things you asked for don't exist in the database";
            }

            if (code === ValidationError.code) {
              localStorage.removeItem('token');
              title = 'Your session has expired';
              description = 'Click the button below to sign in';
              localActionButton = {
                buttonText: 'Log in',
                onClick: () => {
                  history.replace('/login', {redirect: pathname});
                  client.writeData({data: {isLoggedIn: false}});
                },
              };
            }
          }
        } else {
          localStorage.removeItem('token');
          title = 'Your session has expired';
          description = 'Click the button below to sign in';
          localActionButton = {
            buttonText: 'Log in',
            onClick: () => {
              history.replace('/login', {redirect: pathname});
              client.writeData({data: {isLoggedIn: false}});
            },
          };
        }

        return (
          <div className={s.component}>
            <NonIdealState
              title={title}
              description={description}
              action={
                localActionButton ? (
                  <Button onClick={localActionButton.onClick}>
                    {localActionButton.buttonText}
                  </Button>
                ) : (
                  undefined
                )
              }
            />
          </div>
        );
      }}
    </ApolloConsumer>
  );
};

export default withRouter(ErrorState);
