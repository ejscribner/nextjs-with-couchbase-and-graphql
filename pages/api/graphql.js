import {ApolloServer, gql} from "apollo-server-micro";
import {connectToDatabase} from "../../util/couchbase";

const typeDefs = gql`
  type Query {
    airlines: [Airline!]
  }
  
  type Airline {
    id: ID!
    type: String
    name: String
    iata: String
    icao: String
    callsign: String
    country: String
  }
`;

const resolvers = {
  Query: {
    airlines: async (_parent, args, _context) => {
      const { cluster } = await connectToDatabase();
      let result, rows = null;
      let qs = `SELECT * FROM \`travel-sample\` WHERE type = "airline" LIMIT 5;`
      try {
        result = await cluster.query(qs);
        rows = result.rows;
      } catch (e) {
        console.log('Error Querying: \n', e);
      }

      return rows.map((row) => {
        return row['travel-sample']
      });
    }
  }
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers
});

const startServer = apolloServer.start();

export default async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader(
      'Access-Control-Allow-Origin',
      'https://studio.apollographql.com'
  )
  res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
  )
  res.setHeader(
      'Access-Control-Allow-Methods',
      'POST'
  )
  if (req.method === 'OPTIONS') {
    res.end()
    return false
  }

  await startServer
  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res)
}

export const config = {
  api: {
    bodyParser: false
  }
};
