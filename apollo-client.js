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
  // IMPORTANT: this uri must change based on which GraphQL endpoint is being queried
  uri: `https://nextjs-with-couchbase-and-graphql.vercel.app/api/graphql`,
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions
});

export default client;
