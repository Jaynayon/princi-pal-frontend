// React imports
import React, { useState, useEffect } from 'react';

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

// Custom imports
import { VerticalLine } from './DisplayItems';
import { useNavigationContext } from '../../Context/NavigationProvider';

//Static object testing
const User = {
    name: 'Jay Nayon',
    email: 'jay.nayonjr@cit.edu',
    schools: [
        'Jaclupan ES', 'Talisay ES'
    ]
}

export default function DisplaySchools() {
    const theme = useTheme();
    const { open, toggleDrawer, prevOpen, selected, setSelected } = useNavigationContext();
    const [openSub, setOpenSub] = useState(false);

    useEffect(() => {
        if (!open) {
            setOpenSub(false)
        }
    }, [open])

    const handleClick = () => {
        setOpenSub(!openSub);
        if (prevOpen && User.schools.length > 1) { //This feature only applies to users with multiple schools
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

    return (
        User.schools.length > 0 ? //Check if user has schools assigned
            (User.schools.length > 1 ? //Check if user has multiple schools
                <React.Fragment>
                    <ListItemButton
                        sx={theme.navStyle.button}
                        onClick={handleClick}
                        selected={User.schools.length > 1 ?
                            !open ? selectSchool() : false
                            : selected === User.schools[0]
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
                                {User.schools.map((item, index) => {
                                    return (
                                        <ListItemButton
                                            key={index}
                                            component={Link}
                                            to={'/schools'}
                                            selected={selected === item}
                                            onClick={() => { setSelected(item) }}
                                            sx={theme.navStyle.button}
                                        >
                                            <ListItemText
                                                primary={item}
                                                primaryTypographyProps={{
                                                    ...styles.text,
                                                    ...(selected === item
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
                        to={'/schools'}
                        sx={theme.navStyle.button}
                        selected={selected === User.schools[0]}
                        onClick={() => { setSelected(User.schools[0]) }}
                    >
                        <ListItemIcon
                            sx={{
                                width: 'auto',
                                minWidth: '40px'
                            }}
                        >
                            <SchoolIcon sx={{
                                ...styles.icon,
                                color: selected === User.schools[0] ? theme.navStyle.bold : theme.navStyle.color
                            }}
                            />
                        </ListItemIcon>
                        <ListItemText
                            primary={"School"}
                            primaryTypographyProps={
                                selected === User.schools[0]
                                    ? { color: theme.navStyle.bold, fontWeight: 'bold' }
                                    : { color: theme.navStyle.color }
                            }
                        />
                    </ListItemButton>
                </React.Fragment>
            ) : null //return nothing, or skip if no schools assigned to user
    )
}

