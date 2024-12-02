import React, { memo } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useSchoolContext } from '../../Context/SchoolProvider';

const DocumentTextField = (props) => {
    const { updateDocumentById, fetchDocumentData } = useSchoolContext();
    const { description, prop } = props;
    // const { } = useSchoolContext();
    // const { description, value, id } = props;
    const id = prop?.id || "None";
    let value;
    if (description === "Claimant") {
        value = prop?.claimant || "None"
    } else if (description === "SDS") {
        value = prop?.sds || "None"
    } else if (description === "Head. Accounting Div. Unit") {
        value = prop?.headAccounting || "None"
    } else {
        value = "None"
    }

    const [input, setInput] = React.useState(prop || "None");
    const [prevInput, setPrevInput] = React.useState('initial state');

    React.useEffect(() => {
        setInput(value); // Set previous input on initial render
    }, [value]); // Update prevInput whenever value prop changes

    const handleInputChange = (event) => {
        setInput(event.target.value);
    }

    const handleInputBlur = async () => {
        if (prevInput !== input) {
            await updateDocumentFooter(input); //update field in db
        }
    }

    const handleInputOnClick = (event) => {
        if (value === "None" || value === "none") {
            setInput("")
        }
        setPrevInput(event.target.value);
    }

    const updateDocumentFooter = async (newValue) => {
        try {
            const response = await updateDocumentById(id, description, input);
            if (response) {
                setInput(newValue);
            }
            fetchDocumentData(); //fetch data changes
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row', //main axis (horizontal)
            alignItems: "center", //center vertically
            pt: 1
        }}>
            <Box sx={{
                pr: 1.5,
                width: 80,
                fontSize: 13,
                fontWeight: 650,
                color: "#9FA2B4"
            }}>
                <Typography variant="inherit" align="left">
                    {description}
                </Typography>
            </Box>
            <TextField
                value={input}
                variant='standard'
                sx={{
                    "& fieldset": { border: 'none' },
                    width: 200
                }}
                InputProps={{
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: 14,
                        height: 25,
                        pl: 5,
                    }
                }}
                onChange={(event) => handleInputChange(event)}
                onClick={(event) => handleInputOnClick(event)}
                onBlur={(event) => handleInputBlur(event)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        e.target.blur(); // Invoke handleLogin on Enter key press
                    }
                }}
            />
        </Box>
    );
}

export default memo(DocumentTextField);