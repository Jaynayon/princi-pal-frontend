import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Avatar from "@mui/material/Avatar";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CloseIcon from "@mui/icons-material/Close";
import MenuItem from "@mui/material/MenuItem";

const SCHOOLS = [
  "University of San Carlos",
  "University of the Philippines Cebu",
  "Cebu Institute of Technology - University",
  "University of Cebu",
  "Southwestern University",
  "Cebu Doctors' University",
  "University of San Jose - Recoletos",
  "Cebu Normal University",
  "University of Southern Philippines Foundation",
  "Asian College of Technology",
];

const NavigationSearchBar = () => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [openApplicationInbox, setOpenApplicationInbox] = useState(false);
  const [select, setSelect] = useState("ADAS");
  const [appliedSchools, setAppliedSchools] = useState([]);

  const handleApplySchool = () => {
    if (selectedSchool && !appliedSchools.includes(selectedSchool)) {
      setAppliedSchools([...appliedSchools, selectedSchool]);
    }
    setOpen(false);
  };

  const handleRemoveSchool = (schoolToRemove) => {
    const updatedSchools = appliedSchools.filter(
      (school) => school !== schoolToRemove
    );
    setAppliedSchools(updatedSchools);
  };

  const handleChange = (event) => {
    setSelect(event.target.value);
  };

  const handleClickOpenApplicationInbox = () => {
    setOpenApplicationInbox(true);
  };

  const handleClickCloseApplicationInbox = () => {
    setOpenApplicationInbox(false);
  };

  const handleClickOpen = (school) => {
    setSelectedSchool(school);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const filteredSchools = SCHOOLS.filter((school) =>
    school.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <div style={{ width: "400px", position: "relative" }}>
      <Box
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1, textAlign: "right" }}
          placeholder=""
          value={query}
          onChange={handleInputChange}
          inputProps={{ style: { textAlign: "right" } }} // Align text inside input to the right
        />
        <IconButton color="inherit" type="button" sx={{ p: "10px" }}>
          <SearchIcon />
        </IconButton>
      </Box>
      {query && (
        <ul
          style={{
            listStyleType: "none",
            padding: 0,
            position: "absolute",
            width: "100%",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
            color: "#424242",
            textAlign: "start",
          }}
        >
          <li
            style={{
              textAlign: "end",
              padding: "8px 16px",
              borderBottom: "1px solid #ccc",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={handleClickOpenApplicationInbox}
          >
            Application Inbox
          </li>
          <Dialog
            open={openApplicationInbox}
            onClose={handleClickCloseApplicationInbox}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 25px 0 0",
              }}
            >
              <DialogTitle id="alert-dialog-title">
                {"Application Inbox"}
              </DialogTitle>
              <span
                onClick={handleClickCloseApplicationInbox}
                style={{ cursor: "pointer", paddingTop: "8px" }}
              >
                <CloseIcon />
              </span>
            </div>
            {appliedSchools.length ? (
              appliedSchools.map((school, index) => (
                <DialogContent
                  sx={{
                    display: "flex",
                    justifyContent: "spaceBetween",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                  key={index}
                >
                  <Avatar>C</Avatar>
                  <DialogContentText id="alert-dialog-description">
                    <span style={{ fontWeight: "bold" }}>{school}</span>
                    <br />
                    Your application is currently under review.
                  </DialogContentText>
                  <DialogActions>
                    <Button
                      onClick={() => handleRemoveSchool(school)}
                      autoFocus
                    >
                      Cancel
                    </Button>
                  </DialogActions>
                </DialogContent>
              ))
            ) : (
              <DialogContent
                sx={{
                  display: "flex",
                  justifyContent: "spaceBetween",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <DialogContentText id="alert-dialog-description">
                  No applied schools
                </DialogContentText>
              </DialogContent>
            )}
          </Dialog>
          {filteredSchools.map((school, index) => (
            <li
              key={index}
              style={{
                padding: "8px 16px",
                borderBottom: "1px solid #ccc",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
              onClick={() => handleClickOpen(school)}
            >
              <Avatar>C</Avatar>
              {school}
            </li>
          ))}
        </ul>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Selected School"}</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            gap: "1rem",
          }}
        >
          <Avatar>C</Avatar>
          <DialogContentText id="alert-dialog-description">
            <span style={{ fontWeight: "bold" }}>{selectedSchool}</span>
            <br />
            Provide information to request access to this organization.
          </DialogContentText>
          <FormControl sx={{ m: 1, minWidth: 80 }} size="small">
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={select}
              onChange={handleChange}
              autoWidth
              label="Select"
            >
              <MenuItem value="ADAS">ADAS</MenuItem>
              <MenuItem value="ADOF">ADOF</MenuItem>
            </Select>
          </FormControl>
          <DialogActions>
            <Button onClick={handleApplySchool} autoFocus>
              Apply
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NavigationSearchBar;
