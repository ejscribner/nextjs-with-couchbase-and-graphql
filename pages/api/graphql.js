import {ApolloServer, gql} from "apollo-server-micro";
import {connectToDatabase} from "../../util/couchbase";
import {executeRead, executeQuery, executeUpsert} from "../../util/db";
import { v4 } from 'uuid'

const typeDefs = gql`
  type Query {
    airlines: [Airline!]
    hotels: [Hotel!]
    hotel(id: ID!): Hotel!
  }
  
  type Mutation {
    setName(id: ID!): String
    createHotelBooking(startDate: String!, endDate: String!, hotelId: ID!): Booking_Hotel!
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
  
  type Hotel {
    id: ID!
    title: String
    name: String!
    address: String!
    phone: String!
    url: String!
    price: Int
    country: String
    city: String
    state: String
    description: String
  }
  
  type Booking_Hotel {
    id: ID!
    startDate: String
    endDate: String
    hotel: Hotel!
  }
`;
// TODO: update Booking_Hotel w/ real date types and real hotel type/identifier

const resolvers = {
  Query: {
    airlines: async (_parent, args, _context) => {
      return executeQuery(`
         SELECT id,
            type,
            name,
            iata,
            icao,
            callsign,
            country
         FROM \`travel-sample\`.inventory.airline WHERE type = "airline" LIMIT 5;
      `);
    },
    hotels: async (_parent, args, _context) => {
      return executeQuery(`
        SELECT id,
           title,
           name,
           address,
           phone,
           url,
           price,
           country,
           city,
           state,
           description
         FROM \`travel-sample\`.inventory.hotel
      `);
    },
    hotel: async (_parent, args, _context) => {
      return executeRead(`hotel_${args.id}`);
    }
  },

  Mutation: {
    createHotelBooking: async (_parent, args, _context) => {
      let hotelToBook = await executeRead(`hotel_${args.hotelId}`)

      let newBooking = {
        id: v4(),
        hotel: hotelToBook,
        ...args
      }
      return executeUpsert(`hotelBooking_${newBooking.id}`, newBooking, 'bookings', 'hotel');
    },
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
