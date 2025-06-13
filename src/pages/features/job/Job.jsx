import { PlusOutlined } from '@ant-design/icons';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import CustomDrawer from 'components/drawer/CustomerDrawer';
import JobsTable from 'components/jobs/JobsTable';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { IoFilter } from 'react-icons/io5';
import { Link } from 'react-router-dom';

const Job = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State to control drawer visibility

  // const formattedStartDate =startDate && moment(state[0]&&.startDate).format('YYYY-MM-DD')
  // const formattedEndDate = endDate ? moment(state[0]?.endDate).format('YYYY-MM-DD')

  const [formData, setFormData] = useState({
    companyid: '',
    customerid: '',
    tenantstaffid: '',
    customerprojectid: '',
    customerbuildingid: '',
    lpoStatus: '',
    quotationStatus: '',
    from: '',
    to: ''
  });

  console.log('formData', formData);

  const toggleDrawer = (open) => {
    console.log('isDrawerOpen', isDrawerOpen);
    setIsDrawerOpen(open); // Update the state
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <Box width="100%" sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', mr: 2, gap: 2 }}>
              <Link to="/jobs/create">
                <Button variant="outlined" size="small" startIcon={<PlusOutlined />}>
                  Create
                </Button>
              </Link>
              <Tooltip title="Complaint filter" arrow>
                <IconButton
                  onClick={() => toggleDrawer(true)} // Open drawer on click
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark'
                    },
                    borderRadius: '50%'
                  }}
                >
                  <IoFilter />
                </IconButton>
              </Tooltip>
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <JobsTable filterData={formData} />
        </Grid>
      </Grid>

      {/* Reusable Drawer */}
      {isDrawerOpen && (
        <CustomDrawer
          isOpen={isDrawerOpen} // Control drawer visibility
          onClose={() => {
            toggleDrawer(false);
          }} // Close drawer on demand
          title="Filter Options"
          formData={formData}
          setFormData={setFormData}
        />
      )}
    </>
  );
};

export default Job;
