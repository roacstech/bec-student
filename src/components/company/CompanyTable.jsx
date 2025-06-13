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
  Tooltip
} from '@mui/material';
import { CloseOutlined, EditOutlined, EyeTwoTone } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useAuth from 'hooks/useAuth';
import MainCard from 'components/MainCard';
import CompanyFormDialog from './CompanyFormDialog';
import { createCompany } from 'services/company/createCompany';
import { updateCompanyStatus } from 'services/company/updateCompanyStatus';
import { getAllCompany } from 'services/company/getAllCompany';
import { editCompany } from 'services/company/editCompany';
import { useTheme } from '@mui/material/styles';
// import CompanyView from './CompanyView';

import Lottie from 'react-lottie';
import lottieLoader from '../../assets/Lottie/NoLoaderData.json';
import { BsEyeFill } from 'react-icons/bs';
import { useNavigate } from 'react-router';

const loaderOptions = {
  loop: true,
  autoplay: true,
  animationData: lottieLoader,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

export default function CompanyTable() {
  const queryClient = useQueryClient();
  const [viewOpen, setViewOpen] = useState(false);

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [companyData, setCompanyData] = useState({
    companyuniqueid: '',
    companyname: '',
    companyaddress: '',
    companyimage: '',
    contact: '',
    altercontact: '',
    email: '',
    alteremail: '',
    billingaddress: '',
    gstnumber: '',
    companyquotationnotes: '',
    companyquotationtermsandconditions: ''
  });

  console.log('companyData in table', companyData);
  const [editCompanyState, setEditCompanyState] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [contact, setContact] = useState('');
  const [altercontact, setAltercontact] = useState('');
  const { userDetails } = useAuth();
  const theme = useTheme();

  const { data: companies = [] } = useQuery({
    queryKey: ['Company'],
    queryFn: () => getAllCompany(0),
    cacheTime: 300000, // Data is cached for 5 minutes
    refetchOnMount: false // Avoid refetching on component mount
  });

  const navigate = useNavigate();

  // Count the number of companies by status
  const allCount = companies.length;
  const activeCount = companies.filter((company) => company?.status === 1).length;
  const inactiveCount = companies.filter((company) => company?.status === 2).length;

  const createMutation = useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.refetchQueries(['Company']);
      setOpenCreateDialog(false);
      setCompanyData({
        companyuniqueid: '',
        companyname: '',
        companyaddress: '',
        companyimage: '',
        contact: '',
        altercontact: '',
        email: '',
        alteremail: '',
        billingaddress: '',
        gstnumber: '',
        companyquotationnotes: '',
        companyquotationtermsandconditions: ''
      });
      setContact('');
      setAltercontact('');
      toast.success('Company created successfully');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: editCompany,
    onSuccess: () => {
      queryClient.refetchQueries(['Company']);
      queryClient.refetchQueries(['tasks']);
      setOpenEditDialog(false);
      toast.success('Company updated successfully');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    }
  });

  const updateCompanyMutation = useMutation({
    mutationFn: updateCompanyStatus,
    onSuccess: () => {
      queryClient.refetchQueries(['Company']);
      toast.success('Company status updated successfully');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    }
  });

  const handleCreateCompany = useCallback(() => {
    createMutation.mutate({
      ...companyData,
      contact: contact,
      altercontact: altercontact
    });
  }, [companyData, createMutation]);

  const handleEditCompanyState = useCallback(() => {
    if (editCompanyState) {
      updateMutation.mutate({
        ...companyData,
        contact: contact,
        altercontact: altercontact
      });
    }
  }, [editCompanyState, companyData, updateMutation]);

  const handleToggleStatus = (company) => {
    const newStatus = company.status === 1 ? 2 : 1;

    const updatedCompanies = companies.map((cat) => (cat.companyid === company.companyid ? { ...cat, status: newStatus } : cat));

    queryClient.setQueryData(['Company'], updatedCompanies);

    updateCompanyMutation.mutate(
      {
        companyid: company.companyid,
        key: newStatus
      },
      {
        onError: () => {
          queryClient.setQueryData(['Company'], companies);
        }
      }
    );
  };

  const handleOpenCreateDialog = () => {
    setCompanyData({
      companyuniqueid: '',
      companyname: '',
      companyaddress: '',
      companyimage: '',
      email: '',
      alteremail: '',
      billingaddress: '',
      gstnumber: '',
      companyquotationnotes: '',
      companyquotationtermsandconditions: ''
    });
    setContact('');
    setAltercontact('');
    setOpenCreateDialog(true);
  };

  const handleOpenEditDialog = (company) => {
    setEditCompanyState(company);
    setCompanyData({
      companyid: company.companyid,
      companyuniqueid: company.companyuniqueid,
      companyname: company.companyname,
      companyaddress: company.companyaddress,
      companyimage: company.companyimage || '',
      email: company.email,
      alteremail: company.alteremail,
      billingaddress: company.billingaddress,
      gstnumber: company.gstnumber,
      companyquotationnotes: company.companyquotationnotes,
      companyquotationtermsandconditions: company.companyquotationtermsandconditions
    });
    setContact(company.contact);
    setAltercontact(company.altercontact);
    setOpenEditDialog(true);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredCompanies = companies
    .filter((company) => {
      if (tabValue === 1) return company.status === 1; // Active
      if (tabValue === 2) return company.status === 2; // Inactive
      return true; // All
    })
    .filter((company) => company.companyname.toLowerCase().includes(searchTerm.toLowerCase()));

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
          <TextField label="Search Company" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <Button variant="contained" color="primary" onClick={handleOpenCreateDialog}>
            Create Company
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="Company table">
          <TableHead>
            <TableRow>
              <TableCell>Company ID</TableCell>
              <TableCell>Company Image</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCompanies?.length > 0 ? (
              filteredCompanies?.map((company) => (
                <>
                  <TableRow key={company.companyid}>
                    <TableCell>{company.companyid}</TableCell>
                    <TableCell>
                      {company.companyimage && (
                        <img
                          src={company.companyimage}
                          alt="Company"
                          style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle1">{company.companyname}</Typography>
                        <Typography variant="body2">{company.companyuniqueid}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body1">{company.email}</Typography>
                        <Typography variant="body2">{company.contact}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={company.status === 1 ? 'Active' : 'Inactive'} color={company.status === 1 ? 'primary' : 'default'} />
                    </TableCell>
                    <TableCell align="right">
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                        <Tooltip title="View">
                          <TableCell style={{ padding: 0 }} colSpan={12}>
                            <IconButton color="secondary" onClick={() => navigate('/settings/companydetails', { state: { company } })}>
                              <BsEyeFill />
                            </IconButton>
                          </TableCell>
                        </Tooltip>
                        <IconButton color="primary" onClick={() => handleOpenEditDialog(company)}>
                          <EditOutlined />
                        </IconButton>
                        <Switch checked={company.status === 1} onChange={() => handleToggleStatus(company)} color="primary" />
                      </div>
                    </TableCell>
                  </TableRow>
                  {/* <TableRow>
                    <TableCell style={{ padding: 0 }} colSpan={12}>
                      <Collapse in={viewOpen} timeout="auto" unmountOnExit>
                        <Box sx={{ m: 1 }}>
                          <CompanyView data={company} />
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow> */}
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
        <CompanyFormDialog
          open={openCreateDialog}
          onClose={() => setOpenCreateDialog(false)}
          companyData={companyData}
          contact={contact}
          setContact={setContact}
          altercontact={altercontact}
          setAltercontact={setAltercontact}
          setCompanyData={setCompanyData}
          onSubmit={handleCreateCompany}
          title={'Create Company'}
        />
      )}

      {openEditDialog && (
        <CompanyFormDialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          companyData={companyData}
          contact={contact}
          setContact={setContact}
          altercontact={altercontact}
          setAltercontact={setAltercontact}
          setCompanyData={setCompanyData}
          onSubmit={handleEditCompanyState}
          title={'Edit Company'}
        />
      )}
    </MainCard>
  );
}
