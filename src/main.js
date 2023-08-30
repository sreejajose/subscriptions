import { createApp, provide, h } from 'vue'
import App from './App.vue'
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { setContext } from '@apollo/client/link/context';
import { HttpLink, split, concat } from "@apollo/client/core"
import { createClient } from 'graphql-ws'
import { GraphQLWsLink } from "@apollo/client/link/subscriptions"; // <-- This one uses graphql-ws
import { getMainDefinition } from "@apollo/client/utilities"

// Create an http link:
const httpLink = createHttpLink({
    // You should use an absolute URL here
    uri: 'cloudurl/v1/graphql', //Cloud-url
  })
  
  const authLink = setContext((_, { headers }) => {
      return {
        headers: {
          ...headers,
          authorization: `Bearer TOKEN-VALID` // TOKEN-VALID
        }
      }
    });

// Create a GraphQLWsLink link:
const wsLink = new GraphQLWsLink(
    createClient({
        url: 'wss://url/graphql',
        shouldRetry: () => true,
        connectionParams: () => {
          return {
            headers: {
                Authorization: `Bearer TOKEN-VALID` // TOKEN-VALID
              },
          }
        },
      }),
);

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    )
  },
  wsLink,
  concat(authLink, httpLink)
)

// Create the apollo client with cache implementation.
const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});



const app = createApp({
  setup () {
    provide(DefaultApolloClient, apolloClient)
  },

  render: () => h(App),
})

app.mount('#app')