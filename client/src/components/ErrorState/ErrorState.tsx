import {Button, NonIdealState} from '@blueprintjs/core';
import {ApolloError} from 'apollo-client';
import React from 'react';
import {ApolloConsumer} from 'react-apollo';
import {DatabaseError, InputError, ValidationError} from './errorParams';
import s from './ErrorState.module.scss';

interface ErrorStateProps {
  error: ApolloError;
  /**
   * Only shown if the error is not a validaiton error.
   */
  actionButton?: {buttonText: string; onClick: () => any};
}

const ErrorState: React.SFC<ErrorStateProps> = ({error, actionButton}) => {
  console.error(error);
  return (
    <ApolloConsumer>
      {client => {
        let title = error.name;
        let description =
          error.message.length > 100 ? 'An error has occured' : error.message;
        // let moreInformation = error.extraInfo;

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
            client.writeData({data: {isLoggedIn: false}});
            localStorage.removeItem('token');
          }
        }

        return (
          <div className={s.component}>
            <NonIdealState
              title={title}
              description={description}
              action={
                actionButton ? (
                  <Button onClick={actionButton.onClick}>
                    {actionButton.buttonText}
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

export default ErrorState;
