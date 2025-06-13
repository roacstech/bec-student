import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCheckListData } from 'services/checklist/getCheckListData';
import { getCheckList } from 'services/checklist/getCheckList';
import FileUploadDialog from 'components/FileUploadDialog';
import OfferLetterActions from './OfferLetterActions';
import RequestReceiptTable from './RequestReceiptTable';

const ChecklistDetail = () => {
  const { checklistdataid } = useParams();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Fetch checklist data
  const { data, isLoading, isError } = useQuery({
    queryKey: ['checklistData', checklistdataid],
    queryFn: () => getCheckListData({ checklistdataid: Number(checklistdataid) })
  });

  const checklistData = data?.data;
  console.log('checklistdata:', checklistData);

  // Fetch checklist list
  const { data: checklistList = [] } = useQuery({
    queryKey: ['checklist'],
    queryFn: getCheckList
  });

  const checklistItem = checklistData?.find((item) => item.checklistdataid === Number(checklistdataid));

  // Get checklist name from checklistItem.checklistid
  const checklistName = checklistList.find((item) => item.checklistid === checklistItem?.checklistid)?.checklistname;

  const handleView = () => {
    if (checklistItem?.documenturl) {
      window.open(checklistItem.documenturl, '_blank');
    }
  };

  const handleUpload = () => {
    setUploadDialogOpen(true);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError || !checklistItem) return <div>Data not found.</div>;

  return (
    <Box p={4}>
      <Typography variant="h5" mb={2}>
        Checklist Item ID: {checklistItem.checklistdataid}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Checklist Name</TableCell>
              <TableCell>View</TableCell>
              <TableCell>Upload</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{checklistName || 'Unknown'}</TableCell>
              <TableCell>
                <Button variant="outlined" onClick={handleView} disabled={!checklistItem.documenturl}>
                  View
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="contained" onClick={handleUpload}>
                  Upload
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 4 }}>
        {checklistItem.offerletterurl?.startsWith('http') && (
          <Box mt={2}>
            <OfferLetterActions url={checklistItem.offerletterurl} offerLetterData={checklistItem} checklistName={checklistName} />
          </Box>
        )}
      </Box>

      <Box sx={{ mt: 4 }}>
        {checklistItem.receiptstatus === 'Requested' && (
          <Box mt={2}>
            <RequestReceiptTable checklistData={checklistData} checklistName={checklistName} />
          </Box>
        )}
      </Box>

      <Box sx={{ mt: 4 }}>
        {checklistItem.receiptstatus === 'Requested' && (
          <Box mt={2}>
            <RequestReceiptTable checklistData={checklistData} checklistName={checklistName} />
          </Box>
        )}
      </Box>

      <FileUploadDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onFileUpload={() => {}}
        checklist={checklistItem}
      />
    </Box>
  );
};

export default ChecklistDetail;
