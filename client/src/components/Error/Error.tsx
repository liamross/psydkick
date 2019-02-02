import React from 'react';

import s from './Error.module.scss';

interface IErrorProps {}

const Error: React.SFC<IErrorProps> = () => {
  return <div className={s.component}>{'Hello World'}</div>;
}

export default Error;
