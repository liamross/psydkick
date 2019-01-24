import React, {memo} from 'react';
import useExactDate from '../../hooks/useExactDate';
import s from './App.module.scss';

function App() {
  const date = useExactDate();

  return (
    <div className={s.app}>
      <header className={s.app__header}>{date.toString()}</header>
    </div>
  );
}

export default memo(App);
