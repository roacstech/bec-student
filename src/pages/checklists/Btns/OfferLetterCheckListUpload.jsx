import React, { useRef } from 'react';
import { Button } from '@mui/material';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3awsConfig from 'aws-config';
import { uploadOfferLetterChecklistFiles } from 'services/checklist/uploadOfferLetterChecklistFiles';

const OfferLetterCheckListUpload = ({ offerLetterData }) => {
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();
  console.log('offerLetterData:', offerLetterData);

  const uploadVisaDocumentMutation = useMutation({
    mutationFn: uploadOfferLetterChecklistFiles,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['enrollments']);
      if (data.status) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
        console.error(data.message);
      }
    },
    onError: (err) => {
      toast.error('Error uploading Visa document.');
      console.error(err);
    }
  });

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.error('No file selected.');
      return;
    }

    // Log the offerLetterData to see its structure
    console.log('offerLetterData:', offerLetterData);

    // Ensure the data is an array and contains the correct object
    const selectedEnrollment = offerLetterData; // Access first object if the array has only one object
    console.log('selectedEnrollment:', selectedEnrollment);

    if (!selectedEnrollment || !selectedEnrollment.enrollmentid) {
      toast.error('Selected enrollment not found.');
      console.error('Selected enrollment data is missing or malformed:', selectedEnrollment);
      return;
    }

    // Proceed with file handling logic
    const fileKey = `uploads/visa/${uuidv4()}-${file.name}`;
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
        checklistid: selectedEnrollment.checklistid,
        checklistitemid: selectedEnrollment.checklistitemid,
        documenttypeid: selectedEnrollment.checklisttypeid,
        checklistdataid: selectedEnrollment.checklistdataid,
        offerletterchecklisturl: fileUrl
      };

      uploadVisaDocumentMutation.mutate(payload);
    } catch (error) {
      console.error('S3 upload failed:', error);
      toast.error('File upload failed. Try again.');
    }
  };

  return (
    <>
      <input type="file" accept=".pdf,.doc,.docx,.png,.jpg" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} />
      <Button variant="outlined" color="primary" onClick={triggerFileInput}>
        Upload Files
      </Button>
    </>
  );
};

export default OfferLetterCheckListUpload;
