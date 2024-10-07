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
import axios from "axios";
import { useNavigationContext } from "../../Context/NavigationProvider";

const NavigationSearchBar = () => {
  const { currentUser } = useNavigationContext();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [openApplicationInbox, setOpenApplicationInbox] = useState(false);
  const [appliedSchools, setAppliedSchools] = useState([]);
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    const userAppliedSchoolsKey = `appliedSchools_${currentUser.id}`;
    const userDialogStatusKey = `dialogStatus_${currentUser.id}`;
    
    axios.get(`${process.env.REACT_APP_API_URL_SCHOOL}/all`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`,
      },
    })
    .then((response) => {
      setSchools(response.data);
    })
    .catch((error) => {
      console.error("There was an error fetching the school data!", error);
    });

    // Load user-specific applied schools from local storage
    const savedAppliedSchools = JSON.parse(localStorage.getItem(userAppliedSchoolsKey)) || [];
    setAppliedSchools(savedAppliedSchools);

    // Load user-specific dialog status
    const dialogStatus = JSON.parse(localStorage.getItem(userDialogStatusKey)) || { open: false, school: null };
    if (dialogStatus.open && dialogStatus.school) {
      setSelectedSchool(dialogStatus.school);
      setOpen(true);
    }
  }, [currentUser]);

  useEffect(() => {
    const userAppliedSchoolsKey = `appliedSchools_${currentUser.id}`;
    const updateAppliedSchools = async () => {
      const savedAppliedSchools = JSON.parse(localStorage.getItem(userAppliedSchoolsKey)) || [];
      const updatedSchools = await Promise.all(savedAppliedSchools.map(async (school) => {
        try {
          const associationResponse = await axios.get(`${process.env.REACT_APP_API_URL_ASSOC}/${school.assocId}`, {
            headers: {
              Authorization: `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`,
            },
          });
          return {
            ...school,
            approved: associationResponse.data.approved,
          };
        } catch (error) {
          console.error(`Error fetching approval status for ${school.fullName}:`, error);
          return school; // Return the school unchanged if there's an error
        }
      }));

      const nonApprovedSchools = updatedSchools.filter((school) => !school.approved);
      setAppliedSchools(nonApprovedSchools);
      localStorage.setItem(userAppliedSchoolsKey, JSON.stringify(nonApprovedSchools));
    };

    updateAppliedSchools();
  }, [currentUser]);

  useEffect(() => {
    const userAppliedSchoolsKey = `appliedSchools_${currentUser.id}`;
    localStorage.setItem(userAppliedSchoolsKey, JSON.stringify(appliedSchools));
  }, [appliedSchools, currentUser]);

  const handleApplySchool = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL_ASSOC}/apply`, {
        userId: currentUser.id,
        schoolId: selectedSchool.id,
      }, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`,
        },
      });

      const assocId = response.data.id;

      if (!assocId) {
        throw new Error("Association ID not found in response");
      }

      const associationResponse = await axios.get(`${process.env.REACT_APP_API_URL_ASSOC}/${assocId}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`,
        },
      });

      if (associationResponse.data.approved) {
        setAppliedSchools((prevAppliedSchools) =>
          prevAppliedSchools.filter((school) => school.fullName !== selectedSchool.fullName)
        );
        handleClose(true);
      } else {
        setAppliedSchools((prevAppliedSchools) => [
          ...prevAppliedSchools,
          { id: selectedSchool.id, fullName: selectedSchool.fullName, assocId, approved: false },
        ]);
        handleClose(false);
      }
    } catch (error) {
      console.error("Error applying to school:", error);
    }
  };

  const handleClickOpen = (school) => {
    setSelectedSchool(school);
    setOpen(true);
    const userDialogStatusKey = `dialogStatus_${currentUser.id}`;
    localStorage.setItem(userDialogStatusKey, JSON.stringify({ open: true, school: school }));
  };

  const handleRemoveSchool = async (assocId, schoolToRemove) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL_ASSOC}/${assocId}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`,
        },
      });

      // Update the state by filtering out the removed school
      setAppliedSchools((prevAppliedSchools) => prevAppliedSchools.filter((school) => school.fullName !== schoolToRemove));
    } catch (error) {
      console.error("Error removing the school:", error);
    }
  };

  const handleClose = (approved) => {
    setOpen(false);
    const userDialogStatusKey = `dialogStatus_${currentUser.id}`;
    localStorage.setItem(userDialogStatusKey, JSON.stringify({ open: false, school: null }));
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const filteredSchools = schools.filter((school) =>
    school.fullName && school.fullName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Box style={{ width: "400px", position: "relative" }}>
      <Box component="form" sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: "100%" }}>
        <InputBase
          name="school-search-input"
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
        <ul style={{
          listStyleType: "none", padding: 0, position: "absolute", width: "100%",
          maxHeight: "600px", overflowY: "auto", backgroundColor: "#fff",
          border: "1px solid #ccc", boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
          color: "#424242", textAlign: "start", zIndex: 999,
        }}>
          <li
            style={{
              textAlign: "end", padding: "8px 16px", borderBottom: "1px solid #ccc",
              textDecoration: "underline", cursor: "pointer",
            }}
            onClick={() => setOpenApplicationInbox(true)}
          >
            Application Inbox
          </li>
          <Dialog open={openApplicationInbox} onClose={() => setOpenApplicationInbox(false)}>
            <DialogTitle>{"Application Inbox"}</DialogTitle>
            {appliedSchools.length ? (
              appliedSchools.map((school, index) => (
                !school.approved && (
                  <DialogContent key={index} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                    <Avatar>C</Avatar>
                    <DialogContentText>
                      <span style={{ fontWeight: "bold" }}>{school.fullName}</span>
                      <br />
                      Your application is currently under review.
                    </DialogContentText>
                    <DialogActions>
                      <Button onClick={() => handleRemoveSchool(school.assocId, school.fullName)} autoFocus>
                        Cancel
                      </Button>
                    </DialogActions>
                  </DialogContent>
                )
              ))
            ) : (
              <DialogContent>
                <DialogContentText>No applied schools</DialogContentText>
              </DialogContent>
            )}
          </Dialog>
          {filteredSchools.map((school, index) => (
            <li key={index} style={{ padding: "8px 16px", borderBottom: "1px solid #ccc", cursor: "pointer", display: "flex", alignItems: "center", gap: "1rem" }}
              onClick={() => handleClickOpen(school)}
            >
              <Avatar>C</Avatar>
              {school.fullName}
            </li>
          ))}
        </ul>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"Selected School"}</DialogTitle>
        <DialogContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem" }}>
          <Avatar>C</Avatar>
          <DialogContentText>
            <span style={{ fontWeight: "bold" }}>{selectedSchool.fullName}</span>
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
