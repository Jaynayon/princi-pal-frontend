import * as React from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import { blue } from '@mui/material/colors';
import { lightGreen } from '@mui/material/colors';
import { red } from '@mui/material/colors';
import { grey } from '@mui/material/colors';
import { blueGrey } from '@mui/material/colors';
import { deepPurple } from '@mui/material/colors';
import { brown } from '@mui/material/colors';
import { deepOrange } from '@mui/material/colors';
import { yellow } from '@mui/material/colors';
import { indigo } from '@mui/material/colors';
import { pink } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import {
    VisibilityOff as VisibilityOffIcon,
    Lock as LockIcon,
    Person as PersonIcon,
    Email as EmailIcon,
  } from '@mui/icons-material';
//import RestService from '../Services/RestService'
import { useNavigationContext } from '../Context/NavigationProvider';

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
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { currentUser } = useNavigationContext()

    if (!currentUser) {
        return null
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleColorChange = (color) => {
        setAnchorEl(null);
        handleClick(false);
        currentUser.avatar = color;
    };
    
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <Container className="test" maxWidth="lg" sx={{ /*mt: 4,*/ mb: 4 }}>
            <DemoPaper square={false}>
                <Grid container>
                    <Grid item xs={12} md={6} lg={6} sx={{ padding: '10px' }}>
                        <AvatarContainer>
                        <Avatar sx={{ bgcolor: currentUser.avatar, width: 130, height: 130, marginBottom: '15px' }} > </Avatar>
                            <FabWrapper>
                                <Fab size="small" color="black" aria-label="add">
                                    <AddIcon aria-describedby={id} variant="contained" onClick={handleClick} />
                                    <Popover
                                        id={id}
                                        open={open}
                                        anchorEl={anchorEl}
                                        onClose={handleClose}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                        PaperProps={{
                                            style: {
                                                width: '220px', // Adjust width as needed
                                                maxHeight: '300px', // Adjust height as needed
                                            },
                                        }}
                                    >
                                        <Typography sx={{ p: 2 }}>Avatar colors</Typography>
                                        <Stack direction="row" spacing={1} sx={{ p: 2 }}>
                                        {[lightGreen[500], red[500], grey[900], blueGrey[500], deepPurple[500]].map((color, index) => (
                                            <Avatar
                                                key={index}
                                                sx={{ bgcolor: color, width: 30, height: 30, cursor: 'pointer' }}
                                                onClick={() => handleColorChange(color)}
                                            > </Avatar>
                                        ))}
                                    </Stack>
                                    <Stack direction="row" spacing={1} sx={{ p: 2 }}>
                                        {[brown[500], deepOrange[500], yellow[500], indigo[500], pink[500]].map((color, index) => (
                                            <Avatar
                                                key={index}
                                                sx={{ bgcolor: color, width: 30, height: 30, cursor: 'pointer' }}
                                                onClick={() => handleColorChange(color)}
                                            > </Avatar>
                                        ))}
                                    </Stack>
                                    </Popover>
                                </Fab>
                            </FabWrapper>
                            <Typography variant="h6" fontWeight="bold">{currentUser.fname + " " + currentUser.lname}</Typography>
                            <Typography variant="h8" fontWeight="bold">{currentUser.position}</Typography>
                        </AvatarContainer>
                    </Grid>
                    <Grid item xs={12} md={6} lg={5.5} sx={{ padding: '2px' }}>
                        <TextFieldWrapper>
                        <TextField sx={{ width: '100%' }} disabled id="outlined-disabled" label="Email" defaultValue={currentUser.email} margin="normal"
                                    InputProps={{
                                        startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon />
                                        </InputAdornment>
                                        ),
                                    }}
                                    />
                            <TextField sx={{ width: '100%' }} disabled id="outlined-disabled" label="Username" defaultValue={currentUser.username} margin="normal" 
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon />
                                    </InputAdornment>
                                    ),
                                }}/>
                            <TextField sx={{ width: '100%' }} disabled id="outlined-disabled" label="First Name" defaultValue={currentUser.fname + " " } margin="normal" 
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon />
                                    </InputAdornment>
                                    ),
                                }}/>
                            <TextField sx={{ width: '100%' }} disabled id="outlined-disabled" label="Middle Name" defaultValue={currentUser.mname + " " } margin="normal" 
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon />
                                    </InputAdornment>
                                    ),
                                }}/>
                            <TextField sx={{ width: '100%' }} disabled id="outlined-disabled" label="Last Name" defaultValue={currentUser.lname} margin="normal" 
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon />
                                    </InputAdornment>
                                    ),
                                }}/>
                            <TextField sx={{ width: '100%' }} required id="outlined-required" label="Password" margin="normal" 
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon />
                                    </InputAdornment>
                                    ),
                                }}/>
                            <TextField sx={{ width: '100%' }} required id="outlined-required" label="Re-Type Password" margin="normal" 
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon />
                                    </InputAdornment>
                                    ),
                                }}/>
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