import {ApolloServer, gql} from "apollo-server-micro";
import {connectToDatabase} from "../../util/couchbase";

const typeDefs = gql`
  type Query {
    airlines: [Airline!]
  }
  
  type Mutation {
    setName(id: ID!): String
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
  },

  Mutation: {
    setName: async (_parent, args, _context) => {
      let upsertResponse;
      const {cluster, bucket, collection} = await connectToDatabase();

      await collection.get(`airline_${args.id}`).then(async (result) => {
        const newDoc = {
          id: args.id,
          ...result.content,
          name: "40 Mile Airrrrr",
        }

        await collection.upsert(`airline_${args.id}`, newDoc).then((result) => {
          console.log(result);
          upsertResponse = `Successfully Updated Name of airline_${args.id} to ${newDoc.name}`;
        }).catch((err) => {
          console.log(err);
          upsertResponse = `Error Encountered: ${err.message}`
        })
      })

      return upsertResponse;
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
