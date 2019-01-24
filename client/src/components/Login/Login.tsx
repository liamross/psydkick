import React from 'react';

import './Login.scss';

interface ILoginProps {
  someProp: string;
}

const Login: React.SFC<ILoginProps> = ({someProp}) => {
  return <div className="psy-Login">{'Hello World'}</div>;
};

export default Login;
