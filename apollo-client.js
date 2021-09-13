import {ApolloClient, InMemoryCache} from "@apollo/client";

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
}


const client = new ApolloClient({
  uri: `${process.env.BASE_URL || 'http://localhost:3000'}/api/graphql`,
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions
});

console.log(client);

export default client;
