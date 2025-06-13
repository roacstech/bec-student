import React from 'react';
import { useDropzone } from 'react-dropzone';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@mui/material';
import { UploadOutlined } from '@ant-design/icons';
import s3awsConfig from 'aws-config';
import toast from 'react-hot-toast';

const StudentChecklistFileUpload = ({ checklistid, checklistitemid, onFileUpload }) => {
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
      await s3awsConfig.send(new PutObjectCommand(params));
      const fileUrl = `https://roacs-bucket.s3.ap-south-1.amazonaws.com/${fileKey}`;

      if (onFileUpload) {
        // You can also send the file object if needed
        onFileUpload({ checklistid, checklistitemid, file, fileUrl });
      }

      toast.success('File uploaded successfully!');
    } catch (error) {
      console.error('S3 upload failed:', error);
      toast.error('File upload to S3 failed');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '*',
    multiple: false
  });

  return (
    <div {...getRootProps()} style={{ display: 'inline-block' }}>
      <input {...getInputProps()} />
      <Button variant="contained" startIcon={<UploadOutlined />}>
        Upload
      </Button>
    </div>
  );
};

export default StudentChecklistFileUpload;
