import React from 'react';
import Lead from './Lead';
import { Box, Tab, Tabs } from '@mui/material';
import LeadSourceTable from 'pages/settingss/LeadSource';
import LeadStageTable from 'pages/settingss/LeadStage';
import LeadstatusTable from 'pages/settingss/LeadStatus';
import { FaListAlt, FaClipboardList, FaProjectDiagram, FaTasks } from 'react-icons/fa'; // Import relevant icons

const LeadPageTabs = () => {
  const [value, setValue] = React.useState('one');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        aria-label="lead"
      >
        <Tab value="one" label="LIST" icon={<FaListAlt />} iconPosition="start" />
        <Tab value="two" label="SOURCE" icon={<FaClipboardList />} iconPosition="start" />
        <Tab value="three" label="STAGE" icon={<FaProjectDiagram />} iconPosition="start" />
        <Tab value="four" label="STATUS" icon={<FaTasks />} iconPosition="start" />
      </Tabs>
      <Box sx={{ py: 3 }}>
        {value === 'one' && <Lead />}
        {value === 'two' && <LeadSourceTable />}
        {value === 'three' && <LeadStageTable />}
        {value === 'four' && <LeadstatusTable />} {/* Corrected the component name */}
      </Box>
    </Box>
  );
};

export default LeadPageTabs;
