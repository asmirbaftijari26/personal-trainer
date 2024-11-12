import TrainingList from './components/TrainingList.jsx'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { Css } from '@mui/icons-material';

function App() {
  return (
    <Container maxWidth="xl">
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6'>Personal Trainer</Typography>
        </Toolbar>
      </AppBar>
      <TrainingList/>
      <CssBaseline />
    </Container>
  )
}

export default App;