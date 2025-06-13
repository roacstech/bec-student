import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Badge from '@mui/material/Badge';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { UploadOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getCheckListData } from 'services/checklist/getCheckListData';
import toast from 'react-hot-toast';
import FileUploadDialog from 'components/FileUploadDialog';
import { sendCheckList } from 'services/checklist/sendChecklist';
import { getCheckList } from 'services/checklist/getCheckList';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router';

export default function CheckListsTable() {
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [selectedChecklist, setSelectedChecklist] = useState(null);
  const [fileUploadDialogOpen, setFileUploadDialogOpen] = useState(false);
  const [checklistDialogOpen, setChecklistDialogOpen] = useState(false);
  const navigate = useNavigate();

  const useridfromlocal = localStorage.getItem('userid');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['checklistData', Number(useridfromlocal)],
    queryFn: async () => getCheckListData({ userid: Number(useridfromlocal) })
  });

  const checklistData = data?.data || [];

  const { data: checklistitems } = useQuery({
    queryFn: () => getCheckList(),
    queryKey: ['checklist']
  });

  const checklistItems = checklistitems || [];

  const checklistNameMap = {};
  checklistItems?.forEach((item) => {
    checklistNameMap[item.checklistid] = item.checklistname;
  });

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

  const handleOpenChecklistDialog = (checklist) => {
    const checklistType = checklistNameMap[checklist.checklistid]?.toLowerCase();

    if (checklistType.includes('general')) {
      navigate(`/checklist/general/${checklist.checklistdataid}`);
    } else if (checklistType.includes('acceptance')) {
      navigate(`/checklist/acceptance/${checklist.checklistdataid}`);
    } else {
      navigate(`/checklist/${checklist.checklistdataid}`);
    }
  };

  const handleOpenFileUploadDialog = (checklist) => {
    setSelectedChecklist(checklist);
    setFileUploadDialogOpen(true);
  };

  const handleCloseChecklistDialog = () => {
    setSelectedChecklist(null);
    setChecklistDialogOpen(false);
  };

  const handleCloseFileUploadDialog = () => {
    setSelectedChecklist(null);
    setFileUploadDialogOpen(false);
  };

  const handleChecklistAction = (action) => {
    if (!selectedChecklist) return;

    const payload = {
      userid: Number(useridfromlocal),
      studentid: selectedChecklist.studentid,
      checklistid: selectedChecklist.checklistid,
      enrollmentid: selectedChecklist.enrollmentid,
      enrollmentstatusid: action === 'accept' ? 4 : 5
    };

    updateEnrollmentStatusMutation.mutate(payload);
    setChecklistDialogOpen(false);
  };

  const handleFileSelectFromDialog = (url) => {
    if (selectedChecklist) {
      setUploadedFiles((prev) => ({
        ...prev,
        [selectedChecklist.checklistdataid]: url
      }));
      toast.success('File linked from library!');
      setFileUploadDialogOpen(false);
    }
  };

  if (isLoading) return <Typography>Loading checklist...</Typography>;
  if (isError) return <Typography>Error fetching checklist data.</Typography>;

  return (
    <>
      <MainCard title="Checklists">
        <Grid container spacing={2}>
          {checklistData.length > 0 ? (
            checklistData.map((checklist) => {
              const uploadedUrl = uploadedFiles[checklist.checklistdataid] || checklist.documenturl;
              const documentUploaded = !!uploadedUrl;
              const timeAgo = checklist.created_at ? formatDistanceToNow(new Date(checklist.created_at), { addSuffix: true }) : null;
              const createdAtIST = new Date(checklist.created_at).toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                hour12: true,
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={checklist.checklistdataid}>
                  <Card
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      boxShadow: 4,
                      transition: 'transform 0.3s ease',
                      position: 'relative',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      backgroundColor: '#E6F3EC', // Green background
                      color: 'white' // White text color
                    }}
                  >
                    <Box>
                      {/* Header */}
                      <Box
                        sx={{
                          backgroundColor: '#2C6B31', // Darker green shade for badge background
                          p: 1.5,
                          borderRadius: '12px', // Round the corners for a badge-like appearance
                          mb: 2,
                          color: 'white',
                          textAlign: 'center'
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight={600}>
                          {checklistNameMap[checklist.checklistid] || 'Unnamed Checklist'}
                        </Typography>
                      </Box>

                      {/* Status */}
                      <Typography
                        variant="body2"
                        gutterBottom
                        color={documentUploaded ? 'success.main' : 'error.main'}
                        sx={{ textAlign: 'center' }}
                      >
                        {documentUploaded ? 'File Uploaded' : 'No File Uploaded'}
                      </Typography>

                      {/* Metadata */}
                      <Typography variant="caption" color="black" sx={{ textAlign: 'center', display: 'block' }}>
                        Checklist ID: <strong>{checklist.checklistdataid}</strong>
                      </Typography>
                      <Typography
                        variant="caption"
                        color="black"
                        sx={{
                          textAlign: 'center',
                          fontStyle: 'italic',
                          display: 'block',
                          marginBottom: '8px'
                        }}
                      >
                        Uploaded {timeAgo} <br />
                        <span>({createdAtIST})</span>
                      </Typography>
                    </Box>

                    {/* Actions */}
                    <Box mt={2} display="flex" gap={1} justifyContent="center">
                      <Button
                        size="medium"
                        variant="outlined"
                        sx={{
                          color: 'black',
                          borderColor: 'black',
                          width: '100%',
                          textAlign: 'center',
                          '&:hover': {
                            backgroundColor: '#f1f1f1' // Optional: hover effect for button
                          }
                        }}
                        onClick={() => handleOpenChecklistDialog(checklist)}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Grid item xs={12}>
              <Typography align="center" variant="body1" color="textSecondary">
                No Checklist Data Available
              </Typography>
            </Grid>
          )}
        </Grid>
      </MainCard>

      {/* File Upload Dialog */}
      {fileUploadDialogOpen && selectedChecklist && (
        <FileUploadDialog
          open={fileUploadDialogOpen}
          onClose={handleCloseFileUploadDialog}
          uploadType="checklist"
          onFileUpload={handleFileSelectFromDialog}
          checklist={selectedChecklist}
        />
      )}
      {/* Checklist Action Dialog */}
      {checklistDialogOpen && selectedChecklist && (
        <Dialog open={checklistDialogOpen} onClose={handleCloseChecklistDialog} fullWidth maxWidth="sm">
          <DialogTitle>Checklist Details</DialogTitle>
          <DialogContent dividers>
            <Typography variant="subtitle1">Checklist ID: {selectedChecklist.checklistid}</Typography>
            <Typography variant="subtitle2">Checklist Item ID: {selectedChecklist.checklistitemid}</Typography>
            <Typography sx={{ mt: 2 }}>
              {selectedChecklist.documenturl ? (
                <a href={selectedChecklist.documenturl} target="_blank" rel="noopener noreferrer">
                  View Document
                </a>
              ) : (
                'No document uploaded'
              )}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={() => handleChecklistAction('accept')}>
              Accept
            </Button>
            <Button variant="outlined" onClick={() => handleChecklistAction('reject')}>
              Reject
            </Button>
            {selectedChecklist.documenturl && (
              <>
                <Button variant="text" onClick={() => window.open(selectedChecklist.documenturl, '_blank')}>
                  View
                </Button>
                <Button
                  variant="text"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = selectedChecklist.documenturl;
                    link.download = `checklist-${selectedChecklist.checklistid}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  Download
                </Button>
              </>
            )}
            <Button variant="text" onClick={handleCloseChecklistDialog}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
