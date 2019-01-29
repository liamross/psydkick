import gql from 'graphql-tag';
import React from 'react';
import {Query} from 'react-apollo';
import {Redirect, Route, RouteComponentProps, RouteProps, Switch} from 'react-router';
import Chat from '../Chat/Chat';
import Home from '../Home/Home';
import Login from '../Login/Login';
import SignUp from '../SignUp/SignUp';
import {IsUserLoggedIn} from './types/IsUserLoggedIn';

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

interface IAuthRouteProps extends RouteProps {
  render?: (props: RouteComponentProps<any, any, {redirect?: string} | undefined>) => React.ReactNode;
}

const App: React.SFC<{}> = () => {
  return (
    <Query<IsUserLoggedIn> query={IS_LOGGED_IN}>
      {({loading, error, data}) => {
        if (error) return <p>{error.message}</p>;
        if (loading && !data) return <p>{'Loading...'}</p>;

        return (
          <Switch>
            <Route<IAuthRouteProps>
              path={`/signup`}
              render={({location, history}) => {
                const redirect = location.state && location.state.redirect;
                if (!data!.isLoggedIn) return <SignUp redirect={redirect} history={history} />;
                return <Redirect to={'/'} />;
              }}
            />
            <Route<IAuthRouteProps>
              path={`/login`}
              render={({location, history}) => {
                const redirect = location.state && location.state.redirect;
                if (!data!.isLoggedIn) return <Login redirect={redirect} history={history} />;
                return <Redirect to={'/'} />;
              }}
            />
            <Route path={`/chat`} component={Chat} />
            <Route
              render={({location: {pathname}}) => {
                if (!data!.isLoggedIn) return <Redirect to={{pathname: '/login', state: {redirect: pathname}}} />;
                return <Home />;
              }}
            />
          </Switch>
        );
      }}
    </Query>
  );
};

export default App;
