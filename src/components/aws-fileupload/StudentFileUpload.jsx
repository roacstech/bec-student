import React from 'react';
import { useDropzone } from 'react-dropzone';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { Button, Box } from '@mui/material';
import { UploadOutlined } from '@ant-design/icons';
import s3awsConfig from 'aws-config';
import toast from 'react-hot-toast';

const StudentFileUpload = ({ onFileUpload, fileLabel = 'Upload File' }) => {
  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const fileKey = `student-docs/${uuidv4()}-${file.name}`;

    const params = {
      Bucket: 'roacs-bucket',
      Key: fileKey,
      Body: new Uint8Array(await file.arrayBuffer()),
      ContentType: file.type
    };

    try {
      await s3awsConfig.send(new PutObjectCommand(params));
      const fileUrl = `https://roacs-bucket.s3.ap-south-1.amazonaws.com/${fileKey}`;
      toast.success('File uploaded successfully!');
      onFileUpload(fileUrl);
    } catch (error) {
      console.error('Student file upload failed:', error);
      toast.error('Upload failed. Please try again.');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false
  });

  return (
    <Box {...getRootProps()} sx={{ mt: 2, textAlign: 'center' }}>
      <input {...getInputProps()} />
      <Button fullWidth variant="outlined" startIcon={<UploadOutlined />}>
        {fileLabel}
      </Button>
    </Box>
  );
};

export default StudentFileUpload;
