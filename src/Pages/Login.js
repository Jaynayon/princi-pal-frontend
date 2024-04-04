import { useState } from "react";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import {
    TextField,
    InputAdornment,
    Icon,
    IconButton,
    Button,
} from "@mui/material";

const LoginPage = ({ setIsLoggedIn }) => {
    const [showPassword, setShowPassword] = useState(false);
    const handleShowPasswordClick = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
        <div
            style={{
                width: "100%",
                position: "relative",
                backgroundColor: "#fff",
                height: "1024px",
                overflow: "hidden",
                textAlign: "left",
                fontSize: "15px",
                color: "#000",
                fontFamily: "Inter",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    width: "1440px",
                    height: "1024px",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: "1024px",
                        left: "1440px",
                        background:
                            "linear-gradient(1.02deg, #4a99d3 7.81%, rgba(74, 153, 211, 0)), #fff",
                        boxShadow: "0px 4px 16px rgba(75, 0, 129, 0.26)",
                        width: "1440px",
                        height: "1024px",
                        transform: " rotate(-180deg)",
                        transformOrigin: "0 0",
                        opacity: "0.2",
                    }}
                />
            </div>
            <TextField
                style={{
                    border: "none",
                    backgroundColor: "transparent",
                    position: "absolute",
                    top: "596px",
                    left: "159px",
                }}
                color="primary"
                label="Enter your password"
                variant="outlined"
                type={showPassword ? "text" : "password"} // Show or hide password based on showPassword state
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={handleShowPasswordClick} // Toggle the showPassword state
                                aria-label="toggle password visibility"
                            >
                                <VisibilityOffIcon onClick={() => showPassword ? "visibility" : "visibility_off"} />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                sx={{ "& .MuiInputBase-root": { height: "47px" }, width: "445px" }}
            />
            <TextField
                style={{
                    border: "none",
                    backgroundColor: "transparent",
                    position: "absolute",
                    top: "442px",
                    left: "159px",
                }}
                color="primary"
                label="Enter your email id"
                variant="outlined"
                sx={{ "& .MuiInputBase-root": { height: "47px" }, width: "445px" }}
            />
            <div
                style={{
                    position: "absolute",
                    top: "393px",
                    left: "159px",
                    fontSize: "18px",
                    fontWeight: "600",
                }}
            >
                Email
            </div>
            <div
                style={{
                    position: "absolute",
                    top: "547px",
                    left: "155px",
                    fontSize: "18px",
                    fontWeight: "600",
                }}
            >
                Password
            </div>
            <div
                style={{
                    position: "absolute",
                    top: "698px",
                    left: "161px",
                    fontWeight: "500",
                }}
            >
                Remember Me
            </div>
            <div
                style={{
                    position: "absolute",
                    top: "697px",
                    left: "451px",
                    fontWeight: "600",
                    color: "#474bca",
                }}
            >
                Forgot Password?
            </div>
            <Button
                style={{
                    position: "absolute",
                    top: "766px",
                    left: "160px", // Adjusted left position to center the button
                    borderRadius: "5px",
                    backgroundColor: "#4a99d3",
                    width: "443px",
                    height: "44px",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "9px 16px",
                    boxSizing: "border-box",
                    textAlign: "center",
                    fontSize: "18px",
                    color: "#fff",
                    fontFamily: "'Source Sans Pro'",
                    fontWeight: "bold", // Added fontWeight to make the text bold
                    textTransform: "capitalize", // Added textTransform to make the text in sentence case
                }}
                disableElevation={true}
                color="primary"
                variant="contained"
                sx={{ borderRadius: "0px 0px 0px 0px", width: 443, height: 44 }}
                onClick={() => setIsLoggedIn(true)}
            >
                Log in
            </Button>
            <Button
                style={{
                    position: "absolute",
                    top: "147px",
                    left: "calc(50% + 409px)",
                    borderRadius: "5px",
                    backgroundColor: "#4a99d3",
                    width: "167px",
                    height: "43px",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "9px 16px",
                    boxSizing: "border-box",
                    textAlign: "center",
                    fontSize: "20px",
                    color: "#fff",
                    fontFamily: "'Source Sans Pro'",
                    fontWeight: "bold", // Added fontWeight to make the text bold
                    textTransform: "capitalize", // Added textTransform to make the text in sentence case
                }}
                disableElevation={true}
                color="primary"
                variant="contained"
                href="/Registration"
                sx={{ borderRadius: "0px 0px 0px 0px", width: 167, height: 43 }}
            >
                Sign Up
            </Button>
            <div
                style={{
                    position: "absolute",
                    top: "847px",
                    left: "225px",
                    fontWeight: "500",
                    color: "#4a99d3",
                }}
            >
                <span style={{ color: "#000" }}>Not registered yet?</span>
                <span style={{ color: "#673535" }}>{` `}</span>
                <span style={{ color: "#474bca" }}>Create an account</span>
                <span style={{ color: "#673535" }}>{` `}</span>
                <span style={{ textDecoration: "underline" }}>SignUp</span>
            </div>
            <div
                style={{
                    position: "absolute",
                    top: "242px",
                    left: "154px",
                    fontSize: "20px",
                }}
            >{`Hi, Welcome back 👋 `}</div>
            <b
                style={{
                    position: "absolute",
                    top: "147px",
                    left: "154px",
                    fontSize: "48px",
                }}
            >
                Login to your account
            </b>
            <img
                style={{
                    position: "absolute",
                    top: "362px",
                    left: "720px",
                    width: "450px",
                    height: "371px",
                    objectFit: "cover",
                }}
                alt=""
                src="/reshotillustrationwebsitedesignu3pzxdsevy-1@2x.png"
            />
        </div>
    );
};

export default LoginPage;
