import gql from 'graphql-tag';
import React from 'react';
import {ApolloConsumer, Query} from 'react-apollo';
import {
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
  Switch,
} from 'react-router';
import Auth from '../Auth/Auth';
import AuthCheck from '../AuthCheck/AuthCheck';
import ErrorState from '../ErrorState/ErrorState';
import Loading from '../Loading/Loading';
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
        if (loading && !data) return <Loading />;
        if (error) return <ErrorState error={error} />;

        return (
          <Switch>
            <Route<IAuthRouteProps>
              path="/(login|signup)"
              render={({location, history}) => {
                const redirect = location.state && location.state.redirect;
                if (!data!.isLoggedIn) {
                  return <Auth redirect={redirect} history={history} />;
                }
                return <Redirect to={'/'} />;
              }}
            />
            <Route
              render={({location: {pathname}}) => {
                if (!data!.isLoggedIn) {
                  return (
                    <Redirect
                      to={{pathname: '/login', state: {redirect: pathname}}}
                    />
                  );
                }
                return (
                  <ApolloConsumer>
                    {client => <AuthCheck client={client} />}
                  </ApolloConsumer>
                );
              }}
            />
          </Switch>
        );
      }}
    </Query>
  );
};

export default App;
