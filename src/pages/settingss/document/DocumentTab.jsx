import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Documents from './Documents';
import DocumentType from './DocumentType';
import MainCard from 'components/MainCard';
import { FaFileAlt, FaFolderOpen } from 'react-icons/fa'; // Import relevant icons

export default function DocumentTab() {
  const [value, setValue] = React.useState('one');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <MainCard>
        <Tabs value={value} onChange={handleChange} textColor="primary" indicatorColor="primary" aria-label="documents">
          <Tab value="one" label="Document" icon={<FaFileAlt />} iconPosition="start" />
          <Tab value="two" label="Document Type" icon={<FaFolderOpen />} iconPosition="start" />
        </Tabs>
        <Box sx={{ py: 3 }}>
          {value === 'one' && <Documents />}
          {value === 'two' && <DocumentType />}
        </Box>
      </MainCard>
    </Box>
  );
}
   