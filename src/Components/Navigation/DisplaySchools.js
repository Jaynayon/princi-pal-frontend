import React, { useState } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SchoolIcon from '@mui/icons-material/School';
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import List from '@mui/material/List';
import { styles, VerticalLine } from './ListItems'

export default function DisplaySchools({ selected, setSelected }) {
    const User = {
        name: 'Jay Nayon',
        email: 'jay.nayonjr@cit.edu',
        schools: [
            'Jaclupan ES',
            'Talisay ES'
        ]
    }

    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };
    return (
        <React.Fragment>
            <ListItemButton sx={styles.button} onClick={handleClick} >
                <ListItemIcon sx={{ width: 'auto', minWidth: '40px' }}>
                    <SchoolIcon sx={styles.icon} />
                </ListItemIcon>
                <ListItemText
                    primary={"School"}
                    primaryTypographyProps={open ? styles.typography.school : styles.typography}
                />
                {open ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit >
                <div style={{ display: 'flex' }}>
                    <VerticalLine width='60px' color='white' />
                    <List component="div" disablePadding>
                        {User.schools.map((item, index) => {
                            return (
                                <ListItemButton
                                    key={index}
                                    //component={Link}
                                    //to={index < 5 ? `/${item}` : '/'}
                                    sx={styles.button}
                                    value={item}
                                    selected={selected === item}
                                    onClick={() => { setSelected(item) }}
                                >
                                    <ListItemText
                                        primary={item}
                                        primaryTypographyProps={styles.typography} />
                                </ListItemButton>
                            )
                        })}
                    </List>
                </div>
            </Collapse>
        </React.Fragment>
    )
}

