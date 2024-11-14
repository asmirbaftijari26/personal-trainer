import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { saveTraining } from '../../trainingapi'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { fetchCustomers } from '../../customerapi';

 
export default function AddTraining(props) {
  const [open, setOpen] = useState(false);
  const [training, setTraining] = useState({
    date: null,
    activity: "",
    duration: "",
    customer: props.customerHref
  })

  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    handleFetch();
  }, []);

  const handleFetch = () => {
    fetchCustomers()
    .then(data => setCustomers(data._embedded.customers))
    .catch(err => console.error(err))
  }

  const handleClickOpen = () => {
    if (props.customerHref) {
      setTraining(prevTraining => ({
        ...prevTraining,
        customer: props.customerHref
      }));
    }
    setOpen(true);
  };
 
  const handleClose = () => {
    setOpen(false);
  };
 
  const handleChange = (event) => {
    setTraining({...training, [event.target.name]: event.target.value });
  }

  const handleDateChange = (newDate) => {
    setTraining({ ...training, date: newDate });
  };
 
  const handleSave = (event) => {

    const formattedDate = training.date ? dayjs(training.date).toISOString() : null;
    
    const newTraining = {
      date: formattedDate,
      activity: training.activity,
      duration: training.duration,
      customer: training.customer
  };

    saveTraining(newTraining)
    .then(() => {
        props.handleFetch();
        if (props.onAdd) props.onAdd();
        handleClose()
    }) 
    .catch(err => console.error(err))
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Button variant="outlined" onClick={handleClickOpen} endIcon={<PlaylistAddIcon />}>
        Add Training
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Add Training</DialogTitle>
        <DialogContent>
        <DateTimePicker
            label="Date & Time"
            value={training.date}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} fullWidth margin="dense" variant="standard" />}
          />
          <TextField
            margin="dense"
            name="activity"
            label="Activity"
            onChange={handleChange}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            name="duration"
            label="Duration"
            onChange={handleChange}
            fullWidth
            variant="standard"
          />
          <FormControl fullWidth margin="dense" variant="standard">
            <InputLabel id="customer-select-label">Customer</InputLabel>
            <Select
              labelId="customer-select-label"
              name="customer"
              value={training.customer}
              onChange={handleChange}
              label="Customer"
            >
              {customers.map((customer) => (
                <MenuItem key={customer._links.self.href} value={customer._links.self.href}>
                  {`${customer.firstname} ${customer.lastname}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}