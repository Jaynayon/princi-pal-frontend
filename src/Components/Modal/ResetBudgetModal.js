import React from 'react';
import {
    Paper,
    Box,
    Modal,
    Backdrop,
    Fade,
    Typography,
    Button,
    InputAdornment,
    TextField,
    Stack,
    Select,
    MenuItem
} from '@mui/material';
import BudgetResetConfirmModal from './BudgetResetConfirmModal';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
        },
    },
};

function getStyles(item, selectedValue) {
    return {
        fontWeight: "600",
        color:
            Number(item) === Number(selectedValue)
                ? "#176AF6"
                : null
    };
}

// Initialize current date to get current month and year
const currentDate = new Date();
const currentYear = currentDate.getFullYear(); // Get full year as string

// Dynamic year starting from year 2024
const startYear = 2024;
const years = Array.from({ length: (currentYear + 1) - startYear + 1 }, (_, i) => (startYear + i).toString());

const ResetBudgetModal = React.memo(({ open, handleClose, handleMenuClose, currentSchool }) => {
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [value, setValue] = React.useState(currentYear);
    const [input, setInput] = React.useState(0);
    const [isClicked, setIsClicked] = React.useState(false);

    const handleConfirmClose = () => setConfirmOpen(false);

    const handleConfirmOpen = () => setConfirmOpen(true);

    const handleCloseModals = () => {
        handleClose();
        handleMenuClose();
    };

    const handleChangeSelection = (event) => {
        const {
            target: { value },
        } = event;

        setValue(
            // On autofill we get a stringified value.
            typeof value === 'string' ? Number(value) : value,
        );
    };

    const handleInputChange = (event) => {
        let modifiedValue = event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        setInput(modifiedValue);
    }

    const handleInputClick = () => { setIsClicked(true) }

    const handleInputBlur = () => { setIsClicked(false) }

    const formatNumberDisplay = (number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number);
    }

    const formatAnnualNumberDisplay = (number) => {
        if (isClicked) { return number > 0 ? number : ""; }
        return formatNumberDisplay(number);
    }

    return (
        <Box >
            <Modal
                open={open}
                onClose={() => handleCloseModals()}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
            >
                <Fade in={open}>
                    <Paper sx={[styles.paper, { paddingTop: 3 }]}>
                        <Box>
                            <Typography
                                sx={{ color: "#252733" }}
                                variant='h6'
                                component="h1"
                                color="inherit"
                                noWrap>
                                Approval
                            </Typography>
                            <Box sx={{ maxHeight: 500, overflowY: "auto" }}>
                                <Typography id="reset-modal-description" sx={{ mt: 1, mb: .5 }}>
                                    Reset or adjust the client's annual budget upon request.
                                </Typography>
                                <Stack spacing={1} sx={{ mt: 2 }}>
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-evenly",
                                            alignItems: "center",
                                            height: "100%",
                                            borderRadius: 5,
                                            border: "1px solid #c7c7c7",
                                            p: 3
                                        }}
                                    >
                                        <Select
                                            name={"reset-budget-select"}
                                            displayEmpty
                                            value={value}
                                            onChange={handleChangeSelection}
                                            MenuProps={MenuProps}
                                            sx={{
                                                "& .MuiSelect-select": {
                                                    padding: '10px', // Adjust input padding
                                                    backgroundColor: 'white', // Set input background color
                                                    fontWeight: '600', // Set input font weight
                                                    fontSize: 13,
                                                    maxWidth: 90,
                                                    minWidth: 40
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': { border: 0 }
                                            }}
                                            inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                            {years.map((item, index) => (
                                                <MenuItem
                                                    key={index}
                                                    value={item}
                                                    style={getStyles(item, value)}
                                                >
                                                    <Typography variant="inherit" noWrap>
                                                        {item}
                                                    </Typography>

                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <TextField
                                            variant="standard"
                                            value={formatAnnualNumberDisplay(input)}
                                            inputProps={{
                                                inputMode: 'numeric', // For mobile devices to show numeric keyboard
                                                pattern: '[0-9]*',    // HTML5 pattern to restrict input to numeric values
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        ₱{/* Replace this with your desired currency symbol */}
                                                    </InputAdornment>
                                                ),
                                                style: {
                                                    fontWeight: "bold",
                                                    fontSize: 13,
                                                    height: 30,
                                                    maxWidth: "150px"
                                                }
                                            }}
                                            onClick={handleInputClick}
                                            onBlur={handleInputBlur}
                                            onChange={(e) => handleInputChange(e)}
                                        />
                                        <Button
                                            disabled={input <= 0}
                                            sx={[styles.button, { fontSize: 13, ml: 2, mb: 2, maxHeight: 35 }]}
                                            onClick={handleConfirmOpen}
                                            variant="contained"
                                        >
                                            Save
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Box>
                        </Box>
                    </Paper>
                </Fade>
            </Modal>
            <BudgetResetConfirmModal
                open={confirmOpen}
                handleClose={handleConfirmClose}
                handleCloseParent={handleMenuClose}
                value={input}
                currentSchool={currentSchool}
                year={value}
            />
        </Box>
    );
});

export default ResetBudgetModal;

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
