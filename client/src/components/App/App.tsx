import React, {memo} from 'react';
import useExactDate from '../../hooks/useExactDate';
import './App.scss';

function App() {
  const date = useExactDate();

  return (
    <div className="App">
      <header className="App-header">{date.toString()}</header>
    </div>
  );
}

export default memo(App);
