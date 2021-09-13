import Head from 'next/head'
import {connectToDatabase} from '../util/couchbase'
import { gql } from "@apollo/client";
import {useState} from "react";
import 'semantic-ui-css/semantic.min.css'
import {Button, Tab, Table} from "semantic-ui-react";
import BookingModal from "./components/BookingModal";
import styles from '../styles/Home.module.css'

import client from "../apollo-client";

export default function Home({hotels, bookings}) {
  const [currentBookings, setCurrentBookings] = useState(bookings);

  const handleBookingDeletion = async (event, idToDelete) => {
    event.preventDefault();
    await client.mutate({
      mutation: gql`
        mutation DeleteHotelBookingMutation {
          deleteHotelBooking(id: "${idToDelete}") 
        }
    `
    })

    let filtered = currentBookings.filter((value, index, arr) => {
      return value.id !== idToDelete;
    })
    setCurrentBookings(filtered)
  }

  const addBooking = (newBooking) => {
    let newBookingsArray = [
      ...currentBookings
    ]

    upsert(newBookingsArray, newBooking)

    setCurrentBookings(newBookingsArray)
  }

  function upsert(array, item) {
    const i = array.findIndex(_item => _item.id === item.id);
    if (i > -1) array[i] = item;
    else array.push(item);
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
                { !!hotels &&
                  hotels.map((hotel) => {
                    return (
                        <Table.Row key={hotel.id}>
                          <Table.Cell>{hotel.name}</Table.Cell>
                          <Table.Cell>{hotel.address}</Table.Cell>
                          <Table.Cell>{hotel.phone}</Table.Cell>
                          <Table.Cell><BookingModal hotelId={hotel.id} onCreateBooking={addBooking}/></Table.Cell>
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
                { !!currentBookings &&
                currentBookings.map((booking) => {
                  return (
                      <Table.Row key={booking.id}>
                        <Table.Cell>{booking.hotelDetails.name}</Table.Cell>
                        <Table.Cell>{booking.startDate}</Table.Cell>
                        <Table.Cell>{booking.endDate}</Table.Cell>
                        <Table.Cell>
                          <Button.Group>
                            <BookingModal hotelId={booking.hotelDetails.id} onCreateBooking={addBooking} bookingRecord={booking}/>
                            <Button.Or/>
                            <Button negative onClick={(e) => handleBookingDeletion(e, booking.id)}>Cancel</Button>
                          </Button.Group>
                        </Table.Cell>
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
      <div className={styles.container}>
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico"/>
        </Head>

        <main className={styles.main}>
          <Tab panes={panes}></Tab>
        </main>

        <footer className={styles.footer}>
          <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
          >
            Powered by{' '}
            <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo}/>
          </a>
        </footer>
      </div>
  )
}


export async function getServerSideProps(context) {
  let connection = await connectToDatabase();

  const {cluster, bucket, collection} = connection;


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
            name,
            id
          }
        }
      }
    `
  })

  // console.log(bookingsResponse.data.bookings);


  return {
    props: {
      hotels: hotelsResponse.data.hotels,
      bookings: bookingsResponse.data.bookings
    },
  }
}
