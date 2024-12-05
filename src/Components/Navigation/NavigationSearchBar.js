import React, { useState, useEffect, useRef } from "react";
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
import { Tooltip } from "@mui/material";

const NavigationSearchBar = () => {
  const { currentUser } = useNavigationContext();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [isInputVisible, setIsInputVisible] = useState(false); // New state for input visibility
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [openApplicationInbox, setOpenApplicationInbox] = useState(false);
  const [appliedSchools, setAppliedSchools] = useState([]);
  const [schools, setSchools] = useState([]);
  const [associatedSchoolIds, setAssociatedSchoolIds] = useState([]);

  const searchBoxRef = useRef(null); // Ref for the search box
  const isDialogOpen = open || openApplicationInbox;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target) &&
        !isDialogOpen
      ) {
        setQuery(""); // Close the search results box
        setIsInputVisible(false); // Hide the input field
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDialogOpen]);

  const handleSearchIconClick = async () => {
    setIsInputVisible(!isInputVisible);

    if (!isInputVisible) {
      try {
        // Fetch all available schools
        const fetchSchools = async () => {
          const response = await axios.get(`${process.env.REACT_APP_API_URL_SCHOOL}/all`, {
            headers: {
              Authorization: `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`,
            },
          });
          setSchools(response.data);
        };

        // Fetch user associations
        const fetchUserAssociations = async () => {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL_ASSOC}/user/${currentUser.id}`,
            {
              headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`,
              },
            }
          );
          const associatedIds = response.data.map((assoc) => assoc.schoolId);
          setAssociatedSchoolIds(associatedIds);
        };

        // Run both fetch functions
        await Promise.all([fetchSchools(), fetchUserAssociations()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const handleClickOpenApplicationInbox = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_ASSOC}/applications/user/${currentUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`,
          },
        }
      );
      setAppliedSchools(response.data);
      setOpenApplicationInbox(true);
    } catch (error) {
      console.error("Error fetching applied schools:", error);
    }
  };

  const handleClickCloseApplicationInbox = () => {
    setOpenApplicationInbox(false);
  };

  const handleApplySchool = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_ASSOC}/apply`,
        {
          userId: currentUser.id,
          schoolId: selectedSchool.id,
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`,
          },
        }
      );

      const assocId = response.data?.id;
      const school = response.data?.school || selectedSchool;
      const isApproved = response.data?.isApproved;

      if (isApproved) {
        setAppliedSchools((prevAppliedSchools) =>
          prevAppliedSchools.filter((appliedSchool) => appliedSchool.id !== school.id)
        );
      } else {
        setAppliedSchools((prevAppliedSchools) => [
          ...prevAppliedSchools,
          { ...school, assocId },
        ]);
      }

      handleClose();
    } catch (error) {
      console.error("Error applying to school:", error);
    }
  };

  const handleClickOpen = (school) => {
    setSelectedSchool(school);
    setOpen(true);
  };

  const handleRemoveSchool = async (schoolToRemove) => {
    try {
      const assocId = schoolToRemove.assocId;
      if (!assocId) {
        console.error("No assocId found for the selected school.");
        return;
      }

      await axios.delete(`${process.env.REACT_APP_API_URL_ASSOC}/${assocId}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`,
        },
      });

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

  const isUserAssociatedWithSelectedSchool = selectedSchool
    ? associatedSchoolIds.includes(selectedSchool.id)
    : false;

  const filteredSchools = schools.filter((school) =>
    school.fullName?.toLowerCase().startsWith(query.toLowerCase())
  );

  if (currentUser.position === "Principal") {
    return (
      <Box style={{ width: "400px", position: "relative", textAlign: "center", padding: "20px" }} />
    );
  }

  return (
    <Box style={{ width: "400px", position: "relative" }} ref={searchBoxRef}>
      <Box
        component="form"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 2,
          p: 1,
        }}
      >
        {/* Search input, conditionally rendered */}
        {isInputVisible && (
          <InputBase
            sx={{
              ml: 1, // Consistent margin for spacing
              flex: 1,
              textAlign: "right",
            }}
            placeholder="Search..."
            value={query}
            onChange={handleInputChange}
            inputProps={{ style: { textAlign: "right" } }}
          />
        )}

        {/* Search icon, always in the same position */}
        <Tooltip title={"Search Schools"}>
          <IconButton
            color="inherit"
            type="button"
            sx={{ p: "10px" }}
            onClick={handleSearchIconClick} // Toggle input field visibility
          >
            <SearchIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {isInputVisible && query && (
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
                  <Avatar>{school.fullName?.charAt(0).toUpperCase()}</Avatar>
                  <DialogContentText id="alert-dialog-description">
                    <span style={{ fontWeight: "bold" }}>{school.fullname}</span>
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
            <Button
              onClick={handleApplySchool}
              autoFocus
              disabled={isUserAssociatedWithSelectedSchool}
            >
              {isUserAssociatedWithSelectedSchool ? "Already Associated" : "Join"}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default NavigationSearchBar;
