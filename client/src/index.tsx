import React from 'react';
import ReactDOM from 'react-dom';

import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';
import {ApolloClient} from 'apollo-client';
import {ApolloProvider} from 'react-apollo';

import * as serviceWorker from './serviceWorker';
import App from './components/App/App';
import './index.scss';

// Set up cache.
const cache = new InMemoryCache();

// Set up link to back-end.
const link = new HttpLink({uri: 'http://localhost:4000/'});

// Build apollo client.
const client = new ApolloClient({cache, link});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
