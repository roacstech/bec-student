import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField, Button, Typography, Divider, InputLabel } from '@mui/material';
import FileUploadDialog from './FileUploadDialog'; // your custom reusable uploader

const StudentDialog = ({
  open,
  onClose,
  title,
  studentData,
  setStudentData,
  handleChange,
  handleSave,
  openDialog,
  setOpenDialog,
  uploadType,
  setUploadType,
  handleFileUpload
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <InputLabel>Upload Certificates</InputLabel>
            <Button
              sx={{ mt: 1 }}
              variant="contained"
              fullWidth
              onClick={() => {
                setUploadType('studentCertificates');
                setOpenDialog(true);
              }}
            >
              Upload Files
            </Button>
            {Array.isArray(studentData.studentCertificates) && studentData.studentCertificates.length > 0 && (
              <ul style={{ paddingLeft: 20 }}>
                {studentData.studentCertificates.map((file, idx) => (
                  <li key={idx}>
                    <Typography variant="body2" color="textSecondary">
                      {file.split('/').pop()}
                    </Typography>
                  </li>
                ))}
              </ul>
            )}
          </Grid>

          {/* Additional upload fields can go here */}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>

      <FileUploadDialog open={openDialog} onClose={() => setOpenDialog(false)} onFileUpload={handleFileUpload} uploadType={uploadType} />
    </Dialog>
  );
};

export default StudentDialog;
