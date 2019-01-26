import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';

import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';
import {ApolloClient} from 'apollo-client';
import {ApolloProvider, Query} from 'react-apollo';
import gql from 'graphql-tag';

import {initializers, resolvers, typeDefs} from './resolvers';
import * as serviceWorker from './serviceWorker';

import App from './components/App/App';
import Login from './components/Login/Login';

import './index.scss';

// Initialize cache.
const cache = new InMemoryCache();

// Connect to the API.
const link = new HttpLink({
  uri: 'http://localhost:4000/graphql',
  headers: {
    authorization: localStorage.getItem('token'),
    'client-name': 'psydkick-client',
    'client-version': '1.0.0',
  },
});

// Build Apollo client.
const client = new ApolloClient({
  cache,
  link,
  initializers, // Alpha
  resolvers, // Alpha
  typeDefs, // Alpha
});

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <Query query={IS_LOGGED_IN}>
        {({loading, error, data}) => {
          if (loading) return <p>{'Loading...'}</p>;
          if (error) return <p>{error.message}</p>;

          return (
            <Switch>
              <Route
                path={`/auth`}
                render={({location, history}) => {
                  const {redirect} = location.state;
                  if (!data.isLoggedIn) {
                    return <Login redirect={redirect} history={history} />;
                  }
                  return <Redirect to={'/'} />;
                }}
              />
              <Route
                render={({location: {pathname}}) => {
                  return !data.isLoggedIn ? (
                    <Redirect
                      to={{
                        pathname: '/auth',
                        state: {
                          redirect: pathname,
                        },
                      }}
                    />
                  ) : (
                    <App />
                  );
                }}
              />
            </Switch>
          );
        }}
      </Query>
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
