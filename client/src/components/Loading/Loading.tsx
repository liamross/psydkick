import classNames from 'classnames';
import React from 'react';

import s from './Loading.module.scss';
import {Spinner} from '@blueprintjs/core';

interface LoadingProps {
  instant?: boolean;
}

const Loading: React.SFC<LoadingProps> = ({instant}) => {
  return (
    <div
      className={classNames(s.component, {
        [s.delayed]: !instant,
      })}>
      <Spinner />
    </div>
  );
};

export default Loading;
