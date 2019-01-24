import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';
import {ApolloClient} from 'apollo-client';
import {ApolloProvider} from 'react-apollo';

import {initializers, resolvers, typeDefs} from './resolvers';
import * as serviceWorker from './serviceWorker';
import App from './components/App/App';
import Login from './components/App/App';
import './index.scss';

// Initialize cache.
const cache = new InMemoryCache();

// Connect to the API.
const link = new HttpLink({uri: 'http://localhost:4000/'});

// Build Apollo client.
const client = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
    headers: {
      authorization: localStorage.getItem('token'),
      'client-name': 'psydkick-client',
      'client-version': '1.0.0',
    },
  }),
  // Alpha version of Apollo:
  initializers,
  resolvers,
  typeDefs,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
