import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
// Custom component import
import Button from '@mui/material/Button';
import { InputAdornment, TextField } from '@mui/material';

const CopyableTextField = ({ referralLink }) => {
    const [copyIsClicked, setCopyIsClicked] = useState(false);
    const inputRef = useRef(null);

    const handleSelect = () => {
        if (inputRef.current) {
            inputRef.current.select(); // Select the text programmatically
        }
    };

    const handleCopy = useCallback(() => {
        setCopyIsClicked(true);
        navigator.clipboard.writeText(referralLink);
    }, [referralLink]);

    useEffect(() => {
        if (copyIsClicked) {
            const timeout = setTimeout(() => {
                setCopyIsClicked(false);
            }, 1000);

            return () => clearTimeout(timeout);
        }
    }, [copyIsClicked]);

    return (
        <TextField
            id="invite-link-referral"
            variant="outlined"
            value={referralLink}
            fullWidth
            inputRef={inputRef} // Attach ref to the underlying input
            InputProps={{
                readOnly: true, // Make the field read-only
                onClick: handleSelect, // Highlight the text when clicked
                endAdornment: (
                    <InputAdornment position="end">
                        <Button
                            variant="text"
                            onClick={handleCopy}
                            sx={{
                                textTransform: "none",
                                backgroundColor: copyIsClicked && "#32b14a",
                                color: copyIsClicked && "white"
                            }} // Prevent uppercase text
                        >
                            {copyIsClicked ? "Copied" : "Copy"}
                        </Button>
                    </InputAdornment>
                ),
                style: {
                    cursor: "pointer", // Indicate it's clickable
                    borderColor: "green", // Optional styling
                    height: 50,
                },
            }}
        />
    );
};

export default memo(CopyableTextField);