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




const DemoPaper = styled(Paper)(({ theme }) => ({
  width: 1200,
  height: 650,
  padding: theme.spacing(2),
  ...theme.typography.body2,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative', // Added to make the button positioning relative to the parent
}));

const DivContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  position: 'relative', // Added to make the button positioning relative to the parent
});

const AvatarContainer = styled('div')({
  position: 'relative',
  flexDirection: 'column',
  marginRight: '730px',
  marginBottom: '280px',
  letterSpacing: '2px',
});

const TextFieldWrapper = styled('div')({
  position: 'absolute',
  alignItems: 'center',
  marginLeft: '440px',
  marginBottom: '100px',
});

const FabWrapper = styled('div')({
  position: 'absolute',
  top: 90,
  right: 0,
});

const ButtonWrapper = styled('div')({
  position: 'absolute',
  bottom: '50px', // Adjust as needed
  right: '80px', // Adjust as needed
});

function Settings() {
  return (
    <DemoPaper square={false}>
      <DivContainer>
        <AvatarContainer>
          <Avatar sx={{ bgcolor: blue[500], width: 130, height: 130, marginLeft: '10px', marginBottom: '15px' }}>J</Avatar>
          <FabWrapper>
            <Fab size="small" color="black" aria-label="add">
              <AddIcon />
            </Fab>
          </FabWrapper>
          <Typography variant="h6" fontWeight="bold">Jay Nayon Jr.</Typography>
          <Typography variant="h8" fontWeight="bold">ADAS</Typography>
        </AvatarContainer>
        <TextFieldWrapper>
          <TextField disabled id="outlined-disabled" label="Fullname" defaultValue="Fullname" margin="normal" />
          <TextField disabled id="outlined-disabled" label="Email" defaultValue="name@email.com" margin="normal" />
          <TextField disabled id="outlined-disabled" label="Phone Number" defaultValue="0987 867 9876" margin="normal" />
          <TextField required id="outlined-required" label="Password" margin="normal" />
          <TextField required id="outlined-required" label="Re-Type Password" margin="normal" />
        </TextFieldWrapper>
      </DivContainer>
      <ButtonWrapper>
        <Button variant="contained">Save</Button>
      </ButtonWrapper>
    </DemoPaper>
  );
}

export default Settings;
