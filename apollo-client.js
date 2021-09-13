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

let baseUrl = process.env.BASE_URL;
console.log(baseUrl);
const client = new ApolloClient({
  uri: `${baseUrl}/api/graphql`,
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions
});


export default client;
