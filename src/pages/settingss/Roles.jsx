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
import useAuth from 'hooks/useAuth';
import CustomDialog from 'components/dialog/CustomDialog';
import { addRole } from 'services/roles/addRole';
import { getRole } from 'services/roles/getRole';
import { editRole } from 'services/roles/editRole';
import { updateRoleStatus } from 'services/roles/updateRoleStatus';
import MainCard from 'components/MainCard';

export default function RoleTable() {
  const queryClient = useQueryClient();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [roleImage, setRoleImage] = useState('');
  const [editRoleState, setEditRoleState] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const { userDetails } = useAuth();
  console.log(userDetails);

  const { data: categories = [] } = useQuery({
    queryKey: ['Role'],
    queryFn: () => getRole(0),
    cacheTime: 300000, // Data is cached for 5 minutes
    refetchOnMount: false // Avoid refetching on component mount
  });

  // Count the number of categories by Stage
  const allCount = categories.length;
  const activeCount = categories.filter((Role) => Role?.status === 1).length;
  const inactiveCount = categories.filter((Role) => Role?.status === 2).length;

  const createMutation = useMutation({
    mutationFn: addRole,
    onSuccess: () => {
      queryClient.refetchQueries(['Role']);
      setOpenCreateDialog(false);
      setRoleName('');
      setRoleImage('');
      toast.success('Role created successfully');
    },
    onError: (error) => {
      toast.error(`Error creating Role: ${error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: editRole,
    onSuccess: () => {
      queryClient.refetchQueries(['Role']);
      setOpenEditDialog(false);
      setRoleName('');
      setRoleImage('');
      toast.success('Role updated successfully');
    },
    onError: (error) => {
      toast.error(`Error updating Role: ${error.message}`);
    }
  });

  const updateRoleMutation = useMutation({
    mutationFn: updateRoleStatus,
    onSuccess: () => {
      queryClient.refetchQueries(['Role']);
      toast.success('Role status updated successfully');
    },
    onError: (error) => {
      toast.error(`Error updating Role status: ${error.message}`);
    }
  });
  const handleCreateRole = useCallback(() => {
    createMutation.mutate({
      Rolename: roleName,
      Roleimage: roleImage
    });
  }, [roleName, roleImage, createMutation]);

  const handleEditRoleState = useCallback(() => {
    if (editRoleState) {
      updateMutation.mutate({
        roleid: editRoleState.roleid,
        approleid: editRoleState.approleid,
        rolename: roleName,
        roleimage: roleImage || ''
      });
    }
  }, [editRoleState, roleName, roleImage, updateMutation]);

  const handleToggleStage = (Role) => {
    const newStage = Role?.status === 1 ? 2 : 1;

    const updatedCategories = categories.map((cat) => (cat.roleid === Role?.roleid ? { ...cat, Stage: newStage } : cat));

    queryClient.setQueryData(['Role'], updatedCategories);

    updateRoleMutation.mutate(
      {
        roleid: Role?.roleid,
        approleid: Role?.approleid,
        key: newStage
      },
      {
        onError: () => {
          queryClient.setQueryData(['Role'], categories);
        }
      }
    );
  };

  const handleOpenCreateDialog = () => {
    setRoleName('');
    setRoleImage('');
    setOpenCreateDialog(true);
  };

  const handleOpenEditDialog = (Role) => {
    setEditRoleState(Role);
    setRoleName(Role?.rolename);
    setRoleImage(Role?.roleimage || '');
    setOpenEditDialog(true);
  };
  // console.log('RoleName', RoleName);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredCategories = categories
    ?.filter((Role) => {
      if (tabValue === 1) return Role?.status === 1; // Active
      if (tabValue === 2) return Role?.status === 2; // Inactive
      return true; // All
    })
    .filter((Role) => Role?.rolename.toLowerCase().includes(searchTerm.toLowerCase()));

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
          <TextField label="Search Role" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <Button variant="contained" color="primary" onClick={handleOpenCreateDialog}>
            Create Role
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="Role table">
          <TableHead>
            <TableRow>
              <TableCell>Role ID</TableCell>
              <TableCell>Role Image</TableCell>
              <TableCell>Role Name</TableCell>
              <TableCell>Stage</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories?.map((Role) => (
              <TableRow key={Role?.roleid}>
                <TableCell>{Role?.roleid}</TableCell>
                <TableCell>
                  {Role?.roleimage && (
                    <img
                      src={Role?.roleimage}
                      alt="Role"
                      style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                  )}
                </TableCell>
                <TableCell>{Role?.rolename}</TableCell>
                <TableCell>
                  <Chip label={Role?.status === 1 ? 'Active' : 'Inactive'} color={Role?.status === 1 ? 'primary' : 'default'} />
                </TableCell>
                <TableCell align="right">
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <IconButton color="primary" onClick={() => handleOpenEditDialog(Role)}>
                      <EditOutlined />
                    </IconButton>
                    <Switch checked={Role?.status === 1} onChange={() => handleToggleStage(Role)} color="primary" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CustomDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSave={handleCreateRole}
        Name={roleName}
        setName={setRoleName}
        Image={roleImage}
        setImage={setRoleImage}
        title="Create Role"
      />

      <CustomDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        onSave={handleEditRoleState}
        Name={roleName}
        setName={setRoleName}
        Image={roleImage}
        setImage={setRoleImage}
        title="Edit Role"
      />
    </MainCard>
  );
}
