import {NonIdealState} from '@blueprintjs/core';
import {ApolloError} from 'apollo-client';
import React from 'react';
import s from './ErrorState.module.scss';

interface IErrorStateProps {
  error: ApolloError;
}

const ErrorState: React.SFC<IErrorStateProps> = ({error}) => {
  console.log('extraInfo', error.extraInfo);
  console.log('graphQLErrors', error.graphQLErrors);
  console.log('message', error.message);
  console.log('name', error.name);
  console.log('networkError', error.networkError);
  // console.log('stack', error.stack);
  // console.log(error);
  return (
    <div className={s.component}>
      <NonIdealState title={'Whoops!'} description={error.message} />
    </div>
  );
};

export default ErrorState;
