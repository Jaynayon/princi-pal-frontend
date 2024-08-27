import React from 'react';
import {
    Paper,
    Tabs,
    Tab,
    Box,
    Modal,
    Backdrop,
    Fade,
    Button,
} from '@mui/material';

import { useSchoolContext } from '../../Context/SchoolProvider';
// import { useNavigationContext } from '../../Context/NavigationProvider';

import { CustomTabPanel, a11yProps } from '../../Pages/SchoolPage';
import BudgetTab from './BudgetTab';
import AnnualTab from './AnnualTab';
import UACSTab from './UACSTab';

export default function BudgetModal() {
    const { month, year, currentDocument, jev } = useSchoolContext();
    const [open, setOpen] = React.useState(false);
    const [tab, setTab] = React.useState(0);

    const handleOpen = () => setOpen(true);

    const handleClose = () => setOpen(false);

    const handleChangeTab = (event, newTab) => {
        setTab(newTab);
    };

    React.useEffect(() => {
        // Disable and set to first tab if document/jev not initialized
        if (Array.isArray(jev) && jev.length === 0 && tab === 1) {
            setTab(0);
            // setPage(0);
        }
    }, [currentDocument, month, year, jev, tab, setTab]) // Add month and year as dependency to reload component

    return (
        <Box aria-hidden="true">
            <Button
                aria-hidden="true"
                sx={[{ minWidth: "90px" }, open && { fontWeight: 'bold' }]}
                onClick={handleOpen}
            >
                Budget
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
            >
                <Fade in={open}>
                    <Paper sx={[styles.paper, { paddingTop: 3 }]}>
                        <Box>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs
                                    sx={{ minHeight: '10px' }}
                                    value={tab}
                                    onChange={handleChangeTab}
                                    aria-label="basic tabs example"
                                >
                                    <Tab sx={styles.tab} label="Budget" {...a11yProps(0)} />
                                    <Tab
                                        sx={styles.tab}
                                        label="UACS"
                                        {...a11yProps(1)}
                                        disabled={(Array.isArray(jev) && jev.length === 0)}
                                    />
                                    <Tab sx={styles.tab} label="Annual" {...a11yProps(2)} />
                                </Tabs>
                            </Box>
                            <CustomTabPanel value={tab} index={0}>
                                <BudgetTab handleClose={handleClose} />
                            </CustomTabPanel>
                            <CustomTabPanel value={tab} index={1}>
                                <UACSTab />
                            </CustomTabPanel>
                            <CustomTabPanel value={tab} index={2}>
                                <AnnualTab />
                            </CustomTabPanel>
                        </Box>
                    </Paper>
                </Fade>
            </Modal>
        </Box>
    );
}

const styles = {
    tab: {
        minHeight: '10px',
        '&.Mui-selected': {
            color: 'black', // Color of selected tab
            fontWeight: 'bold', // Font weight of selected tab
        },
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: 24,
        p: 4.5,
        width: 400,
        borderRadius: '15px',
    }
}
