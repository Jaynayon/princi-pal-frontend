import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";

const NavigationSearchBar = () => {
  const [query, setQuery] = useState("");
  const [schools, setSchools] = useState([
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
  ]);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const filteredSchools = schools.filter((school) =>
    school.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <div style={{ width: "400px", position: "relative" }}>
      <Paper
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder=""
          value={query}
          onChange={handleInputChange}
        />
        <IconButton color="inherit" type="button" sx={{ p: "10px" }}>
          <SearchIcon />
        </IconButton>
      </Paper>
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
            }}
          >
            Application Inbox
          </li>
          {filteredSchools.map((school, index) => (
            <li
              key={index}
              style={{ padding: "8px 16px", borderBottom: "1px solid #ccc" }}
            >
              {school}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NavigationSearchBar;
