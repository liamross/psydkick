import gql from 'graphql-tag';
import React from 'react';
import {Query} from 'react-apollo';
import {
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
  Switch,
} from 'react-router';
import Auth from '../Auth/Auth';
import Chat from '../Chat/Chat';
import Home from '../Home/Home';
import {IsUserLoggedIn} from './types/IsUserLoggedIn';

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

interface IAuthRouteProps extends RouteProps {
  render?: (
    props: RouteComponentProps<any, any, {redirect?: string} | undefined>,
  ) => React.ReactNode;
}

const App: React.SFC<{}> = () => {
  return (
    <Query<IsUserLoggedIn> query={IS_LOGGED_IN}>
      {({loading, error, data}) => {
        if (loading && !data) return <p>{'Loading...'}</p>;
        if (error) return <p>{error.message}</p>;

        return (
          <Switch>
            <Route<IAuthRouteProps>
              path={['/login', '/signup']}
              render={({location, history}) => {
                const redirect = location.state && location.state.redirect;
                if (!data!.isLoggedIn) {
                  return <Auth redirect={redirect} history={history} />;
                }
                return <Redirect to={'/'} />;
              }}
            />
            <Route path={`/chat/:chatId?`} component={Chat} />
            <Route
              render={({history, location: {pathname}}) => {
                if (!data!.isLoggedIn) {
                  return (
                    <Redirect
                      to={{pathname: '/login', state: {redirect: pathname}}}
                    />
                  );
                }
                return <Home history={history} />;
              }}
            />
          </Switch>
        );
      }}
    </Query>
  );
};

export default App;
