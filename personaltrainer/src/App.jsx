import TrainingList from './components/TrainingList.jsx'
import CustomersList from './components/CustomersList.jsx'
import Calendar from './components/Calendar.jsx'
import Statistics from './components/Statistics.jsx';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

function App() {

  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <CssBaseline />
      <Container maxWidth="xlg">
        <AppBar position='static'>
          <Toolbar>
            <Typography variant='h4'>
              Personal Trainer Platform
            </Typography>
          </Toolbar>
        </AppBar>

        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange}>
              <Tab label="TRAININGS" value="1" />
              <Tab label="CUSTOMERS" value="2" />
              <Tab label="CALENDAR" value="3" />
              <Tab label="STATISTICS" value="4" />
            </TabList>
          </Box>

          <TabPanel value="1">
            <TrainingList />
          </TabPanel>

          <TabPanel value="2">
            <CustomersList />
          </TabPanel>

          <TabPanel value="3">
            <Calendar />
          </TabPanel>

          <TabPanel value="4">
            <Statistics />
          </TabPanel>
        </TabContext>
      </Container>
    </Box>
  );
}

export default App;