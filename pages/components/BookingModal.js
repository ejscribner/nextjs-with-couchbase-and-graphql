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
        <Modal.Header>Book Now</Modal.Header>
        {/*TODO: bok now or modify based on if bookingRecord is null*/}
        <Modal.Content>
          <Form>
            <Form.Group widths='equal'>
              <label>{props.bookingRecord ? props.bookingRecord.startDate : ''}</label>
              <Form.Input fluid placeholder='Check In Date' id='checkInField' />
              <label>{props.bookingRecord ? props.bookingRecord.endDate : ''}</label>
              <Form.Input fluid placeholder='Check Out Date' id='checkOutField' initialValue={props.bookingRecord ? props.bookingRecord.endDate : ''}/>
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
