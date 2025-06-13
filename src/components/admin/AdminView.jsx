import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Tabs, Tab, Box, Typography, Container, Grid, Chip } from '@mui/material';
import MainCard from 'components/MainCard';
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import BackButton from 'components/Button/BackButton';

const AdminView = () => {
  const location = useLocation();
  const { admin } = location.state || {}; // Retrieve admin data from navigation state

  console.log('admin', admin);

  const [activeTab, setActiveTab] = useState(0); // Manage active tab state

  if (!admin) {
    return <Typography>No admin data available.</Typography>; // Fallback for no data
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
                src={admin.adminimage}
                alt='No Profile Picture'
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '8px' // Ensures the image also has rounded corners
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <MainCard title="Admin Details">
              

              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="admin details table">
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <strong>Admin Name</strong>
                      </TableCell>
                      <TableCell align="left">{admin.adminname}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Admin Unique ID</strong>
                      </TableCell>
                      <TableCell align="left">{admin.adminuniqueid}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Primary Email</strong>
                      </TableCell>
                      <TableCell align="left">{admin.adminprimaryemail}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Alternate Email</strong>
                      </TableCell>
                      <TableCell align="left">{admin.adminalteremail}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Primary Contact</strong>
                      </TableCell>
                      <TableCell align="left">{admin.adminprimarycontact}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Alternate Contact</strong>
                      </TableCell>
                      <TableCell align="left">{admin.adminaltercontact}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Password</strong>
                      </TableCell>
                      <TableCell align="left">{admin.password}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Status</strong>
                      </TableCell>
                      <TableCell align="left">
                        <Chip
                          label={admin.adminstatus === 1 ? 'Active' : 'Inactive'}
                          color={admin.adminstatus === 1 ? 'success' : 'secondary'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <strong>Signature</strong>
                      </TableCell>
                      <TableCell align="left">
                        <a href={admin.adminsignature} target="_blank" rel="noreferrer">
                          <img src={admin.adminsignature} alt="No Signature" style={{ maxWidth: '100px', borderRadius: '8px' }} />
                        </a>
                      </TableCell>
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

export default AdminView;
