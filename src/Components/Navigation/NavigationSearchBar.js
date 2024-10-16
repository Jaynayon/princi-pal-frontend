import React, { useState, useEffect } from "react";
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
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useNavigationContext } from "../../Context/NavigationProvider";

const NavigationSearchBar = () => {
  const { currentUser } = useNavigationContext();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [openApplicationInbox, setOpenApplicationInbox] = useState(false);
  const [appliedSchools, setAppliedSchools] = useState([]); // Store full school objects along with assocId
  const [schools, setSchools] = useState([]);

  // Fetch all available schools on component mount
  useEffect(() => {
    let isMounted = true;
    axios
      .get(`${process.env.REACT_APP_API_URL_SCHOOL}/all`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`,
        },
      })
      .then((response) => {
        if (isMounted) {
          setSchools(response.data);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the school data!", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch applied schools when the Application Inbox is opened
  const handleClickOpenApplicationInbox = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_ASSOC}/applications/user/${currentUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`,
          }
        }
      );
      console.log("Applied schools response:", response.data); // Check if fullName and assocId are included
      setAppliedSchools(response.data); // Set applied schools
      setOpenApplicationInbox(true); // Open the Application Inbox dialog
    } catch (error) {
      console.error("Error fetching applied schools:", error);
    }
  };

  const handleClickCloseApplicationInbox = () => {
    setOpenApplicationInbox(false);
  };

  // Apply to a school and get assocId and fullName from the response
  const handleApplySchool = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_ASSOC}/apply`,
        {
          userId: currentUser.id,
          schoolId: selectedSchool.id
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`,
          }
        }
      );
  
      // Log the full response data to inspect its structure
      console.log("Full response data:", response.data);
  
      // Safely check the structure of response.data and assign values
      const assocId = response.data?.id;
      const school = response.data?.school || selectedSchool;
      const isApproved = response.data?.isApproved;
  
      console.log("Application submitted successfully:", { assocId, school, isApproved });
  
      if (isApproved) {
        // If the association is approved, remove the school from the appliedSchools list
        setAppliedSchools((prevAppliedSchools) =>
          prevAppliedSchools.filter((appliedSchool) => appliedSchool.id !== school.id)
        );
        console.log("School removed from applied schools because it is approved.");
      } else {
        // If the association is not yet approved, add the school to the appliedSchools list
        setAppliedSchools((prevAppliedSchools) => [
          ...prevAppliedSchools,
          { ...school, assocId } // Add school and assocId to the appliedSchools array
        ]);
        console.log("School added to applied schools list.");
      }
  
      handleClose(); // Close the selected school dialog
    } catch (error) {
      console.error("Error applying to school:", error);
    }
  };

  const handleClickOpen = (school) => {
    setSelectedSchool(school);
    setOpen(true);
  };

  // Remove school and delete association when the user clicks cancel
  const handleRemoveSchool = async (schoolToRemove) => {
    try {
      const assocId = schoolToRemove.assocId;
      if (!assocId) {
        console.error("No assocId found for the selected school.");
        return;
      }

      // Delete the association using the assocId
      await axios.delete(`${process.env.REACT_APP_API_URL_ASSOC}/${assocId}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`,
        }
      });

      // Remove the school from the appliedSchools state
      setAppliedSchools((prevAppliedSchools) =>
        prevAppliedSchools.filter((school) => school.id !== schoolToRemove.id)
      );
    } catch (error) {
      console.error("Error removing the school:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const filteredSchools = schools.filter(
    (school) => school.fullName?.toLowerCase().includes(query.toLowerCase())
  );

  if (currentUser.position === 'Principal') {
    return (
      <Box style={{ width: "400px", position: "relative", textAlign: "center", padding: "20px" }}>
        
      </Box>
    );
  }

  return (
    <Box style={{ width: "400px", position: "relative" }}>
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
          inputProps={{ style: { textAlign: "right" } }}
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
            maxHeight: "600px",
            overflowY: "auto",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
            color: "#424242",
            textAlign: "start",
            zIndex: 999,
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
              <DialogTitle id="alert-dialog-title">Application Inbox</DialogTitle>
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
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                  key={index}
                >
                  <Avatar>{school.fullName?.charAt(0).toUpperCase()}</Avatar> {/* Display first letter */}
                  <DialogContentText id="alert-dialog-description">
                    <span style={{ fontWeight: "bold" }}>{school.fullname}</span> {/* Full name */}
                    <br />
                    Your application is currently under review.
                  </DialogContentText>
                  <DialogActions>
                    <Button onClick={() => handleRemoveSchool(school)} autoFocus>
                      Cancel
                    </Button>
                  </DialogActions>
                </DialogContent>
              ))
            ) : (
              <DialogContent>
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
              <Avatar>{school.fullName?.charAt(0).toUpperCase()}</Avatar>
              {school.fullName}
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
        <DialogTitle id="alert-dialog-title">Selected School</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            gap: "1rem",
          }}
        >
          <Avatar>{selectedSchool?.fullName?.charAt(0).toUpperCase()}</Avatar>
          <DialogContentText id="alert-dialog-description">
            <span style={{ fontWeight: "bold" }}>{selectedSchool?.fullName}</span>
            <br />
            Provide information to request access to this organization.
          </DialogContentText>
          <DialogActions>
            <Button onClick={handleApplySchool} autoFocus>
              Apply
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default NavigationSearchBar;