export const styling = {
    default: {
        color: 'white',
        bold: 'white',
        base: '#4A99D3',
        button: {
            "&.Mui-selected": {
                backgroundColor: 'rgba(255, 255, 255, 0.10)', // Change to desired highlight color
                borderRadius: '10px',
            },
            "& .MuiTouchRipple-root": {
                color: 'white'
            },
            '&:hover, &.Mui-focusVisible': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
            },
        }
    },
    light: {
        color: '#252733',
        bold: '#20A0F0',
        base: 'white',
        button: {
            "&.Mui-selected": {
                backgroundColor: 'rgba(233, 246, 254, 1)', // Change to desired highlight color
                borderRadius: '10px',
            },
            "& .MuiTouchRipple-root": {
                color: 'white'
            },
            '&:hover, &.Mui-focusVisible': {
                backgroundColor: 'rgba(233, 246, 254, 1)',
                borderRadius: '10px',
            },
        }
    }
}