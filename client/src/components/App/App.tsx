import React, {memo} from 'react';
import useExactDate from '../../hooks/useExactDate';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import s from './App.module.scss';

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

function App() {
  const date = useExactDate();

  return (
    <div className={s.app}>
      <header className={s.app__header}>{date.toString()}</header>
    </div>
  );
}

export default memo(App);
