import React from 'react';
import {Button, Modal} from "semantic-ui-react";

const BookingModal = (props) => {
  const [open, setOpen] = React.useState(false);

  return (
      <Modal
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          trigger={<Button>Book</Button>}
      >
        <Modal.Header>Book Now</Modal.Header>
        <Modal.Content>Hello world</Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
              content="Confirm Booking"
              labelPosition='right'
              icon='checkmark'
              onClick={() => setOpen(false)}
              positive
          />
        </Modal.Actions>
      </Modal>
  )

}

export default BookingModal;
