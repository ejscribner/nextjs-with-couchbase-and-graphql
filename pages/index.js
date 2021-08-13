import Head from 'next/head'
import {connectToDatabase} from '../util/couchbase'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";
import {useState} from "react";
import 'semantic-ui-css/semantic.min.css'
import {Button, Tab, Table} from "semantic-ui-react";
import BookingModal from "./components/BookingModal";

// TOdo: break this out into a ./apollo-client.js file
// https://www.apollographql.com/blog/apollo-client/next-js/next-js-getting-started/
const client = new ApolloClient({
  uri: 'http://localhost:3000/api/graphql',
  cache: new InMemoryCache()
});

export default function Home({hotels, bookings}) {
  const [getResult, setGetResult] = useState([]);
  const handleGet = async (event) => {
    event.preventDefault();


    const {data} = await client.query({
      query: gql`
      query ExampleQuery {
        airlines {
          id,
          type,
          name
        }
      }
    `
    })
    setGetResult(data.airlines)
  }

  const panes = [
    {menuItem: 'Hotels', render: () =>
          <Tab.Pane>
          {/*  Table of Hotels */}
            <Table celled padded>
              <Table.Header>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Address</Table.HeaderCell>
                <Table.HeaderCell>Phone</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Header>

              <Table.Body>
                { hotels &&
                  hotels.map((hotel) => {
                    return (
                        <Table.Row key={hotel.id}>
                          <Table.Cell>{hotel.name}</Table.Cell>
                          <Table.Cell>{hotel.address}</Table.Cell>
                          <Table.Cell>{hotel.phone}</Table.Cell>
                          <Table.Cell><BookingModal/></Table.Cell>
                        </Table.Row>
                    )
                  })
                }
              </Table.Body>
            </Table>
          </Tab.Pane>
    },
    {menuItem: 'Bookings', render: () =>
          <Tab.Pane>
            <Table celled padded>
              <Table.Header>
                <Table.HeaderCell>Hotel Name</Table.HeaderCell>
                <Table.HeaderCell>Check In</Table.HeaderCell>
                <Table.HeaderCell>Check Out</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Header>

              <Table.Body>
                { bookings &&
                bookings.map((booking) => {
                  return (
                      <Table.Row key={booking.id}>
                        <Table.Cell>{booking.hotelDetails.name}</Table.Cell>
                        <Table.Cell>{booking.startDate}</Table.Cell>
                        <Table.Cell>{booking.endDate}</Table.Cell>
                        <Table.Cell>Dropdown Actions (Modify/Cancel)</Table.Cell>
                      </Table.Row>
                  )
                })
                }
              </Table.Body>
            </Table>
          </Tab.Pane>
    }
  ]

  return (
      <div className="container">
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico"/>
        </Head>

        <main>
          <Tab panes={panes}></Tab>
        </main>

        <footer>
          <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
          >
            Powered by{' '}
            <img src="/vercel.svg" alt="Vercel Logo" className="logo"/>
          </a>
        </footer>

        <style jsx>{`
          .small {
            font-size: 10px;
          }
          
          .center {
            text-align: center;
          }
          
          td, th {
            padding: 2px 30px;
          }

          table, th, td {
            border: 1px solid #aaa;
          }

          .red, .error {
            color: indianred;
          }

          .green, .success {
            color: lightseagreen;
          }

          .container {
            min-height: 100vh;
            padding: 0 0.5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          main {
            padding: 5rem 0;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          footer {
            width: 100%;
            height: 100px;
            border-top: 1px solid #eaeaea;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          footer img {
            margin-left: 0.5rem;
          }

          footer a {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          a {
            color: inherit;
            text-decoration: none;
          }

          .title a {
            color: #0070f3;
            text-decoration: none;
          }

          .title a:hover,
          .title a:focus,
          .title a:active {
            text-decoration: underline;
          }

          .title {
            margin: 0;
            line-height: 1.15;
            font-size: 4rem;
          }

          .title,
          .description {
            text-align: center;
          }

          .subtitle {
            font-size: 2rem;
            text-align: center;
          }

          .description {
            line-height: 1.5;
            font-size: 1.5rem;
          }

          code {
            background: #fafafa;
            border-radius: 5px;
            padding: 0.75rem;
            font-size: 1.1rem;
            font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
          }

          .grid {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;

            max-width: 800px;
            margin-top: 3rem;
          }

          .card {
            margin: 1rem;
            flex-basis: 45%;
            padding: 1.5rem;
            text-align: left;
            color: inherit;
            text-decoration: none;
            border: 1px solid #eaeaea;
            border-radius: 10px;
            transition: color 0.15s ease, border-color 0.15s ease;
          }

          .card:hover,
          .card:focus,
          .card:active {
            color: #0070f3;
            border-color: #0070f3;
          }

          .card h3 {
            margin: 0 0 1rem 0;
            font-size: 1.5rem;
          }

          .card p {
            margin: 0;
            font-size: 1.25rem;
            line-height: 1.5;
          }

          .logo {
            height: 1em;
          }

          @media (max-width: 600px) {
            .grid {
              width: 100%;
              flex-direction: column;
            }
          }
        `}</style>
        <style jsx global>{`
          html,
          body {
            padding: 0;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
          }

          * {
            box-sizing: border-box;
          }
        `}</style>
      </div>
  )
}


export async function getServerSideProps(context) {
  let connection = await connectToDatabase();

  const {cluster, bucket, collection} = connection;

  // Check connection with a KV GET operation for a key that doesnt exist
  let isConnected = false;
  try {
    await collection.get('testingConnectionKey');
  } catch (err) {
    // error message will return 'document not found' if and only if we are connected
    // (but this document is not present, we're only trying to test the connection here)
    if (err.message === 'document not found') {
      isConnected = true;
    }
    // if the error message is anything OTHER THAN 'document not found', the connection is broken
  }

  let result, rows = null;
  if (isConnected && bucket._name === 'travel-sample') {
    let qs = `SELECT * FROM \`travel-sample\` WHERE type = "airline" LIMIT 5;`
    try {
      result = await cluster.query(qs);
      rows = result.rows;
    } catch (e) {
      console.log('Error Querying: \n', e);
    }
  }

  const hotelsResponse = await client.query({
    query: gql`
      query Hotels {
        hotels {
          id
          name
          address
          phone
        }
      }
    `
  })

  const bookingsResponse = await client.query({
    query: gql`
      query Bookings {
        bookings {
          id
          startDate
          endDate
          hotelDetails {
            name
          }
        }
      }
    `
  })


  return {
    props: {
      hotels: hotelsResponse.data.hotels,
      bookings: bookingsResponse.data.bookings
    },
  }
}
