import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Switch,
  Collapse,
  IconButton,
  Grid,
  Divider,
  Button,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  Paper
} from '@mui/material';
import { FaChevronDown, FaChevronUp, FaCogs } from 'react-icons/fa';
import { MdOutlineSubdirectoryArrowRight } from 'react-icons/md';
import { getRolePermission } from 'services/modules/getRolePermission';
import { editRolePermssion } from 'services/modules/editRolePermssion';
import MainCard from 'components/MainCard';
import toast from 'react-hot-toast';

const RolesAndPermissions = () => {
  const roleId = 2; // Set role ID
  const roleName = 'Admin'; // Set role name
  const queryClient = useQueryClient();

  // Fetch role permissions
  const { data, isLoading, isError } = useQuery({
    queryKey: ['getAllRolePermissions'],
    queryFn: () =>
      getRolePermission({
        roleid: 2
      })
  });

  console.log('Role permissions:', data);
  console.log('Role:', data?.[0]?.webpermissions);

  // Initialize module data state
  const [moduleData, setModuleData] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [originalData, setOriginalData] = useState([]);

  // Update moduleData state when data changes
  useEffect(() => {
    if (data?.[0]?.webpermissions) {
      setModuleData(data[0].webpermissions);
      setOriginalData(data[0].webpermissions); // Backup original data
    }
  }, [data]);

  // Mutation for editing role permissions
  const editMutation = useMutation({
    mutationFn: editRolePermssion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAllRolePermissions'] });
      toast.success('Role permissions updated successfully!');
    },
    onError: (error) => {
      console.error('Failed to update role permissions:', error);
      toast.error('Failed to update role permissions!');
    }
  });

  // Toggle module status
  const toggleModuleStatus = (moduleId) => {
    setModuleData((prev) =>
      prev.map((module) => (module.moduleid === moduleId ? { ...module, modulestatus: !module.modulestatus } : module))
    );
  };

  // Toggle submodule status
  const toggleSubmoduleStatus = (moduleId, submoduleId) => {
    setModuleData((prev) =>
      prev.map((module) =>
        module.moduleid === moduleId
          ? {
              ...module,
              submodule: module.submodule.map((sub) =>
                sub.submoduleid === submoduleId ? { ...sub, submodulestatus: !sub.submodulestatus } : sub
              )
            }
          : module
      )
    );
  };

  // Expand/Collapse module
  const handleExpandClick = (moduleId) => {
    setExpanded((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Handle update action
  const handleUpdate = () => {
    const payload = {
      roleid: roleId,
      rolename: roleName,
      webpermissions: moduleData.map((module) => ({
        moduleid: module.moduleid,
        modulename: module.modulename,
        modulestatus: module.modulestatus,
        submodule: module.submodule.map((sub) => ({
          submoduleid: sub.submoduleid,
          submodulename: sub.submodulename,
          submodulestatus: sub.submodulestatus
        }))
      }))
    };
    editMutation.mutate(payload);
    console.log('Payload to send:', payload);
  };

  // Handle cancel action
  const handleCancel = () => {
    setModuleData(originalData); // Reset to original data
  };

  // Loading/Error states
  if (isLoading) {
    return <Typography>Loading modules...</Typography>;
  }

  if (isError) {
    return <Typography>Error loading modules. Please try again later.</Typography>;
  }

  return (
    <MainCard title={
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Roles and Permissions</Typography>
        <Box display="flex" justifyContent="left" gap={2}>
          <Button variant="contained" color="primary" onClick={handleUpdate} sx={{ minWidth: 150 }}>
            Update
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleCancel} sx={{ minWidth: 150 }}>
            Reset
          </Button>
        </Box>
      </Box>
    }>
      <Box padding={3}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Module Name</TableCell>
                <TableCell align="left">Module Status</TableCell>
                <TableCell>Submodules</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {moduleData.map((module) => (
                <React.Fragment key={module.moduleid}>
                  {/* Module Row */}
                  <TableRow>
                    <TableCell>
                      <Box display="flex" alignItems="left" gap={1}>
                        {/* <FaCogs /> */}
                        <Typography variant="subtitle1">{module.modulename}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="left">
                      <Switch checked={module.modulestatus} onClick={() => toggleModuleStatus(module.moduleid)} />
                    </TableCell>
                    <TableCell>
                      {module.submodule?.length > 0 && (
                        <IconButton onClick={() => handleExpandClick(module.moduleid)}>
                          {expanded[module.moduleid] ? <FaChevronUp /> : <FaChevronDown />}
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>

                  {/* Submodule Rows */}
                  {expanded[module.moduleid] &&
                    module.submodule.map((submodule) => (
                      <TableRow key={submodule.submoduleid} onClick={() => toggleSubmoduleStatus(module.moduleid, submodule.submoduleid)}>
                        <TableCell>
                          <Box display="flex" alignItems="left" gap={1} justifyContent="space-between">
                            <Box display="flex" alignItems="center" gap={1}>
                              <MdOutlineSubdirectoryArrowRight />
                              <Typography variant="body1" >{submodule.submodulename}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Switch checked={submodule.submodulestatus} color='info'/>
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
      </Box>
    </MainCard>
  );
};

export default RolesAndPermissions;
