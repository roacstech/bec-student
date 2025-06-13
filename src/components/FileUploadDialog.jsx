import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField
} from '@mui/material';
import { CheckCircleOutlined, CloudUploadOutlined, InsertRowRightOutlined, SearchOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { uploadStudentFile } from 'services/uploadfiles/uploadStudentFile';
import { PutObjectCommand } from '@aws-sdk/client-s3'; // AWS SDK for S3
import s3awsConfig from '../aws-config';
import toast from 'react-hot-toast';

const FileUploadDialog = ({ open, onClose, onFileUpload, checklist }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const uploadFileMutation = useMutation({
    mutationFn: uploadStudentFile,
    onSuccess: (data) => {
      toast.success('File uploaded successfully!');
      onClose();
    },
    onError: (err) => {
      toast.error('Failed to upload file. Please try again.');
      console.log(err);
    }
  });

  // Single onDrop function for file upload to AWS S3 and backend
  const onDrop = async (acceptedFiles) => {
    for (const file of acceptedFiles) {
      const fileKey = `uploads/${uuidv4()}-${file.name}`;
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const params = {
        Bucket: 'roacs-bucket', // Your S3 bucket name
        Key: fileKey,
        Body: uint8Array,
        ContentType: file.type
      };

      const command = new PutObjectCommand(params);

      try {
        await s3awsConfig.send(command); // Upload to S3
        const fileUrl = `https://roacs-bucket.s3.ap-south-1.amazonaws.com/${fileKey}`;

        // After S3 upload, prepare file data to send to backend
        const fileData = {
          checklistdataid: checklist.checklistdataid,
          documenturl: fileUrl
        };

        // Call mutation to upload the file data to backend
        uploadFileMutation.mutate(fileData);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  const useSelectedFile = () => {
    const file = filesData[selectedImageIndex];
    onFileUpload(file.fileurl);
    onClose();
  };

  const viewFileInNewTab = (file) => {
    window.open(file.fileurl, '_blank');
  };

  const {
    getRootProps,
    getInputProps,
    open: openFileDialog
  } = useDropzone({
    onDrop,
    accept: 'image/*,application/pdf'
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Upload Student Files</DialogTitle>
      <DialogContent>
        <Box
          {...getRootProps()}
          sx={{
            cursor: 'pointer',
            border: '2px dashed #aaa',
            p: 3,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': { borderColor: 'green' }
          }}
        >
          <input {...getInputProps()} />
          <CloudUploadOutlined style={{ fontSize: 40, color: 'green' }} />
          <Typography variant="h6">Drag and drop files here</Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={(e) => {
              e.stopPropagation();
              openFileDialog();
            }}
          >
            Browse Files
          </Button>
        </Box>

        <TextField
          fullWidth
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ my: 2 }}
          InputProps={{ startAdornment: <SearchOutlined sx={{ mr: 1 }} /> }}
        />

        <Grid container spacing={2} sx={{ maxHeight: 300, overflowY: 'auto' }}>
          {/* Render file previews if any */}
          {/* {filesData
            .filter((file) => file.filename.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((file, index) => (
              <Grid item xs={6} sm={4} md={3} key={file.fileurl}>
                <Card
                  sx={{
                    border: selectedImageIndex === index ? '2px solid green' : 'none',
                    cursor: 'pointer',
                    boxShadow: 1,
                    '&:hover': { boxShadow: 3 }
                  }}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <CardContent sx={{ p: 1, textAlign: 'center' }}>
                    {file.filetype.startsWith('image') ? (
                      <img
                        src={file.fileurl}
                        alt={file.filename}
                        style={{ width: '100%', height: 120, objectFit: 'cover' }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 120,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f4f4f4'
                        }}
                      >
                        <InsertRowRightOutlined style={{ fontSize: 40, color: '#999' }} />
                      </Box>
                    )}
                    <Typography variant="body2" noWrap>{file.filename}</Typography>
                  </CardContent>
                  {selectedImageIndex === index && (
                    <Box sx={{ position: 'absolute', top: 5, right: 5 }}>
                      <CheckCircleOutlined style={{ color: 'green' }} />
                    </Box>
                  )}
                </Card>
              </Grid>
            ))} */}
        </Grid>
      </DialogContent>

      <DialogActions>
        {selectedImageIndex !== null && (
          <>
            <Button variant="contained" onClick={useSelectedFile}>
              Use
            </Button>
            <Button variant="outlined" onClick={() => viewFileInNewTab(filesData[selectedImageIndex])}>
              Full Screen
            </Button>
          </>
        )}
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileUploadDialog;
