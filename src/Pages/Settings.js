import * as React from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import { blue } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

const DemoPaper = styled(Paper)(({ theme }) => ({
  //width: 1200, adjust automatically
  //height: 650,
  padding: theme.spacing(2),
  ...theme.typography.body2,
  width: '100%',
  height: '100%',
  display: 'flex',
  position: 'relative', // Added to make the button positioning relative to the parent
}));

const DivContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'relative', // Added to make the button positioning relative to the parent
});

const AvatarContainer = styled('div')({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  letterSpacing: '2px',
});

const TextFieldWrapper = styled('div')({
  //position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
  //marginLeft: '440px',
  //marginBottom: '100px',
});

const FabWrapper = styled('div')({
  position: 'relative',
  marginTop: -40,
  marginLeft: 80
});

const ButtonWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  width: '100%',
  marginTop: '20px'
  //bottom: '50px', // Adjust as needed
  //right: '80px', // Adjust as needed
});

function Settings() {
  return (
    <Container className="test" maxWidth="lg" sx={{ /*mt: 4,*/ mb: 4 }}>
      <DemoPaper square={false}>
        <Grid container>
          <Grid item xs={12} md={6} lg={6} sx={{ padding: '10px' }}>
            <AvatarContainer>
              <Avatar sx={{ bgcolor: blue[500], width: 130, height: 130, marginBottom: '15px' }}>J</Avatar>
              <FabWrapper>
                <Fab size="small" color="black" aria-label="add">
                  <AddIcon />
                </Fab>
              </FabWrapper>
              <Typography variant="h6" fontWeight="bold">Jay Nayon Jr.</Typography>
              <Typography variant="h8" fontWeight="bold">ADAS</Typography>
            </AvatarContainer>
          </Grid>
          <Grid item xs={12} md={6} lg={6} sx={{ padding: '10px' }}>
            <TextFieldWrapper>
              <TextField sx={{ width: '100%' }} disabled id="outlined-disabled" label="Fullname" defaultValue="Fullname" margin="normal" />
              <TextField sx={{ width: '100%' }} disabled id="outlined-disabled" label="Email" defaultValue="name@email.com" margin="normal" />
              <TextField sx={{ width: '100%' }} disabled id="outlined-disabled" label="Phone Number" defaultValue="0987 867 9876" margin="normal" />
              <TextField sx={{ width: '100%' }} required id="outlined-required" label="Password" margin="normal" />
              <TextField sx={{ width: '100%' }} required id="outlined-required" label="Re-Type Password" margin="normal" />
            </TextFieldWrapper>
            <ButtonWrapper>
              <Button variant="contained">Save</Button>
            </ButtonWrapper>
          </Grid>
        </Grid>
      </DemoPaper>
    </Container>

  );
}

export default Settings;
