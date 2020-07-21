import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

// graphql part
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache()
});


// render part
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
  ,
  document.getElementById('root')
);


serviceWorker.unregister();
