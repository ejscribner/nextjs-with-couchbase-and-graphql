import {ApolloServer, gql} from "apollo-server-micro";
import {executeRead, executeQuery, executeUpsert, executeDelete} from "../../util/db";
import { v4 } from 'uuid'

const typeDefs = gql`
  type Query {
    hotels: [Hotel!]
    bookings: [Booking_Hotel!]
  }
  
  type Mutation {
    createHotelBooking(startDate: String!, endDate: String!, hotelId: ID!): Booking_Hotel!
    updateHotelBooking(id: ID!, startDate: String, endDate: String): Booking_Hotel!
    deleteHotelBooking(id: ID!): String
  }
  
  type Hotel {
    id: ID!
    title: String
    name: String!
    address: String
    phone: String
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
    hotelId: ID!
    hotelDetails: Hotel
  }
`;

const resolvers = {
  Query: {
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
         LIMIT 25
      `);
    },
    bookings: async (_parent, args, _context) => {
      let bookings = await executeQuery(`
        SELECT id,
            startDate,
            endDate,
            hotelId
        FROM \`travel-sample\`.bookings.hotel
      `)

      // fetch hotel details for each booking with a KV GET
      if (bookings === null) {
        throw new Error("Could not fetch data. Is the database running?")
      }
      bookings = await Promise.all(bookings.map(async (item) => {
        let temp = {...item};
        temp.hotelDetails = await executeRead(`hotel_${item.hotelId}`, 'inventory', 'hotel');
        return temp;
      }))

      return bookings;
    }
  },

  Mutation: {
    createHotelBooking: async (_parent, args, _context) => {
      let newBooking = {
        id: v4(),
        ...args
      }

      let res = await executeUpsert(`hotelBooking_${newBooking.id}`, newBooking, 'bookings', 'hotel');

      // fetch hotel details with a KV GET
      res.hotelDetails = await executeRead(`hotel_${res.hotelId}`, 'inventory', 'hotel');

      return res;
    },
    updateHotelBooking: async (_parent, args, _context) => {
      let currentBooking = await executeRead(`hotelBooking_${args.id}`, 'bookings', 'hotel');
      let updatedBooking = {
        ...currentBooking,
        id: args.id,
        startDate: args.startDate ? args.startDate : currentBooking.startDate,
        endDate: args.endDate ? args.endDate : currentBooking.endDate
      }

      let res = await executeUpsert(`hotelBooking_${args.id}`, updatedBooking, 'bookings', 'hotel');

      res.hotelDetails = await executeRead(`hotel_${res.hotelId}`, 'inventory', 'hotel');

      return res;
    },
    deleteHotelBooking: async (_parent, args, _context) => {
      return await executeDelete(`hotelBooking_${args.id}`, 'bookings', 'hotel')
    }
  },
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
