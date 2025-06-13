import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCheckListData } from 'services/checklist/getCheckListData';
import { getEnrollments } from 'services/enrollments/getEnrollments';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { AiOutlineEye, AiOutlineUpload, AiOutlineCheckCircle } from 'react-icons/ai';
import { MdOutlineFileUpload } from 'react-icons/md';
import MainCard from 'components/MainCard';
import { updateOfferLetterStatus } from 'services/enrollments/updateOfferLetterStatus';
import { SaveOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { uploadStudentChecklistFile } from 'services/checklist/uploadStudentChecklistFile';
import toast from 'react-hot-toast';
import StudentChecklistFileUpload from 'components/aws-fileupload/studentChecklistFileUpload';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

const CheckLists = () => {
  const { id } = useParams();
  console.log('Enrollment ID:', id);
  const queryClient = useQueryClient();
  const [tabIndex, setTabIndex] = useState(0);
  const [uploadedDocsPerTab, setUploadedDocsPerTab] = useState({});
  const [documentsData, setDocumentsData] = useState([]);

  const { data: checklistQuery } = useQuery({
    queryFn: () => getCheckListData({ enrollmentid: Number(id) }),
    queryKey: ['checkListData']
  });

  const { data: enrollmentQuery } = useQuery({
    queryFn: () => getEnrollments({ enrollmentid: Number(id) }),
    queryKey: ['enrollments']
  });

  const enrollmentData = enrollmentQuery?.response?.[0] || {};
  const checkListData = checklistQuery?.response || [];

  const mutation = useMutation({
    mutationFn: updateOfferLetterStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(['offerletterstatus']);
    }
  });

  const handleOfferLetterAction = (status) => {
    mutation.mutate({
      enrollmentid: enrollmentData.enrollmentid,
      studentid: enrollmentData.studentid,
      key: status
    });
  };

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const studentChecklistUploadMutation = useMutation({
    mutationFn: uploadStudentChecklistFile,
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message);
        queryClient.invalidateQueries(['checkListData']);
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => {
      toast.error(`Error uploading document: ${error.message}`);
    }
  });

  const handleUpload = (checklistid, checklistitemid, file, fileUrl, checklistdataid) => {
    setUploadedDocsPerTab((prev) => {
      const updatedDocs = prev[tabIndex] ? [...prev[tabIndex]] : [];
      const filteredDocs = updatedDocs.filter((doc) => doc.checklistitemid !== checklistitemid);

      return {
        ...prev,
        [tabIndex]: [...filteredDocs, { checklistid, checklistitemid, file, fileUrl, checklistdataid }]
      };
    });

    setDocumentsData((prev) => {
      const filtered = prev.filter((doc) => doc.checklistdataid !== checklistdataid);
      return [...filtered, { checklistdataid, documenturl: fileUrl }];
    });
  };

  const handleSaveUploads = () => {
    const payload = {
      enrollmentid: enrollmentData.enrollmentid,
      studentchecklistid: checkListData[tabIndex]?.studentchecklistid,
      documents: documentsData
    };

    studentChecklistUploadMutation.mutate(payload);
  };

  const DocumentCard = ({ title, url, status, onAccept, onReject }) => {
    return (
      <MainCard title={title}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography
            component="a"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: '#1976d2',
              textDecoration: 'none',
              fontWeight: 500,
              '&:hover': {
                textDecoration: 'underline',
                color: '#115293'
              }
            }}
          >
            View Document
          </Typography>

          {status === 2 ? (
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<CheckOutlined />}
                onClick={onAccept}
                size="small"
                sx={{ textTransform: 'none' }}
              >
                Accept
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<CloseOutlined />}
                onClick={onReject}
                size="small"
                sx={{ textTransform: 'none' }}
              >
                Reject
              </Button>
            </Stack>
          ) : (
            <Chip
              label={status === 1 ? 'Accepted' : status === 3 ? 'Rejected' : 'Unknown'}
              color={status === 1 ? 'primary' : 'error'}
              size="small"
              sx={{ borderRadius: '4px' }}
            />
          )}
        </Stack>
      </MainCard>
    );
  };

  const DocumentRow = ({ doc, checklist }) => {
    const hasUpload = uploadedDocsPerTab[tabIndex]?.some(
      (d) => d.checklistid === checklist.checklistid && d.checklistitemid === doc.checklistitemid
    );

    return (
      <TableRow>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body1">{doc.documentname}</Typography>
            {(doc.documenturl || hasUpload) && <AiOutlineCheckCircle color="#4CAF50" size={18} />}
          </Stack>
        </TableCell>
        <TableCell align="right">
          {doc.documenturl || hasUpload ? (
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
              <Button
                variant="outlined"
                size="medium"
                startIcon={<AiOutlineEye />}
                href={
                  hasUpload
                    ? URL.createObjectURL(
                        uploadedDocsPerTab[tabIndex]?.find(
                          (d) => d.checklistid === checklist.checklistid && d.checklistitemid === doc.checklistitemid
                        )?.file
                      )
                    : doc.documenturl
                }
                target="_blank"
                rel="noopener noreferrer"
                sx={{ textTransform: 'none' }}
              >
                View
              </Button>
            </Stack>
          ) : (
            // Upload button only shows if no file has been uploaded yet
            <StudentChecklistFileUpload
              checklistid={checklist.checklistid}
              checklistitemid={doc.checklistitemid}
              onFileUpload={({ checklistid, checklistitemid, file, fileUrl }) => {
                handleUpload(checklist.checklistid, doc.checklistitemid, file, fileUrl, doc.checklistdataid);
              }}
              buttonProps={{
                variant: 'contained',
                size: 'small',
                startIcon: <AiOutlineUpload />,
                color: 'primary',
                sx: { textTransform: 'none' }
              }}
            >
              Upload
            </StudentChecklistFileUpload>
          )}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* Document Cards Section */}
      <Stack spacing={2} mb={4}>
        {enrollmentData?.offerletterurl && (
          <DocumentCard
            title="Offer Letter"
            url={enrollmentData.offerletterurl}
            status={enrollmentData.offerletterstatus}
            onAccept={() => handleOfferLetterAction(1)}
            onReject={() => handleOfferLetterAction(3)}
          />
        )}

        {enrollmentData?.visaurl && <DocumentCard title="Visa" url={enrollmentData.visaurl} />}

        {enrollmentData?.coeurl && <DocumentCard title="Confirmation Of Enrollment" url={enrollmentData.coeurl} />}
      </Stack>

      {/* Checklists Section */}
      <MainCard>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: 'column'
          }}
        >
          <Tabs value={tabIndex} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            {checkListData.map((checklist, index) => (
              <Tab
                key={index}
                label={checklist.checklistname}
                icon={
                  checklist.documents.every((doc) => doc.documenturl) ? (
                    <AiOutlineCheckCircle color="#4CAF50" size={16} style={{ marginLeft: '8px' }} />
                  ) : null
                }
                iconPosition="end"
              />
            ))}
          </Tabs>

          {checkListData.map((checklist, index) => (
            <Box key={index} hidden={tabIndex !== index}>
              <TableContainer component={Paper}>
                <Table size="medium">
                  <TableBody>
                    {checklist.documents.map((doc) => (
                      <DocumentRow key={doc.checklistdataid} doc={doc} checklist={checklist} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Save Button */}
              {uploadedDocsPerTab[tabIndex]?.length >= 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={studentChecklistUploadMutation.isLoading ? <CircularProgress size={16} color="inherit" /> : <SaveOutlined />}
                    onClick={handleSaveUploads}
                    disabled={studentChecklistUploadMutation.isLoading}
                    sx={{
                      minWidth: 120,
                      textTransform: 'none',
                      borderRadius: '6px',
                      px: 3,
                      py: 1,
                      mt: 2
                    }}
                  >
                    {studentChecklistUploadMutation.isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </MainCard>
    </Box>
  );
};

export default CheckLists;
