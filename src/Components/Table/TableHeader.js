import React from 'react';
import plusBtnImg from '../../Assets/Images/plusbtn.png';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';

/*function TableHeader() {
    return (
        <div style={styles.container}>
            <div style={styles.section}>
                <div style={styles.sectionContainer}>
                    <img alt="" src={plusBtnImg} style={styles.plus} />
                    <div style={styles.titleContainer}>
                        <div style={styles.title}>All Records</div>
                    </div>
                </div>
            </div>
            <div style={styles.section}>
                <div style={styles.sectionContainer}>
                    <div style={styles.fontStyling}>Name/Id</div>
                    <input style={styles.inputStyling} type="text" onChange={() => console.log("test")}></input>
                </div>
            </div>
            <div style={{ flex: 1, minHeight: "50px" }}></div>
        </div>
    );
}*/

function TableHeader() {
    return (
        <Grid container /*spacing={2}*/>
            <Grid item xs={6} md={12} lg={12}>
                <Box sx={{
                    width: '100%',
                    height: '100%',

                }}>
                    Table Header Content
                </Box>
            </Grid>
            <Grid item xs={6} md={12} lg={12}>
                <Box sx={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'green',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center', // Center content vertically
                    color: 'white', // Text color
                    fontWeight: 'bold' // Make text bold
                }}>
                    Table Header Content
                </Box>
            </Grid>
        </Grid>

    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: "row",
        alignItems: "center",
        marginBottom: "10px"
    },
    section: { //Add, Search, or Filter section
        flex: 1,
        display: 'flex',
        minHeight: "50px",
        flexDirection: "row"
    },
    sectionContainer: {
        display: 'flex',
        alignItems: "center",
        justifyContent: "center",
    },
    plus: {
        float: "left",
        height: "50px",
        width: "50px",
        padding: "10px",
        cursor: "url(), pointer"
    },
    title: {
        fontFamily: "Mulish-Regular",
        fontWeight: "bold",
        fontSize: "20px",
        color: "black",
        marginLeft: "10px",
    },
    titleContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    fontStyling: {
        fontFamily: "Mulish-Regular",
        fontWeight: "bold",
        color: "#808080",
        fontSize: "13px",
    },
    inputStyling: {
        fontFamily: "Mulish-Regular",
        fontWeight: "bold",
        borderRadius: "8px",
        border: "1px solid #ccc",
        background: "transparent",
        outline: "none",
        height: "20px",
        width: "250px",
        padding: "5px",
        margin: "10px"
    }
}

export default TableHeader;