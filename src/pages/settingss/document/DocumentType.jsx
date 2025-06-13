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
import { addDocumentType } from 'services/documents/documentType/addDocumentType';
import { updateDocumentTypeStatus } from 'services/documents/documentType/updateDocumentTypeStatus';
// import DocumentTypeDialog from 'components/documents/documentType/DocumentTypeDialog ';
import { getDocumentType } from 'services/documents/documentType/getDocumentType';
import { editDocumentType } from 'services/documents/documentType/editDocumentType';

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

export default function DocumentType() {
  const queryClient = useQueryClient();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [documentTypeName, setDocumentTypeName] = useState('');
  const [documentTypeImage, setDocumentTypeImage] = useState('');
  const [currentDocumentType, setCurrentDocumentType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const { data: documentData = [] } = useQuery({
    queryKey: ['documentTypes'],
    queryFn: () => getDocumentType(0),
    cacheTime: 300000, // Data is cached for 5 minutes
    refetchOnMount: false // Avoid refetching on component mount
  });

  const documentTypes = documentData?.response;

  // Count the number of document types by status
  const allCount = documentTypes?.length;
  const activeCount = documentTypes?.filter((type) => type.status === 1).length;
  const inactiveCount = documentTypes?.filter((type) => type.status === 2).length;

  const createMutation = useMutation({
    mutationFn: addDocumentType,
    onSuccess: () => {
      queryClient.refetchQueries(['documentTypes']);
      setOpenCreateDialog(false);
      setDocumentTypeName('');
      setDocumentTypeImage('');
      toast.success('Document type created successfully');
    },
    onError: (error) => {
      toast.error(`Error creating document type: ${error.message}`);
    }
  });

  const editMutation = useMutation({
    mutationFn: editDocumentType,
    onSuccess: () => {
      queryClient.refetchQueries(['documentTypes']);
      setOpenEditDialog(false);
      setDocumentTypeName('');
      setDocumentTypeImage('');
      toast.success('Document type updated successfully');
    },
    onError: (error) => {
      toast.error(`Error updating document type: ${error.message}`);
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateDocumentTypeStatus,
    onSuccess: () => {
      queryClient.refetchQueries(['documentTypes']);
      toast.success('Document type status updated successfully');
    },
    onError: (error) => {
      toast.error(`Error updating document type status: ${error.message}`);
    }
  });

  const handleAddDocumentType = useCallback(() => {
    createMutation.mutate({
      typename: documentTypeName,
      typeimage: documentTypeImage
    });
  }, [documentTypeName, documentTypeImage, createMutation]);

  const handleEditDocumentType = useCallback(() => {
    if (currentDocumentType) {
      editMutation.mutate({
        documenttypeid: currentDocumentType.documenttypeid,
        typename: documentTypeName,
        typeimage: documentTypeImage
      });
    }
  }, [currentDocumentType, documentTypeName, documentTypeImage, editMutation]);

  const handleToggleStatus = (documentType) => {
    const newStatus = documentType.status === 1 ? 2 : 1;

    const updatedDocumentTypes = documentTypes.map((type) =>
      type.documenttypeid === documentType.documenttypeid ? { ...type, status: newStatus } : type
    );

    queryClient.setQueryData(['documentTypes'], updatedDocumentTypes);

    updateStatusMutation.mutate(
      {
        documenttypeid: documentType.documenttypeid,
        key: newStatus
      },
      {
        onError: () => {
          queryClient.setQueryData(['documentTypes'], documentTypes);
        }
      }
    );
  };

  const handleOpenCreateDialog = () => {
    setDocumentTypeName('');
    setDocumentTypeImage('');
    setOpenCreateDialog(true);
  };

  const handleOpenEditDialog = (documentType) => {
    setCurrentDocumentType(documentType);
    setDocumentTypeName(documentType.typename);
    setDocumentTypeImage(documentType.typeimage || '');
    setOpenEditDialog(true);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredDocumentTypes = documentTypes
    ?.filter((documentType) => {
      if (tabValue === 1) return documentType.status === 1; // Active
      if (tabValue === 2) return documentType.status === 2; // Inactive
      return true; // All
    })
    .filter((documentType) => documentType.typename.toLowerCase().includes(searchTerm.toLowerCase()));

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
          <TextField label="Search Document Type" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <Button variant="contained" color="primary" onClick={handleOpenCreateDialog}>
            Create Document Type
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="document type table">
          <TableHead>
            <TableRow>
              <TableCell>Document Type ID</TableCell>
              <TableCell>Document Type Image</TableCell>
              <TableCell>Document Type Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDocumentTypes?.length > 0 ? (
              filteredDocumentTypes?.map((documentType) => (
                <TableRow key={documentType.documenttypeid}>
                  <TableCell>{documentType.documenttypeid}</TableCell>
                  <TableCell>
                    {documentType.typeimage && (
                      <img
                        src={documentType.typeimage}
                        alt="Document Type"
                        style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{documentType.typename}</TableCell>
                  <TableCell>
                    <Chip
                      label={documentType.status === 1 ? 'Active' : 'Inactive'}
                      color={documentType.status === 1 ? 'primary' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                      <IconButton color="primary" onClick={() => handleOpenEditDialog(documentType)}>
                        <EditOutlined />
                      </IconButton>
                      <Switch checked={documentType.status === 1} onChange={() => handleToggleStatus(documentType)} color="primary" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Lottie options={loaderOptions} height="25%" width="25%" />{' '}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* <DocumentTypeDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSave={handleAddDocumentType}
        documentTypeName={documentTypeName}
        setDocumentTypeName={setDocumentTypeName}
        documentTypeImage={documentTypeImage}
        setDocumentTypeImage={setDocumentTypeImage}
        title="Create Document Type"
      />

      <DocumentTypeDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        onSave={handleEditDocumentType}
        documentTypeName={documentTypeName}
        setDocumentTypeName={setDocumentTypeName}
        documentTypeImage={documentTypeImage}
        setDocumentTypeImage={setDocumentTypeImage}
        title="Edit Document Type"
      /> */}
    </div>
  );
}
