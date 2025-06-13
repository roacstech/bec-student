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
  Typography,
  Collapse,
  Tooltip,
  Avatar
} from '@mui/material';
import { CloseOutlined, EditOutlined, EyeTwoTone } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useAuth from 'hooks/useAuth';
import MainCard from 'components/MainCard';
import AdminFormDialog from './AdminFormDialog';
import { useTheme } from '@mui/material/styles';

import Lottie from 'react-lottie';
import lottieLoader from '../../assets/Lottie/NoLoaderData.json';
import { BsEyeFill } from 'react-icons/bs';
import { useNavigate } from 'react-router';
import AdminView from './AdminView';
import { getAdmin } from 'services/admin/getAdmin';
import { editAdmin } from 'services/admin/editAdmin';
import { updateAdminStatus } from 'services/admin/updateAdminStatus';
import { createAdmin } from 'services/admin/createAdmin';

const loaderOptions = {
  loop: true,
  autoplay: true,
  animationData: lottieLoader,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

export default function AdminTable() {
  const queryClient = useQueryClient();
  const [viewOpen, setViewOpen] = useState(false);

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [adminData, setAdminData] = useState({
    adminid: '',
    adminname: '',
    adminprimarycontact: '',
    adminaltercontact: '',
    adminimage: '',
    adminprimaryemail: '',
    adminalteremail: '',
    adminuniqueid: '',
    adminsignature: ''
  });

  console.log('adminData in table', adminData);
  const [editAdminState, setEditAdminState] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [contact, setContact] = useState('');
  const [altercontact, setAltercontact] = useState('');
  const { userDetails } = useAuth();
  const theme = useTheme();

  const { data: admins = [] } = useQuery({
    queryKey: ['Admin'],
    queryFn: () => getAdmin(),
    cacheTime: 300000, // Data is cached for 5 minutes
    refetchOnMount: false // Avoid refetching on component mount
  });

  const navigate = useNavigate();

  // Count the number of admins by status
  const allCount = admins.length;
  const activeCount = admins.filter((admin) => admin?.adminstatus === 1).length;
  const inactiveCount = admins.filter((admin) => admin?.adminstatus === 2).length;

  const createMutation = useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      queryClient.refetchQueries(['Admin']);
      setOpenCreateDialog(false);
      setAdminData({
        adminid: '',
        adminname: '',
        adminprimarycontact: '',
        adminaltercontact: '',
        adminimage: '',
        adminprimaryemail: '',
        adminalteremail: '',
        adminuniqueid: '',
        adminsignature: ''
      });
      setContact('');
      setAltercontact('');
      toast.success('Admin created successfully');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: editAdmin,
    onSuccess: () => {
      queryClient.refetchQueries(['Admin']);
      queryClient.refetchQueries(['tasks']);
      setOpenEditDialog(false);
      toast.success('Admin updated successfully');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    }
  });

  const updateAdminMutation = useMutation({
    mutationFn: updateAdminStatus,
    onSuccess: () => {
      queryClient.refetchQueries(['Admin']);
      toast.success('Admin status updated successfully');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    }
  });

  const handleCreateAdmin = useCallback(() => {
    createMutation.mutate({
      ...adminData,
      contact: contact,
      altercontact: altercontact
    });
  }, [adminData, createMutation]);

  const handleEditAdminState = useCallback(() => {
    if (editAdminState) {
      updateMutation.mutate({
        ...adminData,
        contact: contact,
        altercontact: altercontact
      });
    }
  }, [editAdminState, adminData, updateMutation]);

  const handleToggleStatus = (admin) => {
    const newStatus = admin.adminstatus === 1 ? 2 : 1;

    const updatedAdmins = admins.map((cat) => (cat.adminid === admin.adminid ? { ...cat, adminstatus: newStatus } : cat));

    queryClient.setQueryData(['Admin'], updatedAdmins);

    updateAdminMutation.mutate(
      {
        adminid: admin.adminid,
        key: newStatus
      },
      {
        onError: () => {
          queryClient.setQueryData(['Admin'], admins);
        }
      }
    );
  };

  const handleOpenCreateDialog = () => {
    setAdminData({
      adminid: '',
      adminname: '',
      adminprimarycontact: '',
      adminaltercontact: '',
      adminimage: '',
      adminprimaryemail: '',
      adminalteremail: '',
      adminuniqueid: '',
      adminsignature: ''
    });
    setContact('');
    setAltercontact('');
    setOpenCreateDialog(true);
  };

  const handleOpenEditDialog = (admin) => {
    setEditAdminState(admin);
    setAdminData({
      adminid: admin.adminid,
      adminname: admin.adminname,
      adminprimarycontact: admin.adminprimarycontact,
      adminaltercontact: admin.adminaltercontact,
      adminimage: admin.adminimage,
      adminprimaryemail: admin.adminprimaryemail,
      adminalteremail: admin.adminalteremail,
      adminuniqueid: admin.adminuniqueid,
      adminsignature: admin.adminsignature
    });
    setContact(admin.contact);
    setAltercontact(admin.altercontact);
    setOpenEditDialog(true);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredAdmins = admins
    .filter((admin) => {
      if (tabValue === 1) return admin.status === 1; // Active
      if (tabValue === 2) return admin.status === 2; // Inactive
      return true; // All
    })
    .filter((admin) => admin.adminname.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <MainCard>
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
          <TextField label="Search Admin" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <Button variant="contained" color="primary" onClick={handleOpenCreateDialog}>
            Create Admin
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="Admin table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>Unique ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAdmins?.length > 0 ? (
              filteredAdmins?.map((admin) => (
                <>
                  <TableRow key={admin.adminid}>
                    <TableCell>{admin.adminid}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Avatar src={admin.adminimage} alt="Admin" />
                        <Box>
                          <Typography variant="subtitle1">{admin.adminname}</Typography>
                          <Typography variant="subtitle2">{admin.adminprimaryemail}</Typography>
                          <Typography variant="subtitle2">{admin.adminprimarycontact}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1" color='primary'>{admin.adminuniqueid}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={admin.adminstatus === 1 ? 'Active' : 'Inactive'} color={admin.adminstatus === 1 ? 'primary' : 'default'} />
                    </TableCell>
                    <TableCell align="right">
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                        <Tooltip title="View">
                          <TableCell style={{ padding: 0 }} colSpan={12}>
                            <IconButton color="secondary" onClick={() => navigate('/settings/admin-details', { state: { admin } })}>
                              <BsEyeFill />
                            </IconButton>
                          </TableCell>
                        </Tooltip>
                        <IconButton color="primary" onClick={() => handleOpenEditDialog(admin)}>
                          <EditOutlined />
                        </IconButton>
                        <Switch checked={admin.adminstatus === 1} onChange={() => handleToggleStatus(admin)} color="primary" />
                      </div>
                    </TableCell>
                  </TableRow>
                </>
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

      {openCreateDialog && (
        <AdminFormDialog
          open={openCreateDialog}
          onClose={() => setOpenCreateDialog(false)}
          contact={contact}
          setContact={setContact}
          altercontact={altercontact}
          setAltercontact={setAltercontact}
          adminData={adminData}
          setAdminData={setAdminData}
          onSubmit={handleCreateAdmin}
          title={'Create Admin'}
        />
      )}

      {openEditDialog && (
        <AdminFormDialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          contact={contact}
          setContact={setContact}
          altercontact={altercontact}
          setAltercontact={setAltercontact}
          adminData={adminData}
          setAdminData={setAdminData}
          onSubmit={handleEditAdminState}
          title={'Edit Admin'}
        />
      )}
    </MainCard>
  );
}
