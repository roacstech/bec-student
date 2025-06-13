/* eslint-disable no-unused-vars */
import { Badge, Box, Chip, Fab, IconButton, Stack, Tooltip } from '@mui/material';
import DateRangePickerComp from 'components/DatePicker';
import LeadTable from 'components/Lead/LeadTable';
import { useState } from 'react';
import EnquiryModal from 'components/Lead/EnquiryModal';
import { FilterOutlined, UserOutlined } from '@ant-design/icons';
import { format } from 'date-fns';

function Lead() {
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [selectedDate, setSelectedDate] = useState('');
  console.log('selectedDate', selectedDate);
  const [enquiryModal, setEnquiryModal] = useState(false);

  return (
    <Box>
      <Stack alignItems="end" direction="row" justifyContent="space-between">
        <Chip
          variant="outlined"
          size="medium"
          color="success"
          label={`${
            selectedDate ? `${format(selectedDate[0].startDate, 'dd-MMM-yy')} To  ${format(selectedDate[0].endDate, 'dd-MMM-yy')}` : 'All'
          }`}
        />
        <Stack direction="row" gap={2} sx={{ ml: 'auto' }}>
          {/* <Fab size="medium" color="info" onClick={() => setEnquiryModal(!enquiryModal)}>
            <UserOutlined />
          </Fab> */}
          <Tooltip title="Order filter">
            <Fab color="primary" size="medium" onClick={() => setOpen(!open)}>
              <FilterOutlined />
            </Fab>
          </Tooltip>
          <DateRangePickerComp setSelectedDate={setSelectedDate} open={open} setOpen={setOpen} />
        </Stack>
        <EnquiryModal open={enquiryModal} handleClose={() => setEnquiryModal(!enquiryModal)} />
      </Stack>
      <Box mt={3}>
        <LeadTable date={selectedDate} />
      </Box>
    </Box>
  );
}

export default Lead;
