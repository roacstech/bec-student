import React, { useState, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
  Chip,
  Switch,
  Tabs,
  Tab,
  Box
} from '@mui/material';
import { EditOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { addDocument } from 'services/documents/document/addDocument';
import { updateDocumentStatus } from 'services/documents/document/updateDocumentStatus';
// import DocumentDialog from 'components/documents/document/DocumentDialog';
import { getDocument } from 'services/documents/document/getDocument';
import { editDocument } from 'services/documents/document/editDocument';

import Lottie from 'react-lottie';
import lottieLoader from 'assets/Lottie/NoLoaderData.json';

const loaderOptions = {
  loop: true,
  autoplay: true,
  animationData: lottieLoader,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

export default function Documents() {
  const queryClient = useQueryClient();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [documentName, setDocumentName] = useState('');
  const [documentImage, setDocumentImage] = useState('');
  const [documentTypeId, setDocumentTypeId] = useState('');
  const [currentDocument, setCurrentDocument] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const { data: documentData = [] } = useQuery({
    queryKey: ['documents'],
    queryFn: () => getDocument({ key: 0, documentid: '', documenttypeid: '' }),
    cacheTime: 300000, // Data is cached for 5 minutes
    refetchOnMount: false // Avoid refetching on component mount
  });

  const documents = documentData?.response;

  // Count the number of documents by status
  const allCount = documents?.length;
  const activeCount = documents?.filter((doc) => doc.status === 1).length;
  const inactiveCount = documents?.filter((doc) => doc.status === 2).length;

  const createMutation = useMutation({
    mutationFn: addDocument,
    onSuccess: () => {
      queryClient.refetchQueries(['documents']);
      setOpenCreateDialog(false);
      setDocumentName('');
      setDocumentImage('');
      setDocumentTypeId('');
      toast.success('Document created successfully');
    },
    onError: (error) => {
      toast.error(`Error creating document: ${error.message}`);
    }
  });

  const editMutation = useMutation({
    mutationFn: editDocument,
    onSuccess: () => {
      queryClient.refetchQueries(['documents']);
      setOpenEditDialog(false);
      setDocumentName('');
      setDocumentImage('');
      setDocumentTypeId('');
      toast.success('Document updated successfully');
    },
    onError: (error) => {
      toast.error(`Error updating document: ${error.message}`);
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateDocumentStatus,
    onSuccess: () => {
      queryClient.refetchQueries(['documents']);
      toast.success('Document status updated successfully');
    },
    onError: (error) => {
      toast.error(`Error updating document status: ${error.message}`);
    }
  });

  const handleAddDocument = useCallback(() => {
    createMutation.mutate({
      documentname: documentName,
      documenttypeid: documentTypeId,
      documentimage: documentImage
    });
  }, [documentName, documentTypeId, documentImage, createMutation]);

  const handleEditDocument = useCallback(() => {
    if (currentDocument) {
      editMutation.mutate({
        documentid: currentDocument.documentid,
        documentname: documentName,
        documenttypeid: documentTypeId,
        documentimage: documentImage
      });
    }
  }, [currentDocument, documentName, documentTypeId, documentImage, editMutation]);

  const handleToggleStatus = (document) => {
    const newStatus = document.status === 1 ? 2 : 1;

    const updatedDocuments = documents.map((doc) => (doc.documentid === document.documentid ? { ...doc, status: newStatus } : doc));

    queryClient.setQueryData(['documents'], updatedDocuments);

    updateStatusMutation.mutate(
      {
        documentid: document.documentid,
        key: newStatus
      },
      {
        onError: () => {
          queryClient.setQueryData(['documents'], documents);
        }
      }
    );
  };

  const handleOpenCreateDialog = () => {
    setDocumentName('');
    setDocumentImage('');
    setDocumentTypeId('');
    setOpenCreateDialog(true);
  };

  const handleOpenEditDialog = (document) => {
    setCurrentDocument(document);
    setDocumentName(document.documentname);
    setDocumentImage(document.documentimage || '');
    setDocumentTypeId(document.documenttypeid || '');
    setOpenEditDialog(true);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredDocuments = documents
    ?.filter((document) => {
      if (tabValue === 1) return document.status === 1; // Active
      if (tabValue === 2) return document.status === 2; // Inactive
      return true; // All
    })
    .filter((document) => document.documentname.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2
        }}
      >
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="All" icon={<Chip label={allCount} color="primary" variant="light" size="small" />} iconPosition="end" />
          <Tab label="Active" icon={<Chip label={activeCount} color="success" variant="light" size="small" />} iconPosition="end" />
          <Tab label="Inactive" icon={<Chip label={inactiveCount} color="default" variant="light" size="small" />} iconPosition="end" />
        </Tabs>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField label="Search Document" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <Button variant="contained" color="primary" onClick={handleOpenCreateDialog}>
            Create Document
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="document table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Document Image</TableCell>
              <TableCell>Document Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDocuments?.length > 0 ? (
              filteredDocuments?.map((document, index) => (
                <TableRow key={document.documentid}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {document.documentimage && (
                      <img
                        src={document.documentimage}
                        alt="Document"
                        style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{document.documentname}</TableCell>
                  <TableCell>{document.typename}</TableCell>
                  <TableCell>
                    <Chip label={document.status === 1 ? 'Active' : 'Inactive'} color={document.status === 1 ? 'primary' : 'default'} />
                  </TableCell>
                  <TableCell align="right">
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                      <IconButton color="primary" onClick={() => handleOpenEditDialog(document)}>
                        <EditOutlined />
                      </IconButton>
                      <Switch checked={document.status === 1} onChange={() => handleToggleStatus(document)} color="primary" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Lottie options={loaderOptions} height="25%" width="25%" />{' '}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* <DocumentDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSave={handleAddDocument}
        documentName={documentName}
        setDocumentName={setDocumentName}
        documentImage={documentImage}
        setDocumentImage={setDocumentImage}
        documentTypeId={documentTypeId}
        setDocumentTypeId={setDocumentTypeId}
        title="Create Document"
      />

      <DocumentDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        onSave={handleEditDocument}
        documentName={documentName}
        setDocumentName={setDocumentName}
        documentImage={documentImage}
        setDocumentImage={setDocumentImage}
        documentTypeId={documentTypeId}
        setDocumentTypeId={setDocumentTypeId}
        title="Edit Document"
      /> */}
    </div>
  );
}
