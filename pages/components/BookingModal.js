import React, {useCallback} from 'react';
import {Button, Form, Modal} from "semantic-ui-react";
import client from "../../apollo-client";
import {gql} from "@apollo/client";

const BookingModal = (props) => {
  const [open, setOpen] = React.useState(false);

  const updateCurrentBookingsState = useCallback((param) => {
    props.onCreateBooking(param);
  }, [props.onCreateBooking])

  const handleBooking = async (event) => {
    event.preventDefault();
    setOpen(false);

    const startDate = document.getElementById('checkInField').value !== '' ? document.getElementById('checkInField').value : props.bookingRecord.startDate
    const endDate = document.getElementById('checkOutField').value !== '' ? document.getElementById('checkOutField').value : props.bookingRecord.endDate
    const hotelId = props.hotelId;

    if (!props.bookingRecord) { // create new booking record
      let result = await client.mutate({
        mutation: gql`
        mutation CreateHotelBookingMutation {
          createHotelBooking(startDate: "${startDate}", endDate: "${endDate}", hotelId: ${hotelId}) {
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

      updateCurrentBookingsState(result.data.createHotelBooking);
    } else { // update existing booking record
      let result = await client.mutate({
        mutation: gql`
        mutation UpdateHotelBookingMutation {
          updateHotelBooking(startDate: "${startDate}", endDate: "${endDate}", id: "${props.bookingRecord.id}") {
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

      updateCurrentBookingsState(result.data.updateHotelBooking);
    }
  }

  return (
      <Modal
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          trigger={props.bookingRecord ? <Button primary>Modify</Button> : <Button>Book</Button>}
      >
        {!props.bookingRecord ?
            <Modal.Header>Book Now</Modal.Header>
            :
            <Modal.Header>Update Booking</Modal.Header>
        }


        <Modal.Content>
          <Form>
            <Form.Group widths='equal'>
              <Form.Input fluid label='Check In' placeholder={props.bookingRecord ? props.bookingRecord.startDate : 'Check In Date'} id='checkInField' />
              <Form.Input fluid label='Check Out' placeholder={props.bookingRecord ? props.bookingRecord.endDate : 'Check Out Date'} id='checkOutField' />
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
              content="Confirm Booking"
              labelPosition='right'
              icon='checkmark'
              onClick={handleBooking}
              positive
          />
        </Modal.Actions>
      </Modal>
  )

}

export default BookingModal;
