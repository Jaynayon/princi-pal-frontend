// React imports
import React, { useState, useEffect } from 'react';

// Material-UI imports
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from "@mui/material/Collapse";
import SchoolIcon from '@mui/icons-material/School';
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Link } from 'react-router-dom';

// Custom imports
import { styles, VerticalLine } from './ListItems';
import { useNavigationContext } from '../../Context/NavigationProvider';

//Static object testing
const User = {
    name: 'Jay Nayon',
    email: 'jay.nayonjr@cit.edu',
    schools: [
        'Jaclupan ES',
        'Talisay ES'
    ]
}

export default function DisplaySchools() {
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
    return (
        User.schools.length > 1 ? //Check if user has multiple schools
            <React.Fragment>
                <ListItemButton
                    sx={styles.button}
                    onClick={handleClick}
                >
                    <ListItemIcon
                        sx={{
                            width: 'auto',
                            minWidth: '40px'
                        }}
                    >
                        <SchoolIcon sx={styles.icon} />
                    </ListItemIcon>
                    <ListItemText
                        primary={"School"}
                        primaryTypographyProps={
                            openSub ?
                                { ...styles.typography, fontWeight: 'bold' } :
                                styles.typography
                        }
                    />
                    {openSub ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
                </ListItemButton>
                <Collapse
                    in={openSub}
                    timeout="auto"
                    unmountOnExit
                >
                    <Box style={{ display: 'flex' }}>
                        <VerticalLine
                            width='50px'
                            color='white'
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
                                        sx={styles.button}
                                    >
                                        <ListItemText
                                            primary={item}
                                            primaryTypographyProps={
                                                selected === item ?
                                                    { ...styles.typography, fontWeight: 'bold' } :
                                                    styles.typography
                                            }
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
                    sx={styles.button}
                    selected={selected === 'School'}
                    onClick={() => { setSelected('School') }}
                >
                    <ListItemIcon
                        sx={{
                            width: 'auto',
                            minWidth: '40px'
                        }}
                    >
                        <SchoolIcon sx={styles.icon} />
                    </ListItemIcon>
                    <ListItemText
                        primary={"School"}
                        primaryTypographyProps={openSub ? styles.typography.school : styles.typography}
                    />
                </ListItemButton>
            </React.Fragment>
    )
}

