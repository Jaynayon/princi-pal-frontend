import { Box, Paper, Typography } from "@mui/material";

export default function BudgetSummary(props) {
    const { title, amount, total = false } = props

    // Function to format a number with commas and two decimal places
    const formatNumber = (number) => {
        if (typeof number !== 'number') return ''; // Handle non-numeric values gracefully
        return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return (
        <Paper
            variant='outlined'
            sx={{
                minWidth: 150,
                height: 65,
                m: 1,
                backgroundColor: total ? '#0077B6' : undefined,
                border: title === "Balance" && Number(amount) < 0 && "1px solid red",
            }}
        >
            <Box
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontWeight: 'bold',
                    height: '100%',
                }}
            >
                <Typography variant="body2" align="center"
                    sx={{
                        fontWeight: 'bold',
                        color: title === "Balance" && Number(amount) < 0 ? "red" :
                            total ? '#ffff' : '#9FA2B4'
                    }}
                >
                    {title}
                </Typography>
                <Typography variant="body2" align="center"
                    sx={{
                        fontWeight: 'bold',
                        color: title === "Balance" ? Number(amount) < 0 && "red" :
                            total ? '#ffff' : '#9FA2B4'
                    }}
                >
                    Php {formatNumber(amount)}
                </Typography>
            </Box>
        </Paper>
    );
}