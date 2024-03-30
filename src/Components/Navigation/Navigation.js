// React imports
import * as React from 'react';

// Material-UI imports
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

// Custom imports
import { styling } from './styling';
import { DisplayItems, ProfileTab } from './ListItems';
import { useNavigationContext } from '../../Context/NavigationProvider';
import CustomizedSwitches from './CustomizedSwitches';

//Static object testing
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

const displayTitle = (selected) => {
    if (selected === 'Dashboard' || selected === 'Settings' || selected === 'People' || selected === 'Logout') {
        return selected; // Return selected if it matches any of the specified values
    }

    return (
        <>
            <span>School </span>
            <span style={{ color: 'grey' }}>({selected})</span>
        </>
    );
}



export default function Navigation({ children }) {
    const { open, toggleDrawer, selected, navStyle } = useNavigationContext();

    const defaultTheme = createTheme({
        typography: {
            fontFamily: 'Mulish'
        },
        navStyle: styling[navStyle] //default or light
    });

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar
                    position="absolute"
                    open={open}
                    sx={{
                        boxShadow: 'none',
                        backgroundColor: 'transparent',
                        paddingTop: '10px'
                    }}
                >
                    <Toolbar
                        sx={{
                            pr: '24px', // keep right padding when drawer closed
                            color: '#C5C7CD'//gets inherited
                        }}
                    >
                        <IconButton
                            edge="start"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                color: (theme) => theme.navStyle.color,
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
                                fontWeight: 'bold'
                            }}
                        >
                            {displayTitle(selected)}
                        </Typography>
                        <IconButton color="inherit" >
                            <SearchIcon />
                        </IconButton>
                        <IconButton color="inherit" >
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
                            backgroundColor: (theme) => theme.navStyle.base,
                            boxShadow: 'none',
                            borderRight: 'none'
                        }
                    }}>
                    <Toolbar
                        sx={{
                            px: [0.5],
                            paddingTop: '10px',
                            ...(!open && { visibility: 'hidden' }),
                        }}
                    >
                        <ProfileTab user={User} />
                        <IconButton
                            onClick={toggleDrawer}
                            sx={{
                                justifyContent: 'flex-end',
                                color: (theme) => theme.navStyle.color
                            }}
                        >
                            <ChevronLeftIcon color='inherit' />
                        </IconButton>
                    </Toolbar>
                    <List
                        component="nav"
                        sx={{
                            marginRight: '5px',
                            marginLeft: '5px',
                            paddingTop: '5px',
                            marginTop: '5px',
                        }}
                    >
                        <DisplayItems />
                    </List>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end', // Align items at the bottom
                        height: '100%',
                        marginBottom: '20px'
                    }}>
                        <CustomizedSwitches />
                    </Box>

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
