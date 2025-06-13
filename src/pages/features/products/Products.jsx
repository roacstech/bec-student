import React from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import ProductTable from 'components/products/ProductTable';
import Category from 'pages/settingss/Category';
import { FaListAlt, FaTags } from 'react-icons/fa'; // Import relevant icons

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
        <Tab value="two" label="CATEGORY" icon={<FaTags />} iconPosition="start" />
      </Tabs>
      <Box sx={{ py: 3 }}>
        {value === 'one' && <ProductTable />}
        {value === 'two' && <Category />}
      </Box>
    </Box>
  );
};

export default LeadPageTabs;
