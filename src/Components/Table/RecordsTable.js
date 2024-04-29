import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import LRTable from './LRTable';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { RecordsProvider } from '../../Context/RecordsProvider'

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ paddingTop: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function RecordsTable(props) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <RecordsProvider>
      <Paper sx={styles.container}>
        <Grid container>
          <Grid item xs={6} md={12} lg={12}>
            <Box>
              <Tabs sx={{ minHeight: '10px' }} value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab sx={styles.tab} label="LR" {...a11yProps(0)} />
                <Tab sx={styles.tab} label="Item Two" {...a11yProps(1)} />
                <Tab sx={styles.tab} label="Item Three" {...a11yProps(2)} />
              </Tabs>
            </Box>
          </Grid>
          <Grid item xs={6} md={12} lg={12}>
            <Box sx={{
              width: '100%',
              height: '100%',
            }}
            >
              Table Header Content
            </Box>
          </Grid>
          <Grid item xs={6} md={12} lg={12}>
            <CustomTabPanel value={value} index={0}>
              <LRTable />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              Item Two
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              Item Three
            </CustomTabPanel>
          </Grid>
        </Grid>
      </Paper>
    </RecordsProvider>
  );
}

const styles = {
  container: {
    overflow: 'hidden',
    padding: "10px",
    paddingTop: "10px"
  },
  tab: {
    minHeight: '10px',
    '&.Mui-selected': {
      color: 'black', // Color of selected tab
      fontWeight: 'bold', // Font weight of selected tab
    },
  },
}

export default RecordsTable;