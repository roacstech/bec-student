import React, { useRef, useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid,
  InputLabel,
  Typography,
  FormControl,
  FormLabel,
  Divider,
  Slider,
  Avatar,
  Stack,
  Box
} from '@mui/material';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PhoneInput } from 'react-international-phone';
import Cropper from 'react-easy-crop';
import getCroppedImg from 'utils/getCroppedImg';
import UploadImage from 'utils/UploadImage';
import { getUserByID } from 'services/users/getUserByID';
import { CameraOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import BackButton from 'components/Button/BackButton';
import { editUserProfile } from 'services/users/editUserProfile';
import { useLocation, useNavigate } from 'react-router';


const EditProfile = () => {
  const roleId = localStorage.getItem('roleid');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: adminData, refetch } = useQuery({
    queryKey: ['getUserByID', roleId],
    queryFn: () => getUserByID({ roleid: Number(roleId) })
  });

  console.log('adminData 👌', adminData);
  

  const [formData, setFormData] = useState({
    username: '',
    primarycontact: '',
    altercontact: '',
    primaryemail: '',
    alteremail: '',
    userimage: '',
    adminuniqueid: '',
    signatureurl: ''
  });

  const [cropImage, setCropImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [cropField, setCropField] = useState('');
  const imageFileRef = useRef(null);
  const signatureFileRef = useRef(null);

  // edit profile mutation

  const editMutation = useMutation({
    mutationFn: editUserProfile,
    onSuccess: (data) => {
      // console.log('data!!!!!!', data);
      if (data?.status) {
        queryClient.refetchQueries(['allUnReadNotification']);
        queryClient.refetchQueries(['allNotification']);
        toast.success(data?.message);
        navigate('/dashboard');
       
      } else {
        toast.error(data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    }
  });

  useEffect(() => {
    if (adminData) {
      setFormData({
        username: adminData?.username || '',
        primarycontact: adminData?.primarycontact || '',
        altercontact: adminData?.altercontact || '',
        primaryemail: adminData?.primaryemail || '',
        alteremail: adminData?.alteremail || '',
        userimage: adminData?.userimage || '',
        adminuniqueid: adminData?.useruniqueid || '',
        signatureurl: adminData?.signatureurl || ''
      });
    }
  }, [adminData]);

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should not exceed 5MB');
        if (field === 'adminimage') imageFileRef.current.value = '';
        if (field === 'adminsignature') signatureFileRef.current.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setCropImage(reader.result);
        setCropField(field);
        setIsCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(cropImage, croppedAreaPixels);
    
        const imageUrl = await UploadImage({ srcData: croppedImage, folderName: 'admin' });
        setFormData((prevData) => ({ ...prevData, signatureurl: imageUrl }));
      
      setIsCropDialogOpen(false);
      toast.success(`${cropField === 'adminimage' ? 'Image' : 'Signature'} uploaded successfully`);
    } catch (error) {
      console.error('Error cropping the image:', error);
      toast.error('Error cropping the image');
    }
  };

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleProfileImage = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if the file size is less than or equal to 5MB (5 * 1024 * 1024 bytes)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should not exceed 5MB', { duration: 5000 });
        fileInputRef.current.value = ''; // Reset the file input
        return;
      }
      try {
        const uploadedImageUrl = await UploadImage({ srcData: file, folderName: 'Employee-Profile' });
        // Update the staffData with the new profileImage
        setFormData((prevData) => ({
          ...prevData,
          userimage: uploadedImageUrl
        }));

        toast.success('Successfully uploaded image');
      } catch (error) {
        toast.error('Error uploading image');
        alert('Failed to upload image. Please try again.');
      }
    }
  };

  const handleSave = () => {
    toast.success('Profile saved successfully!');
    refetch();
  };




  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data to send, ensuring necessary properties are included
    const dataToSend = {
      roleid: Number(roleId),
      username: formData?.username,
      primarycontact: formData?.primarycontact,
      altercontact: formData?.altercontact,
      primaryemail: formData?.primaryemail,
      alteremail: formData?.alteremail,
      userimage: formData?.userimage,
      signatureurl: formData?.signatureurl
    };

    console.log('user data sende', dataToSend);

    // Trigger the mutation (edit employee)
    editMutation.mutate(dataToSend);
  };




  return (

    <Box>
         <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: '3rem',
          bgcolor: '#FAFAFB',
          zIndex: 5,
          py: 3
        }}
      >
        <Box display="flex" gap={1}>
          <BackButton />
         
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Stack>
      </Box>
 <Grid container spacing={3}>
     
     <Grid item xs={12} sm={12} lg={12}>
       <MainCard title="Profile Details">
         <Stack direction="column">
           <Grid container spacing={3}>
             
             <Grid item xs={12}sm={12} lg={12}>
               <Box >
                 <FormLabel
                   htmlFor="change-avatar"
                   sx={{
                     position: 'relative',
                     borderRadius: '50%',
                     '&:hover .MuiBox-root': { opacity: 1 },
                     cursor: 'pointer',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center'
                   }}
                 >
                   <Avatar alt={`${formData.username}`} src={formData?.userimage} sx={{ width: 124, height: 124, border: '1px solid' }} />
                   <Box
                     sx={{
                       position: 'absolute',
                       top: 0,
                       left: 0,
                       width: '100%',
                       height: '100%',
                       opacity: 0,
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center'
                     }}
                   >
                     <Stack spacing={0.5} alignItems="center">
                       <CameraOutlined style={{ fontSize: '2rem', color: 'white' }} />
                       <Typography sx={{ color: 'white' }}>Upload</Typography>
                     </Stack>
                   </Box>
                 </FormLabel>
                 <TextField
                   type="file"
                   accept="image/*"
                   id="change-avatar"
                   placeholder="Outlined"
                   variant="outlined"
                   sx={{ display: 'none' }}
                   onChange={handleProfileImage}
                 />
               </Box>
             </Grid>

             <Grid item xs={6}> 
             <TextField name="username" label="User Name" fullWidth value={formData.username || ''} onChange={handleChange} />

             </Grid>

             <Grid item xs={6}>
               <TextField
                 name="adminuniqueid"
                 label="User ID"
                 fullWidth
                 InputProps={{ readOnly: true }} // Removes underline for embedded select
                 value={formData.adminuniqueid || ''}
                 onChange={handleChange}
               />
             </Grid>
             <Grid item xs={6}>
               <FormControl fullWidth>
                 <FormLabel>Primary Contact</FormLabel>
                 <PhoneInput
                   style={{ width: '100%' }}
                   inputStyle={{ width: '100%' }}
                   value={formData.primarycontact || ''}
                   defaultCountry="ae"
                   onChange={(phone) => setFormData((prevData) => ({ ...prevData, primarycontact: phone }))}
                 />
               </FormControl>
             </Grid>
             <Grid item xs={6}>
               <FormControl fullWidth>
                 <FormLabel>Alternate Contact</FormLabel>
                 <PhoneInput
                 style={{ width: '100%' }}
                 inputStyle={{ width: '100%' }}
                   value={formData.altercontact || ''}
                   defaultCountry="ae"
                   onChange={(phone) => setFormData((prevData) => ({ ...prevData, altercontact: phone }))}
                 />
               </FormControl>
             </Grid>
             <Grid item xs={6}>
               <TextField
                 name="adminprimaryemail"
                 label="Primary Email"
                 fullWidth
                 value={formData.primaryemail || ''}
                 onChange={handleChange}
               />
             </Grid>
             <Grid item xs={6}>
               <TextField
                 name="adminalteremail"
                 label="Alternate Email"
                 fullWidth
                 value={formData.alteremail || ''}
                 onChange={handleChange}
               />
             </Grid>
           
             <Grid item xs={12}>
               <InputLabel>Upload Admin Signature</InputLabel>
               <Button variant="dashed" component="label" fullWidth>
                 Upload File
                 <input
                   ref={signatureFileRef}
                   accept=".jpg, .jpeg, .png"
                   type="file"
                   hidden
                   onChange={(e) => handleFileChange(e, 'adminsignature')}
                 />
               </Button>
               {formData?.signatureurl && (
                   <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                     <img src={formData?.signatureurl} alt="Preview" style={{
                 marginTop: '10px',
                 maxWidth: '100%',
                 borderRadius: '16px'
               }} />
                   </div>
                 )}
             </Grid>

             <Dialog open={isCropDialogOpen} onClose={() => setIsCropDialogOpen(false)} fullWidth maxWidth="sm">
               <DialogTitle>Crop Image</DialogTitle>
               <DialogContent>
                 <div style={{ position: 'relative', width: '100%', height: 400, background: '#333' }}>
                   <Cropper
                     image={cropImage}
                     crop={crop}
                     zoom={zoom}
                     aspect={1}
                     onCropChange={setCrop}
                     onZoomChange={setZoom}
                     onCropComplete={handleCropComplete}
                   />
                 </div>
                 <Slider value={zoom} min={1} max={3} step={0.1} onChange={(e, zoom) => setZoom(zoom)} aria-labelledby="Zoom" />
               </DialogContent>
               <DialogActions>
                 <Button onClick={() => setIsCropDialogOpen(false)} color="secondary">
                   Cancel
                 </Button>
                 <Button onClick={handleCropSave} color="primary">
                   Save
                 </Button>
               </DialogActions>
             </Dialog>
           </Grid>
         </Stack>
       </MainCard>
     </Grid>

   </Grid>
    </Box>

    
   
  );
};

export default EditProfile;
