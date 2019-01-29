import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloClient} from 'apollo-client';
import {setContext} from 'apollo-link-context';
import {HttpLink} from 'apollo-link-http';
import gql from 'graphql-tag';
import React from 'react';
import {ApolloProvider, Query} from 'react-apollo';
import ReactDOM from 'react-dom';
import {BrowserRouter, Redirect, Route, RouteComponentProps, RouteProps, Switch} from 'react-router-dom';
import App from './components/App/App';
import Login from './components/Login/Login';
import './index.scss';
import {initializers, resolvers, typeDefs} from './resolvers';
import * as serviceWorker from './serviceWorker';

// Initialize cache.
const cache = new InMemoryCache();

// Connect to the API.
const link = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});

const authLink = setContext((_, {headers}) => {
  // Get the authentication token from local storage if it exists.
  const token = localStorage.getItem('token');
  // Return the headers to the context so httpLink can read them.
  return {
    headers: {
      ...headers,
      authorization: token ? token : '',
    },
  };
});

// Build Apollo client.
const client = new ApolloClient({
  cache,
  link: authLink.concat(link),
  initializers, // Alpha
  resolvers, // Alpha
  typeDefs, // Alpha
});

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

interface IAuthRouteProps extends RouteProps {
  render?: (props: RouteComponentProps<any, any, {redirect?: string}>) => React.ReactNode;
}

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <Query query={IS_LOGGED_IN}>
        {({loading, error, data}) => {
          if (loading) return <p>{'Loading...'}</p>;
          if (error) return <p>{error.message}</p>;

          return (
            <Switch>
              <Route<IAuthRouteProps>
                path={`/auth`}
                render={({location, history}) => {
                  const {redirect} = location.state;
                  if (!data.isLoggedIn) return <Login redirect={redirect} history={history} />;
                  return <Redirect to={'/'} />;
                }}
              />
              <Route
                render={({location: {pathname}}) => {
                  if (!data.isLoggedIn) return <Redirect to={{pathname: '/auth', state: {redirect: pathname}}} />;
                  return <App />;
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
