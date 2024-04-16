import { useState } from "react";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { TextField, InputAdornment, IconButton, Button, Typography, Paper, Container } from "@mui/material";

const LoginPage = ({ setIsLoggedIn }) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleShowPasswordClick = () => {
        setShowPassword(prevShowPassword => !prevShowPassword);
    };  

    return (
        <>
            <div>
                Logins
            </div>
            <button onClick={() => setIsLoggedIn(true)}>
                Click to Login
            </button>
        </>

    );
};

export default LoginPage;
