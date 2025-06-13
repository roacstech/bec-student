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
  Box,
  TablePagination,
  Autocomplete,
  Typography
} from '@mui/material';
import { EditOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getAllComplaintType } from 'services/complainttype/getAllComplaintType';
import { createComplaintType } from 'services/complainttype/createComplaintType';
import { editComplaintType } from 'services/complainttype/editComplaintType';
import ComplaintTypeDialog from './ComplaintTypeDialog';

import Lottie from 'react-lottie';
import lottieLoader from 'assets/Lottie/NoLoaderData.json';
import { updateComplaintTypeStatus } from 'services/complainttype/updateComplaintTypeStatus';

const loaderOptions = {
  loop: true,
  autoplay: true,
  animationData: lottieLoader,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

export default function ComplaintTypeTable() {
  const queryClient = useQueryClient();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [complainttypename, setcomplainttypename] = useState('');

  const [currentComplaintType, setCurrentComplaintType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedCompanyIdDialog, setSelectedCompanyIdDialog] = useState(0);
  const [selectedCompanyId, setSelectedCompanyId] = useState(0);

  const { data: complaintTypesData = [] } = useQuery({
    queryKey: ['allComplaintTypes'],
    queryFn: () => getAllComplaintType({ key: 0 }),
    cacheTime: 300000,
    refetchOnMount: false
  });

  const complaintTypes = complaintTypesData?.response;

  const allCount = complaintTypes?.length;
  const activeCount = complaintTypes?.filter((complaintType) => complaintType.complainttypestatus === 1).length;
  const inactiveCount = complaintTypes?.filter((complaintType) => complaintType.complainttypestatus === 2).length;

  const createMutation = useMutation({
    mutationFn: createComplaintType,
    onSuccess: (data) => {
      // console.log("???????", data)

      queryClient.refetchQueries(['allComplaintTypes']);
      if (data?.status) {
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
      setOpenCreateDialog(false);
      setcomplainttypename('');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const editMutation = useMutation({
    mutationFn: editComplaintType,
    onSuccess: () => {
      queryClient.refetchQueries(['allComplaintTypes']);
      setOpenEditDialog(false);
      setcomplainttypename('');

      toast.success('ComplaintType updated successfully');
    },
    onError: (error) => {
      toast.error(`Error updating complaintType: ${error.message}`);
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateComplaintTypeStatus,
    onSuccess: (data) => {
      if (data?.data?.status) {
        toast.success(data?.data?.message);
      } else {
        toast.error(data?.data?.message);
      }
      queryClient.refetchQueries(['allComplaintTypes']);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleAddComplaintType = useCallback(() => {
    createMutation.mutate({
      complainttypename: complainttypename
    });
  }, [complainttypename, createMutation]);

  const handleEditComplaintType = useCallback(() => {
    if (currentComplaintType) {
      editMutation.mutate({
        complainttypeid: currentComplaintType.complainttypeid,
        complainttypename: complainttypename
      });
    }
  }, [currentComplaintType, complainttypename, editMutation]);

  const handleToggleStatus = (complaintType) => {
    const newStatus = complaintType.complainttypestatus === 1 ? 2 : 1;
    const updatedComplaintTypes = complaintTypes.map((p) =>
      p.complainttypeid === complaintType.complainttypeid ? { ...p, complainttypestatus: newStatus } : p
    );
    queryClient.setQueryData(['allComplaintTypes'], updatedComplaintTypes);

    updateStatusMutation.mutate(
      {
        complainttypeid: complaintType.complainttypeid,
        key: newStatus
      },
      {
        onError: () => {
          queryClient.setQueryData(['allComplaintTypes'], complaintTypes);
        }
      }
    );
  };

  const handleOpenCreateDialog = () => {
    setcomplainttypename('');

    setOpenCreateDialog(true);
    setSelectedCompanyIdDialog(null);
  };

  const handleOpenEditDialog = (complaintType) => {
    setCurrentComplaintType(complaintType);
    setcomplainttypename(complaintType.complainttypename);

    setOpenEditDialog(true);
    setSelectedCompanyIdDialog(complaintType.companyid);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Fetch company data
  const { data: allCompany } = useQuery({
    queryFn: () => getAllCompany(1),
    queryKey: ['allCompany'],
    cacheTime: 300000,
    refetchOnMount: false
  });

  const filteredComplaintTypes = complaintTypes
    ?.filter((complaintType) => {
      if (tabValue === 1) return complaintType.complainttypestatus === 1;
      if (tabValue === 2) return complaintType.complainttypestatus === 2;
      return true;
    })
    .filter((complaintType) => complaintType?.complainttypename?.toLowerCase().includes(searchTerm.toLowerCase()));

  const paginatedComplaintTypes = filteredComplaintTypes?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="All" icon={<Chip label={allCount} color="primary" variant="light" size="small" />} iconPosition="end" />
          <Tab label="Active" icon={<Chip label={activeCount} color="success" variant="light" size="small" />} iconPosition="end" />
          <Tab label="Inactive" icon={<Chip label={inactiveCount} color="default" variant="light" size="small" />} iconPosition="end" />
        </Tabs>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* <Autocomplete
            fullWidth
            options={allCompany}
            value={allCompany?.find((company) => company.companyid === selectedCompanyId) || null}
            getOptionLabel={(option) => option.companyname || 'Unknown'} // Display companyname
            onChange={(event, newValue) => {
              setSelectedCompanyId(newValue ? newValue.companyid : ''); // Set selected companyid
            }}
            renderInput={(params) => <TextField {...params} label="Select Company" placeholder="Company" />}
          /> */}
          <TextField label="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <Button variant="contained" color="primary" onClick={handleOpenCreateDialog}>
            Add
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="complaintTypes table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Complaint Type Name</TableCell>

              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedComplaintTypes?.length > 0 ? (
              paginatedComplaintTypes?.map((complaintType, index) => (
                <TableRow key={index}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body1" color="initial">
                        {complaintType.complainttypename}
                      </Typography>
                      <Typography variant="body2" color="primary">
                        {complaintType.companyname}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={complaintType.complainttypestatus === 1 ? 'Active' : 'Inactive'}
                      color={complaintType.complainttypestatus === 1 ? 'primary' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                      <IconButton color="primary" onClick={() => handleOpenEditDialog(complaintType)}>
                        <EditOutlined />
                      </IconButton>
                      <Switch
                        checked={complaintType.complainttypestatus === 1}
                        onChange={() => handleToggleStatus(complaintType)}
                        color="primary"
                      />
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

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        component="div"
        count={filteredComplaintTypes?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {openCreateDialog && (
        <ComplaintTypeDialog
          open={openCreateDialog}
          onClose={() => setOpenCreateDialog(false)}
          onSave={handleAddComplaintType}
          complainttypename={complainttypename}
          setcomplainttypename={setcomplainttypename}
          title="Add ComplaintType"
          setSelectedCompanyIdDialog={setSelectedCompanyIdDialog}
          selectedCompanyIdDialog={selectedCompanyIdDialog}
        />
      )}

      {openEditDialog && (
        <ComplaintTypeDialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          onSave={handleEditComplaintType}
          complainttypename={complainttypename}
          setcomplainttypename={setcomplainttypename}
          title="Edit ComplaintType"
          setSelectedCompanyIdDialog={setSelectedCompanyIdDialog}
          selectedCompanyIdDialog={selectedCompanyIdDialog}
        />
      )}
    </div>
  );
}
