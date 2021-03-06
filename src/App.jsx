import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import ErrorBoundary from 'components/ErrorBoundary';
import { CurrentUserContextProvider } from 'context/CurrentUserContext';
import Routes from './Routes';
import netlifyIdentity from 'netlify-identity-widget';

const client = new ApolloClient({
  uri: '/.netlify/functions/graphql',
  request: operation => {
    const currentUser = netlifyIdentity.currentUser();
    console.log('current user', currentUser);
    if (currentUser) {
      currentUser.jwt().then(token => {
        console.log('TOKEN: ', token);
        operation.setContext({
          headers: {
            authorization: token ? `Bearer ${token}` : '',
          },
        });
      });
    }
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ApolloProvider client={client}>
        <CurrentUserContextProvider>
          <Routes />
        </CurrentUserContextProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );
}

export default App;
