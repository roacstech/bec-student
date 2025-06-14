import { Link, useParams, useNavigate } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import GlobalStyles from '@mui/material/GlobalStyles';
// Material-UI components
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Autocomplete from '@mui/material/Autocomplete';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
// Project imports
import { getALeadsById } from 'services/leads/getLeadsbyId';
import { StudentRegister } from 'services/student/registerStudent';
import FileUpload from './FileUpload';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { BankOutlined, DeleteColumnOutlined, DeleteFilled, FileAddOutlined, MinusCircleOutlined } from '@ant-design/icons';
import SpouseFileUpload from 'components/aws-fileupload/SpouseFileUpload';
import toast from 'react-hot-toast';
import { getAcademic } from 'services/academics/getAcademic';
import { getLanguageTest } from 'services/languagetest/getLanguageTest';
import getCourse from 'services/course/getCourse';
import { getCountry } from 'services/location/getCountry';
import getAllCountry from 'services/location/getAllCountry';

const customFieldStyle = {
  backgroundColor: '#fff',
  transition: 'all 0.3s ease',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#999' // Default border color
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#333' // On hover
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#19D23E', // Focus border color
    boxShadow: '0 0 0 2px rgba(25, 210, 62, 0.2)' // Greenish shadow
  }
};

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    studentfirstname: '',
    studentlastname: '',
    studentdob: '',
    studentemail: '',
    studentmobile: '',
    parentcontact: '',
    address: '',
    currentstatus: null,
    currentstatusdescription: '',
    companyname: '',
    jobtitle: '',
    noofyearsexperience: '',
    startdate: '',
    enddate: '',
    description: '',
    studentgap: null,
    studentgapdescription: '',
    marritalstatus: 2,
    dateofmarriage: '',
    spousename: '',
    kids: null,
    spousedob: '',
    spouseresume: '',
    fatheroccupation: '',
    motheroccupation: '',
    sibilings: null,
    parentsincome: null,
    additionalsponsers: '',
    additionalsponsersrelationship: '',
    additionalsponsersincome: '',
    appliedotheruniversitydescription: '',
    visitothercountries: null,
    visitothercountriesdescription: '',
    visarefusal: null,
    visarefusaldescription: '',
    familyinoverseas: 0,
    familyinoverseasdetails: [],
    counselorcomments: '',
    knowaboutoffice: '',
    passportstatus: null,
    passportexpirydate: '',
    academicdetails: [{ academicid: null, university: '', yop: '', percentage: '', numofarrears: '' }],
    languagetest: [{ languagetestid: null, speaking: '', reading: '', writing: '', listening: '' }],
    interestedcourse: '',
    interestedcountry: [],
    previousexperiences: []
  });

  const [showPreviousExperience, setShowPreviousExperience] = useState(false);

  const { id } = useParams();

  const navigate = useNavigate();

  // APi Fetchings

  const { data: langTest = [] } = useQuery({
    queryFn: getLanguageTest,
    queryKey: ['languageTests']
  });

  const languageTests = langTest || [];

  // End APi Fetchings

  const { data: course = [] } = useQuery({
    queryFn: getCourse,
    queryKey: ['course']
  });

  const courseOptions = course || [];

  const { data: country = [] } = useQuery({
    queryFn: getCountry,
    queryKey: ['country']
  });

  const countries = country || [];

  const { data: allcountry = [] } = useQuery({
    queryFn: getAllCountry,
    queryKey: ['allcountry']
  });

  const allcountries = allcountry || [];

  const relationships = ['Father', 'Mother', 'Brother', 'Sister', 'Uncle', 'Aunt', 'Cousin'];

  const statusOptions = ['Working', 'Studying', 'Others'];

  // Fetch lead data
  const { data } = useQuery({
    queryFn: () => getALeadsById(id),
    queryKey: ['getALeadById', id],
    enabled: !!id
  });

  useEffect(() => {
    if (data?.data) {
      setFormData((prev) => ({ ...prev, firstname: data.data.name || '' }));
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAcademyChange = (index, newValue) => {
    console.log('Selected Value:', newValue); // Debugging

    setFormData((prev) => {
      const updatedAcademicDetails = [...prev.academicdetails];
      updatedAcademicDetails[index] = {
        ...updatedAcademicDetails[index],
        academicid: newValue ? newValue.academicid : null // Ensure correct key
      };
      return { ...prev, academicdetails: updatedAcademicDetails };
    });
  };

  const handleAcademicChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedAcademicDetails = [...prev.academicdetails];
      updatedAcademicDetails[index] = {
        ...updatedAcademicDetails[index],
        [name]: value // Only updates the university name
      };
      return { ...prev, academicdetails: updatedAcademicDetails };
    });
  };

  const handleTestChange = (newValue) => {
    setFormData((prev) => ({
      ...prev,
      languagetest: [
        {
          languagetestid: newValue ? Number(newValue.languagetestid) : null,
          speaking: '',
          reading: '',
          writing: '',
          listening: ''
        }
      ]
    }));
  };

  const handleScoreChange = (e, section) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      languagetest: prev.languagetest.map((test, index) => (index === 0 ? { ...test, [section]: value } : test))
    }));
  };

  const handleDelete = (index) => {
    setFormData((prev) => ({
      ...prev,
      academicdetails: prev.academicdetails.filter((_, i) => i !== index)
    }));
  };

  const handleInterestedCourseChange = (selectedCourses) => {
    setFormData((prev) => ({
      ...prev,
      interestedcourse: selectedCourses.map((course) => course.courseid)
    }));
  };

  const addAcademicField = () => {
    setFormData((prev) => ({
      ...prev,
      academicdetails: [...prev.academicdetails, { academicid: Date.now(), university: '', yop: '', percentage: '', numofarrears: '' }]
    }));
  };

  const handleInterestedCountryChange = (selectedCountries) => {
    setFormData((prev) => ({
      ...prev,
      interestedcountry: selectedCountries.map((country) => country.countryid)
    }));
  };

  const handleFileUpload = (fileUrl) => {
    setFormData((prevData) => ({
      ...prevData,
      spouseresume: fileUrl
    }));
  };

  const registerStudentMutation = useMutation({
    mutationFn: StudentRegister,
    onSuccess: () => {
      console.log('Success callback triggered');
      toast.success('Registration successful!');
      navigate('/');
    },
    onError: () => {
      console.log('Error callback triggered');
      toast.error('Registration error!');
    }
  });

  const { data: academics = [] } = useQuery({
    queryFn: getAcademic,
    queryKey: ['academics'],
    cacheTime: 300000,
    refetchOnMount: false
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('formData', formData);
    // Proceed with the registration process if all required fields are filled
    registerStudentMutation.mutate(formData);
  };

  const phoneInputGlobalStyles = (
    <GlobalStyles
      styles={{
        '.react-international-phone-input-container': {
          border: '1px solid #333',
          borderRadius: '6px',
          transition: 'all 0.3s ease',
          backgroundColor: '#fff',
          width: '100%',
          display: 'flex',
          alignItems: 'center'
        },
        '.react-international-phone-country-selector-button': {
          backgroundColor: '#fff',
          border: 'none',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          minWidth: '100px'
        },
        '.react-international-phone-country-selector-dropdown': {
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          zIndex: 1000
        },
        '.react-international-phone-input-container:focus-within': {
          borderColor: '#19D23E',
          boxShadow: '0 0 0 2px rgba(25, 210, 62, 0.2)'
        },
        '.react-international-phone-input': {
          width: '100%',
          padding: '10px',
          border: 'none',
          outline: 'none',
          backgroundColor: '#fff'
        },
        '.react-international-phone-country-selector-button-flag': {
          marginRight: '8px'
        }
      }}
    />
  );

  const addPreviousExperience = () => {
    setFormData((prev) => ({
      ...prev,
      previousexperiences: [
        ...prev.previousexperiences,
        {
          companyname: '',
          jobtitle: '',
          noofyearsexperience: '',
          startdate: '',
          enddate: '',
          description: ''
        }
      ]
    }));
  };

  const handlePreviousExperienceChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedExperiences = [...prev.previousexperiences];
      updatedExperiences[index] = {
        ...updatedExperiences[index],
        [field]: value
      };
      return { ...prev, previousexperiences: updatedExperiences };
    });
  };

  const deletePreviousExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      previousexperiences: prev.previousexperiences.filter((_, i) => i !== index)
    }));
    if (formData.previousexperiences.length === 1) {
      setShowPreviousExperience(false);
    }
  };

  const addFamilyRelationship = () => {
    setFormData((prev) => ({
      ...prev,
      familyinoverseasdetails: [...prev.familyinoverseasdetails, { country: null, relationship: '' }]
    }));
  };

  const handleFamilyRelationshipChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedDetails = [...prev.familyinoverseasdetails];
      updatedDetails[index] = {
        ...updatedDetails[index],
        [field]: value
      };
      return { ...prev, familyinoverseasdetails: updatedDetails };
    });
  };

  const deleteFamilyRelationship = (index) => {
    setFormData((prev) => ({
      ...prev,
      familyinoverseasdetails: prev.familyinoverseasdetails.filter((_, i) => i !== index)
    }));
  };

  return (
    <Grid>
      <Grid item xs={12}>
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel
                  htmlFor="knowaboutoffice"
                  sx={{
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    color: '#444',
                    mb: 0.5
                  }}
                >
                  How do you know about our office? (BEC){' '}
                </InputLabel>
                <OutlinedInput
                  id="knowaboutoffice"
                  name="knowaboutoffice"
                  value={formData.knowaboutoffice}
                  onChange={handleChange}
                  placeholder="e.g., Social Media, Friend, Advertisement"
                  fullWidth
                  sx={{
                    backgroundColor: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#999' // Default border color
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#333' // On hover
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#19D23E', // On focus (greenish tone)
                      boxShadow: '0 0 0 2px rgba(25, 210, 62, 0.2)' // Greenish shadow
                    }
                  }}
                />
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <FormLabel
                component="legend"
                sx={{
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: '#444',
                  mb: 0.5
                }}
              >
                Do you have a passport?
              </FormLabel>
              <RadioGroup
                row
                name="passportstatus"
                value={formData.passportstatus}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setFormData({
                    ...formData,
                    passportstatus: value,
                    passportexpirydate: value === 2 ? '' : formData.passportexpirydate
                  });
                }}
              >
                <FormControlLabel
                  value={1}
                  control={<Radio sx={{ color: '#4caf50', '&.Mui-checked': { color: '#4caf50' } }} />}
                  label="Yes"
                />
                <FormControlLabel
                  value={2}
                  control={<Radio sx={{ color: '#f44336', '&.Mui-checked': { color: '#f44336' } }} />}
                  label="No"
                />
              </RadioGroup>
            </Grid>

            {formData.passportstatus === 1 && (
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel
                    htmlFor="passportexpirydate"
                    sx={{
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      color: '#444',
                      mb: 0.5
                    }}
                  >
                    Passport Expiry Date
                  </InputLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      id="passportexpirydate"
                      label="Select Date"
                      value={formData.passportexpirydate ? dayjs(formData.passportexpirydate) : null}
                      onChange={(newDate) =>
                        setFormData((prev) => ({ ...prev, passportexpirydate: newDate ? newDate.format('DD/MM/YYYY') : '' }))
                      }
                      format="DD/MM/YYYY"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          sx: {
                            backgroundColor: '#fff',
                            borderRadius: '6px',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#999' // Default border color
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#333' // On hover
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#19D23E', // Greenish tone on focus
                              boxShadow: '0 0 0 2px rgba(25, 210, 62, 0.2)' // Subtle shadow
                            }
                          }
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Stack>
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <InputLabel
                  htmlFor="studentfirstname"
                  sx={{
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    color: '#444',
                    mb: 0.5
                  }}
                >
                  First Name {formData.passportstatus === 1 ? '(As Per Passport)' : ''}
                </InputLabel>
                <OutlinedInput
                  id="studentfirstname"
                  name="studentfirstname"
                  value={formData.studentfirstname}
                  onChange={handleChange}
                  placeholder="Enter First Name"
                  fullWidth
                  sx={{
                    backgroundColor: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#999' // Default border color
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#333' // On hover
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#19D23E', // Greenish tone on focus
                      boxShadow: '0 0 0 2px rgba(25, 210, 62, 0.2)' // Subtle shadow on focus
                    }
                  }}
                />
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <InputLabel
                  htmlFor="studentlastname"
                  sx={{
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    color: '#444',
                    mb: 0.5
                  }}
                >
                  Last Name {formData.passportstatus === 1 ? '(As Per Passport)' : ''}
                </InputLabel>
                <OutlinedInput
                  id="studentlastname"
                  name="studentlastname"
                  value={formData.studentlastname}
                  onChange={handleChange}
                  placeholder="Enter Last Name"
                  fullWidth
                  sx={{
                    backgroundColor: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#999' // Default border color
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#333' // On hover
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#19D23E', // Greenish tone on focus
                      boxShadow: '0 0 0 2px rgba(25, 210, 62, 0.2)' // Subtle shadow on focus
                    }
                  }}
                />
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel
                  htmlFor="studentdob"
                  sx={{
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    color: '#444',
                    mb: 0.5
                  }}
                >
                  Date of Birth
                </InputLabel>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Select Date of Birth"
                    value={formData.studentdob ? dayjs(formData.studentdob) : null}
                    onChange={(newDate) => handleChange({ target: { name: 'studentdob', value: newDate } })}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: {
                          backgroundColor: '#fff',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#999' // Default border color
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#333' // On hover
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#19D23E', // Greenish tone on focus
                            boxShadow: '0 0 0 2px rgba(25, 210, 62, 0.2)' // Subtle shadow on focus
                          }
                        }
                      }
                    }}
                  />
                </LocalizationProvider>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel
                  htmlFor="studentemail"
                  sx={{
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    color: '#444',
                    mb: 0.5
                  }}
                >
                  Email ID
                </InputLabel>
                <OutlinedInput
                  id="studentemail"
                  name="studentemail"
                  value={formData.studentemail}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  fullWidth
                  sx={{
                    backgroundColor: '#fff',
                    transition: 'all 0.3s ease',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#999' // Default border color
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#333' // On hover
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#19D23E', // Greenish tone on focus
                      boxShadow: '0 0 0 2px rgba(25, 210, 62, 0.2)' // Subtle shadow on focus
                    }
                  }}
                />
              </Stack>
            </Grid>

            <>
              {phoneInputGlobalStyles}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <FormLabel
                    sx={{
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      color: '#444',
                      mb: 1
                    }}
                  >
                    Mobile
                  </FormLabel>
                  <PhoneInput
                    style={{ width: '100%' }}
                    inputStyle={{
                      width: '100%',
                      padding: '10px',
                      border: 'none',
                      outline: 'none',
                      boxShadow: 'none',
                      backgroundColor: '#fff'
                    }}
                    value={formData?.studentmobile || ''}
                    defaultCountry="in"
                    forceDialCode={true}
                    onChange={(phone) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        studentmobile: phone
                      }))
                    }
                  />
                </FormControl>
              </Grid>
            </>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <FormLabel
                  sx={{
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    color: '#444',
                    mb: 1
                  }}
                >
                  Parent's Contact No
                </FormLabel>
                <PhoneInput
                  style={{ width: '100%' }}
                  inputStyle={{
                    width: '100%',
                    padding: '10px',
                    border: 'none',
                    outline: 'none',
                    boxShadow: 'none',
                    backgroundColor: '#fff'
                  }}
                  value={formData?.parentcontact || ''}
                  defaultCountry="in"
                  forceDialCode={true}
                  onChange={(phone) => setFormData((prevData) => ({ ...prevData, parentcontact: phone }))}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel
                  htmlFor="address"
                  sx={{
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    color: '#444',
                    mb: 0.5
                  }}
                >
                  Address
                </InputLabel>
                <TextField
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  multiline
                  rows={3}
                  variant="outlined"
                  fullWidth
                  sx={{
                    backgroundColor: '#fff',
                    transition: 'all 0.3s ease',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#999' // Default border color
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#333' // On hover
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#19D23E', // Greenish tone on focus
                      boxShadow: '0 0 0 2px rgba(25, 210, 62, 0.2)' // Subtle shadow on focus
                    }
                  }}
                />
              </Stack>
            </Grid>

            <Grid container item xs={12}>
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Academic Details
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell>Academic</TableCell>
                      <TableCell>School/University</TableCell>
                      <TableCell>Year of Passing</TableCell>
                      <TableCell>Percentage / Grade</TableCell>
                      <TableCell>No. of Arrears</TableCell>
                      {formData.academicdetails.length > 1 && <TableCell align="center">Actions</TableCell>}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {formData.academicdetails.map((field, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ minWidth: 160 }}>
                          <Autocomplete
                            options={academics}
                            getOptionLabel={(option) => option.academicname}
                            value={academics.find((aca) => aca.academicid === field.academicid) || null}
                            onChange={(event, newValue) => handleAcademyChange(index, newValue)}
                            renderInput={(params) => <TextField {...params} placeholder="Select Academy" size="medium" />}
                            sx={{
                              backgroundColor: '#fff',
                              transition: 'all 0.3s ease',
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#999' // Default border color
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#333' // On hover
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#19D23E', // Greenish tone on focus
                                boxShadow: '0 0 0 2px rgba(25, 210, 62, 0.2)' // Subtle shadow on focus
                              }
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <OutlinedInput
                            name="university"
                            value={field.university || ''}
                            onChange={(e) => handleAcademicChange(index, e)}
                            placeholder="University Name"
                            fullWidth
                            size="medium"
                            sx={{
                              backgroundColor: '#fff',
                              transition: 'all 0.3s ease',
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#999' // Default border color
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#333' // On hover
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#19D23E', // Greenish tone on focus
                                boxShadow: '0 0 0 2px rgba(25, 210, 62, 0.2)' // Subtle shadow on focus
                              }
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <OutlinedInput
                            type="number"
                            name="yop"
                            value={field.yop || ''}
                            onChange={(e) => handleAcademicChange(index, e)}
                            placeholder="YYYY"
                            fullWidth
                            size="medium"
                            sx={{
                              backgroundColor: '#fff',
                              transition: 'all 0.3s ease',
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#999' // Default border color
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#333' // On hover
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#19D23E', // Greenish tone on focus
                                boxShadow: '0 0 0 2px rgba(25, 210, 62, 0.2)' // Subtle shadow on focus
                              }
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <OutlinedInput
                            type="text"
                            name="percentage"
                            value={field.percentage || ''}
                            onChange={(e) => handleAcademicChange(index, e)}
                            placeholder="Ex: 80%"
                            fullWidth
                            size="medium"
                            sx={{
                              backgroundColor: '#fff',
                              transition: 'all 0.3s ease',
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#999' // Default border color
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#333' // On hover
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#19D23E', // Greenish tone on focus
                                boxShadow: '0 0 0 2px rgba(25, 210, 62, 0.2)' // Subtle shadow on focus
                              }
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <OutlinedInput
                            type="number"
                            name="numofarrears"
                            value={field.numofarrears || ''}
                            onChange={(e) => handleAcademicChange(index, e)}
                            placeholder="Ex: 1"
                            fullWidth
                            size="medium"
                            sx={{
                              backgroundColor: '#fff',
                              transition: 'all 0.3s ease',
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#999' // Default border color
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#333' // On hover
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#19D23E', // Greenish tone on focus
                                boxShadow: '0 0 0 2px rgba(25, 210, 62, 0.2)' // Subtle shadow on focus
                              }
                            }}
                          />
                        </TableCell>

                        {formData.academicdetails.length > 1 && (
                          <TableCell align="center">
                            <Button variant="outlined" color="error" size="large" onClick={() => handleDelete(index)}>
                              <MinusCircleOutlined fontSize="medium" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>

              {/* Add Button */}
              <Grid item xs={12} mt={2} display="flex" justifyContent="flex-end">
                <Button
                  variant="outlined"
                  size="medium"
                  startIcon={<BankOutlined />}
                  onClick={addAcademicField}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  Add Academic
                </Button>
              </Grid>
            </Grid>

            {/* Current Status */}
            <Grid item xs={12} md={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="current-status" sx={{ fontWeight: 500, fontSize: '0.95rem', color: '#444' }}>
                  Current Status
                </InputLabel>
                <Autocomplete
                  id="current-status"
                  options={[
                    { label: 'Working', value: 1 },
                    { label: 'Studying', value: 2 },
                    { label: 'Others', value: 3 }
                  ]}
                  getOptionLabel={(option) => option.label || ''}
                  value={
                    formData.currentstatus
                      ? {
                          label: ['Working', 'Studying', 'Others'][formData.currentstatus - 1],
                          value: formData.currentstatus
                        }
                      : null
                  }
                  onChange={(event, newValue) =>
                    setFormData({
                      ...formData,
                      currentstatus: newValue ? newValue.value : 0,
                      // Reset work-related fields when status changes
                      companyname: '',
                      jobtitle: '',
                      noofyearsexperience: '',
                      startdate: '',
                      enddate: '',
                      description: ''
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select your status"
                      fullWidth
                      sx={customFieldStyle}
                    />
                  )}
                />
              </Stack>
            </Grid>

            {/* Work Details - Show only when status is Working */}
            {formData.currentstatus === 1 && (
              <Grid container spacing={2} alignItems="flex-end" sx={{ mt: 2 }}>
                <Grid item xs={2}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="companyname" sx={{ fontWeight: 500, fontSize: '0.95rem', color: '#444' }}>
                      Company Name
                    </InputLabel>
                    <OutlinedInput
                      id="companyname"
                      name="companyname"
                      value={formData.companyname || ''}
                      onChange={handleChange}
                      placeholder="Enter company name"
                      fullWidth
                      sx={customFieldStyle}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={2}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="jobtitle" sx={{ fontWeight: 500, fontSize: '0.95rem', color: '#444' }}>
                      Job Title
                    </InputLabel>
                    <OutlinedInput
                      id="jobtitle"
                      name="jobtitle"
                      value={formData.jobtitle || ''}
                      onChange={handleChange}
                      placeholder="Enter job title"
                      fullWidth
                      sx={customFieldStyle}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={2}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="noofyearsexperience" sx={{ fontWeight: 500, fontSize: '0.95rem', color: '#444' }}>
                      Years Exp.
                    </InputLabel>
                    <OutlinedInput
                      id="noofyearsexperience"
                      name="noofyearsexperience"
                      type="number"
                      value={formData.noofyearsexperience || ''}
                      onChange={handleChange}
                      placeholder="Years"
                      fullWidth
                      sx={customFieldStyle}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={2}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="startdate" sx={{ fontWeight: 500, fontSize: '0.95rem', color: '#444' }}>
                      Start Date
                    </InputLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={formData.startdate ? dayjs(formData.startdate) : null}
                        onChange={(newDate) => setFormData({ ...formData, startdate: newDate ? newDate.format('YYYY-MM-DD') : '' })}
                        format="DD/MM/YYYY"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            sx: customFieldStyle
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </Stack>
                </Grid>

                <Grid item xs={2}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="enddate" sx={{ fontWeight: 500, fontSize: '0.95rem', color: '#444' }}>
                      End Date
                    </InputLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={formData.enddate ? dayjs(formData.enddate) : null}
                        onChange={(newDate) => setFormData({ ...formData, enddate: newDate ? newDate.format('YYYY-MM-DD') : '' })}
                        format="DD/MM/YYYY"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            sx: customFieldStyle
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </Stack>
                </Grid>

                <Grid item xs={2}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="description" sx={{ fontWeight: 500, fontSize: '0.95rem', color: '#444' }}>
                      Description
                    </InputLabel>
                    <OutlinedInput
                      id="description"
                      name="description"
                      value={formData.description || ''}
                      onChange={handleChange}
                      placeholder="Enter description"
                      fullWidth
                      sx={customFieldStyle}
                    />
                  </Stack>
                </Grid>
              </Grid>
            )}


            {/* Current Status Description - Show only when status is Studying or Others */}
            {formData.currentstatus !== 1 && (
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="currentstatusdescription" sx={{ fontWeight: 500, fontSize: '0.95rem', color: '#444' }}>
                    Current Status Description
                  </InputLabel>
                  <OutlinedInput
                    id="currentstatusdescription"
                    name="currentstatusdescription"
                    value={formData.currentstatusdescription || ''}
                    onChange={handleChange}
                    placeholder="Enter your current status description"
                    fullWidth
                    sx={customFieldStyle}
                  />
                </Stack>
              </Grid>
            )}

            {/* Previous Experience */}
            {formData.currentstatus === 1 && (
              <>
                {formData.previousexperiences.map((experience, index) => (
                  <Grid container spacing={2} key={index} alignItems="flex-end" sx={{ mt: 2 }}>
                    <Grid item xs={2}>
                      <OutlinedInput
                        value={experience.companyname || ''}
                        onChange={(e) => handlePreviousExperienceChange(index, 'companyname', e.target.value)}
                        placeholder="Company Name"
                        fullWidth
                        sx={customFieldStyle}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <OutlinedInput
                        value={experience.jobtitle || ''}
                        onChange={(e) => handlePreviousExperienceChange(index, 'jobtitle', e.target.value)}
                        placeholder="Job Title"
                        fullWidth
                        sx={customFieldStyle}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <OutlinedInput
                        type="number"
                        value={experience.noofyearsexperience || ''}
                        onChange={(e) => handlePreviousExperienceChange(index, 'noofyearsexperience', e.target.value)}
                        placeholder="Years"
                        fullWidth
                        sx={customFieldStyle}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={experience.startdate ? dayjs(experience.startdate) : null}
                          onChange={(newDate) => handlePreviousExperienceChange(index, 'startdate', newDate ? newDate.format('YYYY-MM-DD') : '')}
                          format="DD/MM/YYYY"
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              sx: customFieldStyle,
                              placeholder: 'Start Date'
                            }
                          }}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={2}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={experience.enddate ? dayjs(experience.enddate) : null}
                          onChange={(newDate) => handlePreviousExperienceChange(index, 'enddate', newDate ? newDate.format('YYYY-MM-DD') : '')}
                          format="DD/MM/YYYY"
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              sx: customFieldStyle,
                              placeholder: 'End Date'
                            }
                          }}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={2}>
                      <OutlinedInput
                        value={experience.description || ''}
                        onChange={(e) => handlePreviousExperienceChange(index, 'description', e.target.value)}
                        placeholder="Description"
                        fullWidth
                        sx={customFieldStyle}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <Button
                        variant="outlined"
                        color="error"
                        size="large"
                        onClick={() => deletePreviousExperience(index)}
                        sx={{ minWidth: 'auto', px: 1 }}
                      >
                        <MinusCircleOutlined fontSize="medium" />
                      </Button>
                    </Grid>
                  </Grid>
                ))}

                <Grid item xs={12} mt={2} display="flex" justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    size="medium"
                    startIcon={<BankOutlined />}
                    onClick={addPreviousExperience}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                  >
                    Add Previous Experience
                  </Button>
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold">
                Have you taken a language test?
              </Typography>
            </Grid>

            {/* Language Test Selection */}
            <Grid item xs={12} md={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="languagetest" sx={{ fontWeight: 500, fontSize: '0.95rem', color: '#444' }}>
                  Select Language Test
                </InputLabel>
                <Autocomplete
                  options={languageTests} // Assuming languageTests is an array of language test options
                  getOptionLabel={(option) => option.languagetestname || ''}
                  value={languageTests.find((test) => test.languagetestid === formData.languagetest[0]?.languagetestid) || null}
                  onChange={(event, newValue) => handleTestChange(newValue)} // Use the same function to handle changes
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Language Test"
                      fullWidth
                      sx={{
                        backgroundColor: '#fff',
                        transition: 'all 0.3s ease',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#999' // Default border color
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#333' // On hover border color
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#19D23E', // Greenish border color on focus
                          boxShadow: '0 0 0 2px rgba(25, 210, 62, 0.2)' // Subtle green shadow on focus
                        }
                      }}
                    />
                  )}
                />
              </Stack>
            </Grid>

            {/* Scores Section */}
            {formData.languagetest[0]?.languagetestid &&
              languageTests.find((test) => test.languagetestid === formData.languagetest[0]?.languagetestid)?.languagetestname !==
                'To Be Taken Later' && (
                <>
                  {['speaking', 'reading', 'writing', 'listening'].map((section) => (
                    <Grid item xs={6} md={3} key={section}>
                      <Stack spacing={1}>
                        <InputLabel>{section.charAt(0).toUpperCase() + section.slice(1)} Score</InputLabel>
                        <OutlinedInput
                          name={section}
                          value={formData.languagetest[0]?.[section] || ''}
                          onChange={(e) => handleScoreChange(e, section)}
                          placeholder={`Enter ${section} score`}
                          fullWidth
                        />
                      </Stack>
                    </Grid>
                  ))}
                </>
              )}

            {/* Course/Subjects Interested */}
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="interested-course" sx={{ fontWeight: 500, fontSize: '0.95rem', color: '#444' }}>
                  Course/Subjects Interested
                </InputLabel>
                <TextField
                  id="interested-course"
                  name="interestedcourse"
                  value={formData.interestedcourse}
                  onChange={(e) => setFormData({ ...formData, interestedcourse: e.target.value })}
                  placeholder="Enter your interested courses"
                  fullWidth
                  sx={{
                    backgroundColor: '#fff',
                    transition: 'all 0.3s ease',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#999'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#333'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#19D23E',
                      boxShadow: '0 0 0 2px rgba(25, 210, 62, 0.2)'
                    }
                  }}
                />
              </Stack>
            </Grid>

            {/* Gap in Education/Work */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Gap in Education/Work:
              </Typography>
              <FormGroup>
                <RadioGroup
                  row
                  name="studentgap"
                  value={formData.studentgap}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setFormData({
                      ...formData,
                      studentgap: value,
                      studentgapdescription: value === 2 ? undefined : formData.studentgapdescription
                    });
                  }}
                >
                  <FormControlLabel value={1} control={<Radio />} label="Yes" />
                  <FormControlLabel value={2} control={<Radio />} label="No" />
                </RadioGroup>
              </FormGroup>

              {/* Show text field if "Yes" (1) is selected */}
              {formData.studentgap === 1 && (
                <TextField
                  label="Please provide details for the counselor"
                  name="studentgapdescription"
                  value={formData.studentgapdescription || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      studentgapdescription: e.target.value
                    })
                  }
                  multiline
                  rows={3}
                  fullWidth
                  margin="normal"
                  sx={{
                    backgroundColor: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#999'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#333'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#19D23E',
                      boxShadow: '0 0 0 2px rgba(25, 210, 62, 0.2)'
                    }
                  }}
                />
              )}
            </Grid>

            <Grid item xs={12} sx={{ mb: 0 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Country Interested In:
              </Typography>

              <Autocomplete
                multiple
                options={countries}
                getOptionLabel={(option) => option.countryname}
                value={countries.filter((country) => formData.interestedcountry.includes(country.countryid))}
                onChange={(event, newValue) => handleInterestedCountryChange(newValue)}
                renderInput={(params) => <TextField {...params} placeholder="Select Countries" fullWidth />}
              />
            </Grid>

            {/* Marital Status */}
            <Grid item xs={12} sx={{ mb: 0 }}>
              <InputLabel
                sx={{
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: '#444',
                  mb: 0.5
                }}
              >
                Are you Married?
              </InputLabel>
              <FormGroup row>
                <RadioGroup
                  row
                  name="marritalstatus"
                  value={formData.marritalstatus || null}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setFormData({
                      ...formData,
                      marritalstatus: value,
                      dateofmarriage: value === 1 ? formData.dateofmarriage : '',
                      spousename: value === 1 ? formData.spousename : '',
                      kids: value === 1 ? formData.kids : null,
                      spousedob: value === 1 ? formData.spousedob : '',
                      spouseresume: value === 1 ? formData.spouseresume : ''
                    });
                  }}
                >
                  <FormControlLabel
                    value={1}
                    control={<Radio sx={{ color: '#4caf50', '&.Mui-checked': { color: '#4caf50' } }} />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value={2}
                    control={<Radio sx={{ color: '#f44336', '&.Mui-checked': { color: '#f44336' } }} />}
                    label="No"
                  />
                </RadioGroup>
              </FormGroup>

              {formData.marritalstatus === 1 && (
                <>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date of Marriage"
                      value={formData.dateofmarriage ? dayjs(formData.dateofmarriage) : null}
                      onChange={(newDate) => setFormData({ ...formData, dateofmarriage: newDate ? newDate.format('YYYY-MM-DD') : '' })}
                      format="DD/MM/YYYY"
                      slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                      sx={customFieldStyle}
                    />
                  </LocalizationProvider>

                  {/* Add Spouse Name field */}
                  <Grid item xs={12} mt={2}>
                    <Stack spacing={1}>
                      <TextField
                        id="spousename"
                        name="spousename"
                        value={formData.spousename || ''}
                        onChange={(e) => setFormData({ ...formData, spousename: e.target.value })}
                        placeholder="Enter spouse name"
                        fullWidth
                        sx={{
                          backgroundColor: '#fff',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#999'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#333'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#19D23E',
                            boxShadow: '0 0 0 2px rgba(25, 210, 62, 0.2)'
                          }
                        }}
                      />
                    </Stack>
                  </Grid>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Spouse D.O.B"
                      value={formData.spousedob ? dayjs(formData.spousedob) : null}
                      onChange={(newDate) => setFormData({ ...formData, spousedob: newDate ? newDate.format('YYYY-MM-DD') : '' })}
                      format="DD/MM/YYYY"
                      slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                      sx={customFieldStyle}
                    />
                  </LocalizationProvider>

                  <Grid item xs={12} mt={2}>
                    <Stack spacing={1}>
                      <TextField
                        name="kids"
                        type="number"
                        placeholder="Enter number of kids"
                        value={formData.kids ?? ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            kids: e.target.value === '' ? null : Number(e.target.value)
                          })
                        }
                        fullWidth
                        margin="normal"
                        sx={customFieldStyle}
                      />
                    </Stack>
                  </Grid>

                  <SpouseFileUpload onFileUpload={handleFileUpload} />
                </>
              )}
            </Grid>

            {/* Parent's Details */}
            <Grid item xs={12} sx={{ mb: 0 }}>
              <Typography sx={{ mb: 2 }} variant="subtitle1" fontWeight="bold">
                Parent's Details
              </Typography>

              <Stack spacing={3}>
                {' '}
                {/* Increased spacing for better readability */}
                {/* Father's Occupation */}
                <Stack spacing={1}>
                  <InputLabel>Father's Occupation</InputLabel>
                  <TextField
                    name="fatheroccupation"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter Father's Occupation"
                    value={formData.fatheroccupation || ''}
                    onChange={(e) => setFormData({ ...formData, fatheroccupation: e.target.value })}
                    sx={{
                      '& .MuiInputBase-root': {
                        // Rounded corners for input field
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#999' // Default border color
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#333' // Hover border color
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#4CAF50', // Green border on focus
                          boxShadow: '0 0 0 2px rgba(76, 175, 80, 0.2)' // Green shadow on focus
                        }
                      }
                    }}
                  />
                </Stack>
                {/* Mother's Occupation */}
                <Stack spacing={1}>
                  <InputLabel>Mother's Occupation</InputLabel>
                  <TextField
                    name="motheroccupation"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter Mother's Occupation"
                    value={formData.motheroccupation || ''}
                    onChange={(e) => setFormData({ ...formData, motheroccupation: e.target.value })}
                    sx={{
                      '& .MuiInputBase-root': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#999'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#333'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#4CAF50',
                          boxShadow: '0 0 0 2px rgba(76, 175, 80, 0.2)'
                        }
                      }
                    }}
                  />
                </Stack>
                {/* Number of Siblings */}
                <Stack spacing={1}>
                  <InputLabel>Number of Siblings</InputLabel>
                  <TextField
                    name="sibilings"
                    type="number"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter Number of Siblings"
                    value={formData.sibilings || ''}
                    onChange={(e) => setFormData({ ...formData, sibilings: e.target.value })}
                    inputProps={{ min: 0 }} // Prevents negative numbers
                    sx={{
                      '& .MuiInputBase-root': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#999'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#333'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#4CAF50',
                          boxShadow: '0 0 0 2px rgba(76, 175, 80, 0.2)'
                        }
                      }
                    }}
                  />
                </Stack>
                {/* Parents' Income */}
                <Stack spacing={1}>
                  <InputLabel>Parent's Income (per year)</InputLabel>
                  <TextField
                    name="parentsincome"
                    type="number"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter Parents' Income"
                    value={formData.parentsincome || ''}
                    onChange={(e) => setFormData({ ...formData, parentsincome: e.target.value })}
                    inputProps={{ min: 0 }} // Prevents negative values
                    sx={{
                      '& .MuiInputBase-root': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#999'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#333'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#4CAF50',
                          boxShadow: '0 0 0 2px rgba(76, 175, 80, 0.2)'
                        }
                      }
                    }}
                  />
                </Stack>
                {/* Additional Sponsors */}
                <Typography variant="subtitle1" fontWeight="bold">
                  Additional Sponsors
                </Typography>
                <Stack spacing={1}>
                  {/* Additional Sponsor Relationship */}
                  <InputLabel>Relationship</InputLabel>
                  <TextField
                    name="additionalsponsers"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter additional sponsors"
                    value={formData.additionalsponsers || ''}
                    onChange={(e) => setFormData({ ...formData, additionalsponsers: e.target.value })}
                    sx={{
                      '& .MuiInputBase-root': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#999'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#333'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#4CAF50',
                          boxShadow: '0 0 0 2px rgba(76, 175, 80, 0.2)'
                        }
                      }
                    }}
                  />

                  {/* Additional Sponsor Relationship */}
                  <InputLabel>Additional Sponsor's Relationship</InputLabel>
                  <TextField
                    name="additionalsponsersrelationship"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter additional sponsor's relationship"
                    value={formData.additionalsponsersrelationship || ''}
                    onChange={(e) => setFormData({ ...formData, additionalsponsersrelationship: e.target.value })}
                    sx={{
                      '& .MuiInputBase-root': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#999'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#333'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#4CAF50',
                          boxShadow: '0 0 0 2px rgba(76, 175, 80, 0.2)'
                        }
                      }
                    }}
                  />

                  {/* Sponsor's Annual Income */}
                  <InputLabel>Sponsor's Annual Income</InputLabel>
                  <TextField
                    name="additionalsponsersincome"
                    type="number"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter Sponsor's Annual Income"
                    value={formData.additionalsponsersincome || ''}
                    onChange={(e) => setFormData({ ...formData, additionalsponsersincome: e.target.value })}
                    inputProps={{ min: 0 }} // Prevents negative values
                    sx={{
                      '& .MuiInputBase-root': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#999'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#333'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#4CAF50',
                          boxShadow: '0 0 0 2px rgba(76, 175, 80, 0.2)'
                        }
                      }
                    }}
                  />

                  {/* Applied to Other Universities */}
                  <InputLabel>Have you applied to any other university in any country through any other agent?</InputLabel>
                  <TextField
                    name="appliedotheruniversitydescription"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter details about other applications"
                    value={formData.appliedotheruniversitydescription || ''}
                    onChange={(e) => setFormData({ ...formData, appliedotheruniversitydescription: e.target.value })}
                    margin="normal"
                    sx={{
                      '& .MuiInputBase-root': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#999'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#333'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#4CAF50',
                          boxShadow: '0 0 0 2px rgba(76, 175, 80, 0.2)'
                        }
                      }
                    }}
                  />
                </Stack>
              </Stack>
            </Grid>

            {/* Language Proficiency Test Scores */}
            {/* Show input field when "OTHERS" is checked */}
            {formData.interestedcourse.includes('OTHERS') && (
              <Grid item xs={12} md={6}>
                <TextField
                  label="Specify Other Course"
                  name="otherCourse"
                  value={formData.otherCourse || ''}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            )}
            {/* have you visite any country */}
            <Grid item xs={12} sx={{ mb: 0 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Have you visited any countries before?
              </Typography>

              <FormGroup>
                <RadioGroup
                  row
                  name="visitothercountries"
                  value={formData.visitothercountries} // Ensure it's from formData
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setFormData({
                      ...formData,
                      visitothercountries: value,
                      visitothercountriesdescription: value === 2 ? undefined : formData.visitothercountriesdescription
                    });
                  }}
                >
                  <FormControlLabel
                    value={1}
                    control={
                      <Radio
                        sx={{
                          color: '#4caf50', // Green color for 'Yes'
                          '&.Mui-checked': { color: '#4caf50' } // Green when selected
                        }}
                      />
                    }
                    label="Yes"
                  />
                  <FormControlLabel
                    value={2}
                    control={
                      <Radio
                        sx={{
                          color: '#f44336', // Red color for 'No'
                          '&.Mui-checked': { color: '#f44336' } // Red when selected
                        }}
                      />
                    }
                    label="No"
                  />
                </RadioGroup>

                {formData.visitothercountries === 1 && (
                  <Grid>
                    <Stack spacing={1} sx={{ mt: 1 }}>
                      <InputLabel sx={{ fontWeight: 500, fontSize: '0.95rem', color: '#444', mb: 0.5 }}>
                        Which Country and what Visa?
                      </InputLabel>
                      <TextField
                        name="visitothercountriesdescription"
                        variant="outlined"
                        fullWidth
                        placeholder="E.g., USA - Tourist Visa, UK - Student Visa"
                        value={formData.visitothercountriesdescription || ''}
                        onChange={(e) => setFormData({ ...formData, visitothercountriesdescription: e.target.value })}
                        sx={{
                          '& .MuiInputBase-root': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#999'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#333'
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#4CAF50',
                              boxShadow: '0 0 0 2px rgba(76, 175, 80, 0.2)'
                            }
                          }
                        }}
                      />
                    </Stack>
                  </Grid>
                )}
              </FormGroup>
            </Grid>

            {/* Visa Refusal */}
            <Grid item xs={12} sx={{ mb: 0 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Have you had any visa refusal before?
              </Typography>

              <FormGroup>
                <RadioGroup
                  row
                  name="visarefusal"
                  value={formData.visarefusal} // Use formData for value
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setFormData({
                      ...formData,
                      visarefusal: value,
                      visarefusaldescription: value === 2 ? undefined : formData.visarefusaldescription
                    });
                  }}
                >
                  <FormControlLabel
                    value={1}
                    control={
                      <Radio
                        sx={{
                          color: '#4caf50', // Green color for 'Yes'
                          '&.Mui-checked': { color: '#4caf50' } // Green when selected
                        }}
                      />
                    }
                    label="Yes"
                  />
                  <FormControlLabel
                    value={2}
                    control={
                      <Radio
                        sx={{
                          color: '#f44336', // Red color for 'No'
                          '&.Mui-checked': { color: '#f44336' } // Red when selected
                        }}
                      />
                    }
                    label="No"
                  />
                </RadioGroup>
              </FormGroup>

              {formData.visarefusal === 1 && (
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <InputLabel>What type of Visa & which Country?</InputLabel>
                  <TextField
                    name="visarefusaldescription"
                    variant="outlined"
                    fullWidth
                    placeholder="E.g., USA - Tourist Visa, UK - Student Visa"
                    value={formData.visarefusaldescription || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, visarefusaldescription: e.target.value }))}
                    sx={{
                      '& .MuiInputBase-root': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#999'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#333'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#4CAF50',
                          boxShadow: '0 0 0 2px rgba(76, 175, 80, 0.2)'
                        }
                      }
                    }}
                  />
                </Stack>
              )}
            </Grid>
            <Grid item xs={12} sx={{ mb: 0 }}>
              <InputLabel sx={{ fontWeight: 500, fontSize: '0.95rem', color: '#444', mb: 0.5 }}>
                Do you have any family/relatives overseas?
              </InputLabel>
              <RadioGroup
                row
                name="familyinoverseas"
                value={formData?.familyinoverseas}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setFormData({
                    ...formData,
                    familyinoverseas: value,
                    familyinoverseasdetails: value === 1 ? [{ country: null, relationship: '' }] : []
                  });
                }}
              >
                <FormControlLabel
                  value={1}
                  control={
                    <Radio
                      sx={{
                        color: '#4caf50',
                        '&.Mui-checked': { color: '#4caf50' }
                      }}
                    />
                  }
                  label="Yes"
                />
                <FormControlLabel
                  value={2}
                  control={
                    <Radio
                      sx={{
                        color: '#f44336',
                        '&.Mui-checked': { color: '#f44336' }
                      }}
                    />
                  }
                  label="No"
                />
              </RadioGroup>

              {formData?.familyinoverseas === 1 && (
                <>
                  {formData.familyinoverseasdetails.map((detail, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2 }}>
                      <Autocomplete
                        options={allcountries}
                        getOptionLabel={(option) => option.country_name}
                        renderInput={(params) => <TextField {...params} label="Select Country" variant="outlined" />}
                        value={allcountries.find((c) => c.id === detail.country) || null}
                        onChange={(event, newValue) => handleFamilyRelationshipChange(index, 'country', newValue ? newValue.id : null)}
                        sx={{
                          flex: 1,
                          '& .MuiInputBase-root': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#999'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#333'
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#4CAF50',
                              boxShadow: '0 0 0 2px rgba(76, 175, 80, 0.2)'
                            }
                          }
                        }}
                      />

                      <Autocomplete
                        options={relationships}
                        getOptionLabel={(option) => option}
                        renderInput={(params) => <TextField {...params} label="Select Relationship" variant="outlined" />}
                        value={detail.relationship || ''}
                        onChange={(event, newValue) => handleFamilyRelationshipChange(index, 'relationship', newValue)}
                        sx={{
                          flex: 1,
                          '& .MuiInputBase-root': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#999'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#333'
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#4CAF50',
                              boxShadow: '0 0 0 2px rgba(76, 175, 80, 0.2)'
                            }
                          }
                        }}
                      />

                      {index > 0 && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="large"
                          onClick={() => deleteFamilyRelationship(index)}
                          sx={{ minWidth: 'auto', px: 1 }}
                        >
                          <MinusCircleOutlined fontSize="medium" />
                        </Button>
                      )}
                    </Box>
                  ))}

                  <Grid item xs={12} mt={2} display="flex" justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      size="medium"
                      startIcon={<BankOutlined />}
                      onClick={addFamilyRelationship}
                      sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                      Add Family Relationship
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>

            {/* File Upload */}
            {/* <FileUpload onFileUpload={handleFileUpload} />
            <ul>
              {uploadedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul> */}
            <Grid item xs={12}>
              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="primary"
                disabled={registerStudentMutation.isPending} // Disable button while loading
              >
                {registerStudentMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Register'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}
