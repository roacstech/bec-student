import React, { useRef } from 'react';
import { Button } from '@mui/material';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3awsConfig from 'aws-config';
import { uploadCoeDocs } from 'services/checklist/uploadCoeDocs';

const CoeUploadBtn = ({ checklist }) => {
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const uploadCoeMutation = useMutation({
    mutationFn: uploadCoeDocs, // Assuming same API works for CoE, otherwise change this
    onSuccess: (data) => {
      queryClient.invalidateQueries(['enrollments']);
      if (data.status) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    },
    onError: (err) => {
      toast.error('Error uploading CoE.');
      console.error(err);
    }
  });

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.error('No file selected.');
      return;
    }

    const selectedEnrollment = checklist;
    if (!selectedEnrollment?.enrollmentid) {
      toast.error('Enrollment data missing.');
      return;
    }

    const fileKey = `uploads/coe/${uuidv4()}-${file.name}`; // CoE-specific path
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const params = {
        Bucket: 'roacs-bucket',
        Key: fileKey,
        Body: uint8Array,
        ContentType: file.type
      };

      const command = new PutObjectCommand(params);
      await s3awsConfig.send(command);

      const fileUrl = `https://roacs-bucket.s3.ap-south-1.amazonaws.com/${encodeURIComponent(fileKey)}`;

      const payload = {
        studentid: selectedEnrollment.studentid || selectedEnrollment.student?.studentid,
        checklistdataid: selectedEnrollment.checklistdataid,
        checklistid: selectedEnrollment.checklistid,
        checklistitemid: selectedEnrollment.checklistitemid,
        coeurl: fileUrl
      };

      uploadCoeMutation.mutate(payload);
    } catch (error) {
      console.error('S3 upload failed:', error);
      toast.error('CoE upload failed. Try again.');
    }
  };

  return (
    <>
      <input type="file" accept=".pdf,.doc,.docx,.png,.jpg" hidden ref={fileInputRef} onChange={handleFileChange} />
      <Button variant="outlined" color="primary" onClick={triggerFileInput}>
        Upload CoE Documents
      </Button>
    </>
  );
};

export default CoeUploadBtn;
