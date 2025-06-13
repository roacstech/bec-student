import React from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { BsBuildings } from 'react-icons/bs';
import { ScheduleOutlined } from '@ant-design/icons';
import { IoNewspaperOutline } from 'react-icons/io5';
// import QuotationReport from 'components/reports/quotation/QuotationReport';
// import JobReport from 'components/reports/job/JobReport';
// import SiteVisitReport from 'components/reports/sitevisit/SiteVisitReport';
// import ScheduleReport from 'components/reports/schedule/ScheduleReport';
// import PriorReport from 'components/reports/prior/PriorReport';

const ReportTab = () => {
  const [value, setValue] = React.useState('one');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={value} onChange={handleChange} textColor="primary" indicatorColor="primary" aria-label="lead">
        <Tab value="one" label="Quotation" icon={<IoNewspaperOutline />} iconPosition="start" />
        <Tab value="two" label="job" icon={<ScheduleOutlined />} iconPosition="start" />
        <Tab value="three" label="PPM Schedule" icon={<ScheduleOutlined />} iconPosition="start" />
        {/* <Tab value="four" label="Prior" icon={<ScheduleOutlined />} iconPosition="start" /> */}
        <Tab value="five" label="Site Visit" icon={<BsBuildings />} iconPosition="start" />
      </Tabs>
      {/* <Box sx={{ py: 3 }}>
        {value === 'one' && <QuotationReport />}
        {value === 'two' && <JobReport />}
        {value === 'three' && <ScheduleReport />}
        {value === 'four' && <PriorReport />}
        {value === 'five' && <SiteVisitReport />}
      </Box> */}
    </Box>
  );
};

export default ReportTab;
