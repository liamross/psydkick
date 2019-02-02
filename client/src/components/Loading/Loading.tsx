import React from 'react';

import s from './Loading.module.scss';

interface ILoadingProps {}

const Loading: React.SFC<ILoadingProps> = () => {
  return <div className={s.component}>{'TODO: Loading Placeholder'}</div>;
};

export default Loading;
