// React imports
import React, { useEffect } from 'react';

// Material-UI imports
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from "@mui/material/Collapse";
import SchoolIcon from '@mui/icons-material/School';
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Link } from 'react-router-dom';
import { transformSchoolText } from './Navigation';

// Custom imports
import { VerticalLine } from './DisplayItems';
import { useNavigationContext } from '../../Context/NavigationProvider';

export default function DisplaySchools() {
    const theme = useTheme();
    const { open, toggleDrawer, prevOpen, selected, setSelected, setCurrentSchool, currentUser, openSub, setOpenSub } = useNavigationContext();

    useEffect(() => {
        // initializeSchool();
        if (!open) {
            setOpenSub(false);
        }
    }, [open, setOpenSub]);

    const transformSchoolNameText = (text) => {
        return text.toLowerCase().replace(/\s+/g, '-');
    }

    const handleSelectedSingle = () => {
        setSelected(currentUser.schools[0].name)
        setCurrentSchool(currentUser.schools[0]);
    }

    const handleSelectedMultiple = (index) => {
        setSelected(currentUser.schools[index].name);
        setCurrentSchool(currentUser.schools[index]);
    }

    const handleClick = () => {
        setOpenSub(!openSub);
        if (prevOpen && currentUser.schools.length > 1) { //This feature only applies to users with multiple schools
            toggleDrawer(true)
        }
    };

    //If school is selected, return true
    const selectSchool = () => {
        return !(selected === 'Dashboard' || selected === 'Settings'
            || selected === 'People' || selected === 'Logout');
    }

    const styles = {
        icon: {
            color: theme.navStyle.color,
            fontSize: '19px',
        },
        text: {
            fontSize: '15px'
        },
        iconSelected: {
            color: theme.navStyle.bold,
            fontSize: '19px',
        },
    }

    console.log(currentUser);

    return (
        currentUser && currentUser.schools.length > 0 ? //Check if user has schools assigned
            (currentUser.schools.length > 1 ? //Check if user has multiple schools
                <React.Fragment>
                    <ListItemButton
                        sx={theme.navStyle.button}
                        onClick={handleClick}
                        selected={currentUser.schools.length > 1 ?
                            !open ? selectSchool() : false
                            : selected === currentUser.schools[0].name
                        } //button is only selected if the drawer is closed
                    >
                        <ListItemIcon
                            sx={{
                                width: 'auto',
                                minWidth: '40px'
                            }}
                        >
                            <SchoolIcon
                                sx={{
                                    ...styles.icon,
                                    color: selectSchool() ? theme.navStyle.bold : theme.navStyle.color
                                }}
                            />
                        </ListItemIcon>
                        <ListItemText
                            primary={"School"}
                            primaryTypographyProps={{
                                ...styles.text,
                                ...(selectSchool()
                                    ? { color: theme.navStyle.bold, fontWeight: 'bold' }
                                    : { color: theme.navStyle.color }
                                )
                            }}
                        />
                        {openSub ? <ExpandLess sx={{ color: theme.navStyle.color }} /> : <ExpandMore sx={{ color: theme.navStyle.color }} />}
                    </ListItemButton>
                    <Collapse
                        in={openSub}
                        timeout="auto"
                        unmountOnExit
                    >
                        <Box style={{ display: 'flex' }}>
                            <VerticalLine
                                width='50px'
                                color={theme.navStyle.color}
                            />
                            <List component="div" disablePadding>
                                {currentUser.schools.map((item, index) => {
                                    return (
                                        <ListItemButton
                                            key={index}
                                            component={Link}
                                            to={'/schools/' + transformSchoolNameText(item.name)}
                                            selected={selected === item.name}
                                            onClick={/*() => { setSelected(item.name) }*/() => handleSelectedMultiple(index)}
                                            sx={theme.navStyle.button}
                                        >
                                            <ListItemText
                                                primary={transformSchoolText(item.name)}
                                                primaryTypographyProps={{
                                                    ...styles.text,
                                                    ...(selected === item.name
                                                        ? { color: theme.navStyle.bold, fontWeight: 'bold' }
                                                        : { color: theme.navStyle.color }
                                                    )
                                                }}
                                            />
                                        </ListItemButton>
                                    )
                                })}
                            </List>
                        </Box>
                    </Collapse>
                </React.Fragment> : //If user has only one school
                <React.Fragment>
                    <ListItemButton
                        component={Link}
                        to={'/schools/' + transformSchoolNameText(currentUser.schools[0].name)}
                        sx={theme.navStyle.button}
                        selected={selected === currentUser.schools[0].name}
                        onClick={/*() => { setSelected(currentUser.schools[0].name) }*/() => handleSelectedSingle()}
                    >
                        <ListItemIcon
                            sx={{
                                width: 'auto',
                                minWidth: '40px'
                            }}
                        >
                            <SchoolIcon sx={{
                                ...styles.icon,
                                color: selected === currentUser.schools[0].name ? theme.navStyle.bold : theme.navStyle.color
                            }}
                            />
                        </ListItemIcon>
                        <ListItemText
                            primary={"School"}
                            primaryTypographyProps={
                                selected === currentUser.schools[0].name
                                    ? { color: theme.navStyle.bold, fontWeight: 'bold' }
                                    : { color: theme.navStyle.color }
                            }
                        />
                    </ListItemButton>
                </React.Fragment>
            ) : null //return nothing, or skip if no schools assigned to user
    )
}

