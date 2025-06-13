import React from 'react';
import { useDropzone } from 'react-dropzone';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@mui/material';
import { UploadOutlined } from '@ant-design/icons';
import s3awsConfig from 'aws-config';
import toast from 'react-hot-toast';

const SpouseFileUpload = ({ onFileUpload }) => {
  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const fileKey = `uploads/${uuidv4()}-${file.name}`;
    const params = {
      Bucket: 'roacs-bucket',
      Key: fileKey,
      Body: new Uint8Array(await file.arrayBuffer()),
      ContentType: file.type
    };

    try {
      // Upload file to S3
      await s3awsConfig.send(new PutObjectCommand(params));

      // Get the file URL
      const fileUrl = `https://roacs-bucket.s3.ap-south-1.amazonaws.com/${fileKey}`;

      // Pass the file URL to the parent component for further handling
      if (onFileUpload) {
        onFileUpload(fileUrl);
      }

      toast.success('Spouse Resume uploaded successfully!');
    } catch (error) {
      console.error('S3 upload failed:', error);
      toast.error('File upload to S3 failed');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'application/pdf,application/msword,image/*',
    multiple: false
  });

  return (
    <div {...getRootProps()} style={{ textAlign: 'center', marginTop: '20px' }}>
      <input {...getInputProps()} />
      <Button fullWidth variant="contained" startIcon={<UploadOutlined />}>
        Upload spouse resume
      </Button>
    </div>
  );
};
export default SpouseFileUpload;
