import React from 'react';
import {Button, Form, Modal} from "semantic-ui-react";
import client from "../../apollo-client";
import {gql} from "@apollo/client";

const BookingModal = (props) => {
  const [open, setOpen] = React.useState(false);

  const handleBooking = async (event) => {
    event.preventDefault();
    setOpen(false);


    const startDate = document.getElementById('checkInField').value
    const endDate = document.getElementById('checkOutField').value
    const hotelId = props.hotelId;

    await client.mutate({
      mutation: gql`
        mutation CreateHotelBookingMutation {
          createHotelBooking(startDate: "${startDate}", endDate: "${endDate}", hotelId: ${hotelId}) {
           id
          }
        }
    `
    })
  }

  return (
      <Modal
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          trigger={<Button>Book</Button>}
      >
        <Modal.Header>Book Now</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Group widths='equal'>
              <Form.Input fluid placeholder='Check In Date' id='checkInField'/>
              <Form.Input fluid placeholder='Check Out Date' id='checkOutField'/>
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
