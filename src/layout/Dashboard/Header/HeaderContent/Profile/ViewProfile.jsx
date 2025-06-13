import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Grid } from '@mui/material';
import MainCard from 'components/MainCard';
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import BackButton from 'components/Button/BackButton';

const LeadView = () => {
  const location = useLocation();
  // const { lead, referralTypes } = location.state || {};
  // Retrieve lead data from navigation state

  const [activeTab, setActiveTab] = useState(0); // Manage active tab state

  // if (!lead) {
  //   return <Typography>No lead data available.</Typography>; // Fallback for no data
  // }

  // Handle tab change
  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: '100%', padding: '20px' }}>
      <BackButton />
      <MainCard>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <MainCard title="Student Details">
              <TableContainer>
                <Table aria-label="lead details table">
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <strong>Student Name :</strong>
                      </TableCell>
                      <TableCell align="left">{window.localStorage.getItem('name')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Student ID :</strong>
                      </TableCell>
                      <TableCell align="left">{window.localStorage.getItem('useruniqueid')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Email :</strong>
                      </TableCell>
                      <TableCell align="left">{window.localStorage.getItem('email')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Mobile Number :</strong>
                      </TableCell>
                      <TableCell align="left">{window.localStorage.getItem('phone')}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <strong>Status :</strong>
                      </TableCell>
                      <TableCell align="left">{window.localStorage.getItem('status')}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </MainCard>
          </Grid>
        </Grid>
      </MainCard>
    </Box>
  );
};

export default LeadView;
