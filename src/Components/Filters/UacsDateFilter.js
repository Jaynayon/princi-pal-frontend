import React, { useEffect, useState, useRef } from 'react'
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { useSchoolContext } from '../../Context/SchoolProvider';
import RestService from '../../Services/RestService';

const objectCodes = [
    { code: "5020502001", name: "Communication Expenses" },
    { code: "5020402000", name: "Electricity Expenses" },
    { code: "5020503000", name: "Internet Subscription Expenses" },
    { code: "5029904000", name: "Transpo/Delivery Expenses" },
    { code: "5020201000", name: "Training Expenses" },
    { code: "5020399000", name: "Other Suplies & Materials Expenses" },
    { code: "1990101000", name: "Advances to Operating Expenses" }
]

function UacsDateFilter(props) {
    //const [anchorEl, setAnchorEl] = React.useState(null);
    const { fetchDocumentData } = useSchoolContext();
    const { value, rowId, handleInputChange } = props
    const [selectedCode, setSelectedCode] = useState(value);

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;

    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
            },
        },
    };

    function getStyles(name) {
        return {
            fontWeight: "600",
            color:
                objectCodes.indexOf(name) === -1
                    ? null
                    : "#176AF6"
        };
    }

    const updateLrByIdUacs = async (value) => {
        try {
            const response = await RestService.updateLrById("objectCode", rowId, value);
            if (response) {
                console.log(`LR with id: ${rowId} is updated`);
            } else {
                console.log("LR not updated");
            }
            fetchDocumentData();
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    }

    const handleChangeMonth = (event) => {
        const {
            target: { value },
        } = event;

        setSelectedCode(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );

        // updates the row state in RecordsRow
        // mainly used in displayFields feature where a new object is inserted
        // with the id == 3
        handleInputChange("objectCode", rowId, event);

        // Only applies if it's not the new row
        if (rowId !== 3) {
            updateLrByIdUacs(value);
        }
    };

    return (
        <FormControl sx={{
            minWidth: 90,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: "flex-start"
        }}>
            <Select
                displayEmpty
                value={selectedCode}
                onChange={handleChangeMonth}
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
                {objectCodes.map((item) => (
                    <MenuItem
                        key={item.code}
                        value={item.code}
                        style={getStyles(item.name, item)}
                    >
                        <Typography variant="inherit" noWrap>
                            {item.code + ` (${item.name})`}
                        </Typography>

                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default UacsDateFilter;