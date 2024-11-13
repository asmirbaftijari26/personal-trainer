import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { saveCustomer } from '../../customerapi'
 
export default function AddCustomer(props) {
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    streetaddress:"",
    postcode:"",
    city:""
  })
 
  const handleClickOpen = () => {
    setOpen(true);
  };
 
  const handleClose = () => {
    setOpen(false);
  };
 
  const handleChange = (event) => {
    setCustomer({...customer, [event.target.name]: event.target.value });
  }
 
  const handleSave = (event) => {
    saveCustomer(customer)
    .then(() => {
        props.handleFetch();
        handleClose()
    }) 
    .catch(err => console.error(err))
  }

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Customer
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Add Customer</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="firstname"
            label="Firstname"
            value={customer.firstname}
            onChange={handleChange}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            name="lastname"
            label="Lastname"
            value={customer.lastname}
            onChange={handleChange}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            name="email"
            label="E-Mail"
            value={customer.email}
            onChange={handleChange}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone Nr."
            value={customer.phone}
            onChange={handleChange}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            name="streetaddress"
            label="Address"
            value={customer.streetaddress}
            onChange={handleChange}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            name="postcode"
            label="Postcode"
            value={customer.postcode}
            onChange={handleChange}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            name="city"
            label="City"
            value={customer.city}
            onChange={handleChange}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}