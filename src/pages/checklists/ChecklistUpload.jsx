import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, CircularProgress } from '@mui/material';

function ChecklistUpload({ checklistItemId, studentId }) {
  const [file, setFile] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('checklistItemId', checklistItemId);
    formData.append('studentId', studentId);

    setUploading(true);

    try {
      const response = await fetch('/api/upload-checklist-file', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('File uploaded successfully');
      } else {
        alert('Error uploading file');
      }
    } catch (error) {
      alert('Error uploading file');
    } finally {
      setUploading(false);
      setDialogOpen(false);
    }
  };

  const handleUploadClick = () => {
    setDialogOpen(true);
  };

  return (
    <div>
      {/* Upload Button */}
      <Button onClick={handleUploadClick} variant="contained" color="primary">
        Upload Document
      </Button>

      {/* Upload Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="file"
            variant="outlined"
            onChange={handleFileChange}
            inputProps={{
              accept: 'application/pdf, image/*' // Optional: Limit to specific file types
            }}
          />
          {uploading && <CircularProgress sx={{ display: 'block', marginTop: 2 }} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleFileUpload} variant="contained" color="primary" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ChecklistUpload;
