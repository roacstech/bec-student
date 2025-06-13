import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadOutlined } from '@ant-design/icons';
import { Box, Typography } from '@mui/material';

const FileUpload = ({ onFileUpload }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      onFileUpload(acceptedFiles);
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*,application/pdf', // Accepts images and PDFs
    multiple: true
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        width: '100%', // Full width
        border: '2px dashed #068E44', // Dashed green border
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: isDragActive ? '#f0fff4' : 'white', // Light green background when dragging
        transition: 'background-color 0.2s ease-in-out'
      }}
    >
      <input {...getInputProps()} />
      <UploadOutlined style={{ fontSize: 50, color: '#068E44' }} />
      <Typography variant="body1" color="#068E44">
        {isDragActive ? 'Drop files here...' : 'Drag & drop files here, or click to browse'}
      </Typography>
    </Box>
  );
};

export default FileUpload;
