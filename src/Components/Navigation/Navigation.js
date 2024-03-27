import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import { DisplayItems, ProfileTab } from './ListItems';
import { useNavigationContext } from '../../Context/NavigationProvider'

const User = {
    name: 'Jay Nayon',
    email: 'jay.nayonjr@cit.edu'
}

const drawerWidth = 220;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7.7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(7.7),
                },
            }),
        },
    }),
);

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Navigation({ children }) {
    const { open, toggleDrawer } = useNavigationContext();
    /*const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };*/
    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}
                    sx={{
                        boxShadow: 'none',
                        backgroundColor: 'transparent',
                        paddingTop: '10px'
                    }}>
                    <Toolbar
                        sx={{
                            pr: '24px', // keep right padding when drawer closed
                            "& .MuiToolbar-root": {
                                backgroundColor: 'green',
                            }
                        }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{
                                flexGrow: 1,
                                textAlign: 'left',
                                color: '#252733',
                                fontFamily: 'Mulish-Bold'
                            }}>
                            Dashboard
                        </Typography>
                        <IconButton color="inherit" sx={{ color: '#C5C7CD' }}>
                            <SearchIcon />
                        </IconButton>
                        <IconButton color="inherit" sx={{ color: '#C5C7CD' }}>
                            <Badge badgeContent={4} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent"
                    open={open}
                    sx={{
                        "& .MuiDrawer-paper": {
                            backgroundColor: '#4A99D3',
                            boxShadow: 'none',
                            borderRight: 'none'
                        }
                    }}>
                    <Toolbar
                        sx={{
                            //display: 'flex',
                            //alignItems: 'center',
                            //justifyContent: 'space-between',
                            px: [0.5],
                            paddingTop: '10px',
                            ...(!open && { visibility: 'hidden' }),
                        }}
                    >
                        <ProfileTab user={User} />
                        <IconButton
                            onClick={toggleDrawer}
                            sx={{ justifyContent: 'flex-end' }}
                        >
                            <ChevronLeftIcon sx={{ color: 'white' }} />
                        </IconButton>
                    </Toolbar>
                    <List component="nav" >
                        <DisplayItems />
                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar />
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        <Grid container spacing={3}>
                            {children}
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}