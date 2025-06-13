// material-ui
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';

// project imports
import AnimateButton from 'components/@extended/AnimateButton';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';
import MainCard from '../../../components/MainCard';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getBranch } from 'services/getBranch';
import { getStaffRoles } from 'services/getStaffRoles';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router';
import { getStaffDetails } from 'services/getStaffDetails';
import { useEffect } from 'react';
import Loader from 'components/Loader';

/**
 * 'Enter your email'
 * yup.string Expected 0 arguments, but got 1 */
const validationSchema = yup.object({
  firstname: yup.string().required('Staff Name is required'),
  staffid: yup.string().required('Staff ID is required'),
  address: yup.string().required('Address is required'),
  contactno: yup
    .string()
    .required('contactno Number is required')
    .matches(/^[0-9]{10}$/, 'Enter a Valid Number'),
  email: yup.string().required('Email is required').email('Enter A Valid Email'),
  staffroleid: yup.number().required('Employee Role is required'),
  locationid: yup.number().required('Branch is required'),
  city: yup.string().required('City is required'),
  postcode: yup.string().required('postcode is required'),
  gender: yup.number().required('Gender is required'),
  expyears: yup.number().required('Experience Years is required'),
  explevel: yup.string().required('Experience Level is required')
});

// component function return
const EditStaff = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = 'Are you sure?'; // This will display the default confirmation message
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // fetching staff details

  const { data: staffDetails } = useQuery({
    queryKey: ['getStaffDetails'],
    queryFn: () => getStaffDetails(params.id),
    enabled: !!params.id, // Ensure params.id exists before enabling the query
    cacheTime: 300000, // Data is cached for 5 minutes
    refetchOnMount: false // Avoid refetching on component mount
  });
  const staff = staffDetails?.data?.response[0];

  // fetching allbranches
  const { data } = useQuery({
    queryKey: ['getBranch'],
    queryFn: getBranch,
    cacheTime: 300000, // Data is cached for 5 minutes
    refetchOnMount: false // Avoid refetching on component mount
  });
  const allBranch = data?.data?.response;

  // fetching staff roles
  const { data: roles } = useQuery({
    queryKey: ['getStaffRoles'],
    queryFn: getStaffRoles,
    cacheTime: 300000, // Data is cached for 5 minutes
    refetchOnMount: false // Avoid refetching on component mount
  });
  const staffRoles = roles?.data?.response;

  // form submission mutation

  const { mutate, isLoading } = useMutation(
    (data) =>
      axios
        .post(`${process.env.REACT_APP_API_URL}/editEmployee`, data, {
          headers: {
            auth: localStorage.getItem('token')
          }
        })
        .catch((error) => {
          throw error;
        }),
    {
      onSuccess: () => {
        toast.success('Employee Edited Successfully !!!');
        queryClient.refetchQueries({ queryKey: ['allStaff'] });
        navigate('/employee/list', { replace: true });
      },
      onError: (error) => {
        console.log(error, 'error');
        toast.error('Unable to Edit Employee !!! Please Try Again');
      }
    }
  );

  const tenantid = localStorage.getItem('tenantid');

  //  form validation
  const formik = useFormik({
    initialValues: {
      firstname: staff?.firstname,
      staffid: staff?.staffid,
      email: staff?.email,
      contactno: staff?.contactno,
      staffroleid: staff?.staffroleid,
      locationid: staff?.locationid,
      address: staff?.address,
      city: staff?.city,
      postcode: staff?.postcode,
      gender: staff?.gender,
      expyears: staff?.expyears,
      explevel: staff?.explevel
    },
    validationSchema,
    onSubmit: (values) => {
      mutate({ ...values, tenantid, userid: staff.userid });
    }
  });

  return (
    <>
      <Typography variant="h3" mb={2} mt={2}>
        Edif Employee
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          {isLoading && <Loader />}
          <Grid item xs={12} sm={6} lg={6}>
            <MainCard title="Employee Details">
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label=" Employee ID"
                  id="staffid"
                  name="staffid"
                  placeholder="MS-9817"
                  value={formik.values.staffid}
                  onChange={formik.handleChange}
                  error={formik.touched.staffid && Boolean(formik.errors.staffid)}
                  helperText={formik.touched.staffid && formik.errors.staffid}
                />
                <TextField
                  label="Enter Employee Name"
                  fullWidth
                  id="firstname"
                  name="firstname"
                  placeholder="Jhon Doe"
                  value={formik.values.firstname}
                  onChange={formik.handleChange}
                  error={formik.touched.firstname && Boolean(formik.errors.firstname)}
                  helperText={formik.touched.firstname && formik.errors.firstname}
                />
                <TextField
                  fullWidth
                  label="Enter contact Number"
                  id="contactno"
                  name="contactno"
                  placeholder="+91"
                  value={formik.values.contactno}
                  onChange={formik.handleChange}
                  error={formik.touched.contactno && Boolean(formik.errors.contactno)}
                  helperText={formik.touched.contactno && formik.errors.contactno}
                />
                <TextField
                  fullWidth
                  label="Enter Employee Email"
                  id="email"
                  name="email"
                  placeholder="Mark@email.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />

                <FormControl>
                  <InputLabel id="locationid">Select Branch</InputLabel>
                  <Select
                    labelId="locationid"
                    id="locationid"
                    name="locationid"
                    value={Number(formik.values.locationid)}
                    label="Branch"
                    onChange={formik.handleChange}
                  >
                    {allBranch?.map((branch, idx) => (
                      <MenuItem key={idx} value={branch.locationid}>
                        {branch.locationname}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {/* role field */}
                <FormControl>
                  <InputLabel id="staffroleid">Select Role</InputLabel>
                  <Select
                    labelId="staffroleid"
                    id="staffroleid"
                    name="staffroleid"
                    placeholder="Select Role"
                    value={parseInt(formik.values.staffroleid)}
                    label="Branch"
                    onChange={formik.handleChange}
                  >
                    {staffRoles?.map((staff, idx) => (
                      <MenuItem key={idx} value={staff.staffroleid}>
                        {staff.rolename}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <Stack direction="row" alignItems="center" spacing={4}>
                    <FormLabel id="gender">Gender</FormLabel>
                    <RadioGroup row aria-labelledby="gender" name="gender" value={formik.values.gender} onChange={formik.handleChange}>
                      <FormControlLabel value={1} control={<Radio />} label="Male" />
                      <FormControlLabel value={2} control={<Radio />} label="Female" />
                    </RadioGroup>
                  </Stack>
                </FormControl>
              </Stack>
            </MainCard>
          </Grid>
          <Grid item xs={12} sm={6} lg={6}>
            <MainCard title="Address And Experience">
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Address"
                  id="address"
                  name="address"
                  placeholder="Enter address"
                  type="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                />
                <TextField
                  fullWidth
                  label="Enter City"
                  id="city"
                  name="city"
                  placeholder="Enter city"
                  type="city"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  error={formik.touched.city && Boolean(formik.errors.city)}
                  helperText={formik.touched.city && formik.errors.city}
                />
                <TextField
                  fullWidth
                  label="Post Code"
                  id="postcode"
                  name="postcode"
                  placeholder="Enter postcode"
                  type="postcode"
                  value={formik.values.postcode}
                  onChange={formik.handleChange}
                  error={formik.touched.postcode && Boolean(formik.errors.postcode)}
                  helperText={formik.touched.postcode && formik.errors.postcode}
                />
                <TextField
                  fullWidth
                  label="Experience Level"
                  id="explevel"
                  name="explevel"
                  placeholder="Enter explevel"
                  value={formik.values.explevel}
                  onChange={formik.handleChange}
                  error={formik.touched.explevel && Boolean(formik.errors.explevel)}
                  helperText={formik.touched.explevel && formik.errors.explevel}
                />
                <TextField
                  fullWidth
                  label="Experience Years"
                  id="expyears"
                  name="expyears"
                  placeholder="2 years"
                  type="number"
                  value={formik.values.expyears}
                  onChange={formik.handleChange}
                  error={formik.touched.expyears && Boolean(formik.errors.expyears)}
                  helperText={formik.touched.expyears && formik.errors.expyears}
                />
                <Stack direction="row" justifyContent="flex-end">
                  <AnimateButton>
                    <Button disabled={isLoading} variant="contained" type="submit">
                      {isLoading ? 'Editing Employee...' : 'Edit Employee'}
                    </Button>
                  </AnimateButton>
                </Stack>
              </Stack>
            </MainCard>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default EditStaff;
