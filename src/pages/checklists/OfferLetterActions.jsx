import React, { Fragment } from 'react';
import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { sendCheckList } from '../../services/checklist/sendChecklist';
import OfferLetterCheckListUpload from './Btns/OfferLetterCheckListUpload';

const OfferLetterActions = ({ offerLetterData, checklistName }) => {
  if (!offerLetterData) return null;

  const useridfromlocal = localStorage.getItem('userid'); // ✅ Grab user ID here

  const updateEnrollmentStatusMutation = useMutation({
    mutationFn: sendCheckList,
    onMutate: () => toast.loading('Updating status...'),
    onSuccess: (data) => {
      toast.dismiss();
      if (data.status) {
        toast.success('Enrollment status updated successfully!');
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    },
    onError: () => {
      toast.dismiss();
      toast.error('Failed to update enrollment status');
    }
  });

  const handleChecklistAction = (action) => {
    const isAcceptOrReject = action === 'accept' || action === 'reject';

    const payload = {
      userid: Number(useridfromlocal),
      studentid: offerLetterData.studentid,
      checklistid: offerLetterData.checklistid, // ✅ Always include it
      enrollmentid: offerLetterData.enrollmentid,
      enrollmentstatusid: isAcceptOrReject ? (action === 'accept' ? 4 : 5) : 1
    };

    console.log('Payload:', payload);
    updateEnrollmentStatusMutation.mutate(payload);
  };

  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop(); // This will use the file name from the URL
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Fragment>
      <Typography variant="h6" sx={{ px: 2 }}>
        Offer Letter Actions
      </Typography>

      {/* Conditionally render the buttons */}
      <Grid container spacing={2} alignItems="center" justifyContent="start" sx={{ p: 2 }}>
        <Grid item>
          <Button variant="contained" color="primary" href={offerLetterData.offerletterurl} target="_blank" rel="noopener noreferrer">
            View Letter
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" onClick={() => handleDownload(offerLetterData.offerletterurl)} color="primary" target="_blank">
            Download
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="success" onClick={() => handleChecklistAction('accept')}>
            Accept
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" color="error" onClick={() => handleChecklistAction('reject')}>
            Reject
          </Button>
        </Grid>
      </Grid>

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
            {offerLetterData?.enrollmentstatusid === 4 ? (
              <TableRow>
                <TableCell>{checklistName}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => window.open(checklist.documenturl, '_blank')}>
                    View
                  </Button>
                </TableCell>
                <TableCell>
                  <OfferLetterCheckListUpload offerLetterData={offerLetterData} />
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
};

export default OfferLetterActions;
