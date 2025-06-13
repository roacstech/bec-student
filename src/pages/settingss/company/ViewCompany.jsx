import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Tabs, Tab, Box, Typography, Container, Grid, Chip } from '@mui/material';
import MainCard from 'components/MainCard';
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import BackButton from 'components/Button/BackButton';

const ViewCompany = () => {
  const location = useLocation();
  const { company } = location.state || {}; // Retrieve company data from navigation state

  const [activeTab, setActiveTab] = useState(0); // Manage active tab state

  if (!company) {
    return <Typography>No company data available.</Typography>; // Fallback for no data
  }

  // Handle tab change
  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: '100%', padding: '20px' }}>
      <BackButton />
      <MainCard>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            {/* Box with image and border radius */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '8px', // Added border radius
                overflow: 'hidden',
                boxShadow: 3 // Added box shadow for depth
              }}
            >
              <img
                src={company.companyimage}
                alt={company.companyname}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '8px' // Ensures the image also has rounded corners
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <MainCard>
              <Typography variant="h4" gutterBottom>
                Company Details
              </Typography>

              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="service details table">
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <strong>Company Name</strong>
                      </TableCell>
                      <TableCell align="left">{company.companyname}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Company ID</strong>
                      </TableCell>
                      <TableCell align="left">{company.companyuniqueid}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Status</strong>
                      </TableCell>
                      <TableCell align="left">
                        <Chip
                          label={company.companystatus === 1 ? 'Active' : 'Inactive'}
                          color={company.companystatus === 1 ? 'success' : 'secondary'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </MainCard>
          </Grid>
          <Grid item xs={12}>
            <Tabs
              value={activeTab}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Terms & Conditions" />
              <Tab label="Notes" />
            </Tabs>

            <Box sx={{ marginTop: '20px' }}>
              {/* Render content based on the active tab */}
              {activeTab === 0 && (
                <Typography>
                  <div dangerouslySetInnerHTML={{ __html: company.companyquotationtermsandconditions }} />
                </Typography>
              )}
              {activeTab === 1 && (
                <Typography>
                  <div dangerouslySetInnerHTML={{ __html: company.companyquotationnotes }} />
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </MainCard>
    </Box>
  );
};

export default ViewCompany;
