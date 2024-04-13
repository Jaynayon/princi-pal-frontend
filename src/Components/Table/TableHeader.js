import React from 'react';
import plusBtnImg from '../../Assets/Images/plusbtn.png';

function TableHeader() {
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