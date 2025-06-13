import React, { useRef, useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Stack,
  Typography,
  InputLabel,
  Grid,
  FormControl,
  FormLabel,
  Divider,
  Slider
} from '@mui/material';
import toast from 'react-hot-toast';
import UploadImage from 'utils/UploadImage';
import { PhoneInput } from 'react-international-phone';
import MainCard from 'components/MainCard';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
import Cropper from 'react-easy-crop';
import getCroppedImg from 'utils/getCroppedImg';

const CompanyFormDialog = ({
  open,
  onClose,
  onSubmit,
  contact,
  setContact,
  altercontact,
  setAltercontact,
  companyData, // single state object
  setCompanyData, // setter function for the single state object
  title
}) => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [cropImage, setCropImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const fileInputRef = useRef(null);

  console.log('companyData in Dialog', companyData);
  

  useEffect(() => {
    setImagePreviewUrl(companyData.companyimage);
  }, [companyData.companyimage]);

  // const handleFileChange = async (e) => {
  //   const file = e.target.files[0];
  //   // const validImageTypes = ['image/jpeg', 'image/png'];

  //   if (file) {
  //     // if (!validImageTypes.includes(file.type)) {
  //     //   toast.error('Only image files (JPG, PNG) are allowed', { duration: 5000 });
  //     //   fileInputRef.current.value = '';
  //     //   return;
  //     // }

  //     // Check if the file size is less than or equal to 5MB (5 * 1024 * 1024 bytes)
  //     if (file.size > 5 * 1024 * 1024) {
  //       toast.error('File size should not exceed 5MB', { duration: 5000 });
  //       fileInputRef.current.value = ''; // Reset the file input
  //       return;
  //     }

  //     const reader = new FileReader();
  //     reader.onloadend = () => setImagePreviewUrl(reader.result);
  //     reader.readAsDataURL(file);

  //     try {
  //       const imageUrl = await UploadImage({ srcData: file, folderName: 'company' });
  //       setCompanyData((prevData) => ({ ...prevData, companyimage: imageUrl })); // Update only the companyimage field
  //       toast.success('Image uploaded successfully');
  //     } catch (error) {
  //       console.error('Error uploading image:', error);
  //       toast.error('Error uploading image');
  //     }
  //   }
  // };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should not exceed 5MB');
        fileInputRef.current.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropImage(reader.result);
        setIsCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(cropImage, croppedAreaPixels);
      console.log("croppedImage", croppedImage)
      setImagePreviewUrl(croppedImage);
      setIsCropDialogOpen(false);

      const imageUrl = await UploadImage({ srcData: croppedImage, folderName: 'company' });
      setCompanyData((prevData) => ({ ...prevData, companyimage: imageUrl }));
      toast.success('Image uploaded successfully');
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
    setCompanyData((prevData) => ({ ...prevData, [name]: value })); // Update the relevant field in companyData
  };

  const handleSave = () => {
    onSubmit();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <Divider />
      <DialogContent fullWidth>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField name="companyname" label="Company Name" fullWidth value={companyData.companyname} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="companyuniqueid"
              label="Company Unique ID"
              fullWidth
              value={companyData.companyuniqueid}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="companyaddress"
              label="Company Address"
              fullWidth
              multiline
              rows={4}
              value={companyData.companyaddress}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel htmlFor="upload-image">Upload Company Image</InputLabel>
            <Button variant="dashed" component="label" fullWidth>
              Upload File
              <input ref={fileInputRef} accept=".jpg, .jpeg, .png" type="file" hidden onChange={handleFileChange} />
            </Button>
            <Typography variant="body1" color="secondary" sx={{ marginTop: 1 }}>
              Image size limit &lt; 5MB
            </Typography>
            {imagePreviewUrl && (
              <img
                src={imagePreviewUrl}
                alt="Preview"
                style={{
                  marginTop: '10px',
                  maxWidth: '100%',
                  borderRadius: '16px'
                }}
              />
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <FormLabel
                sx={{
                  color: 'black'
                }}
              >
                Primary Contact
              </FormLabel>
              <PhoneInput
                value={contact}
                style={{ width: '100%' }}
                inputStyle={{ width: '100%' }}
                defaultCountry="ae"
                onChange={(phone) => {
                  setContact(phone);
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <FormLabel
                sx={{
                  color: 'black'
                }}
              >
                Alternate Contact
              </FormLabel>
              <PhoneInput
                value={altercontact}
                style={{ width: '100%' }}
                inputStyle={{ width: '100%' }}
                defaultCountry="ae"
                onChange={(phone) => {
                  setAltercontact(phone);
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField name="email" label="Email" fullWidth value={companyData.email} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField name="alteremail" label="Alternate Email" fullWidth value={companyData.alteremail} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="billingaddress"
              label="Billing Address"
              fullWidth
              multiline
              rows={4}
              value={companyData.billingaddress}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField name="gstnumber" label="VAT Number" fullWidth value={companyData.gstnumber} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <MainCard title="Quotation: Notes">
              <ReactQuill
                name="companyquotationnotes"
                value={companyData?.companyquotationnotes}
                onChange={(value) => setCompanyData((prevData) => ({ ...prevData, companyquotationnotes: value }))}
                theme="snow"
                placeholder="Provide notes..."
              />
            </MainCard>
          </Grid>

          <Grid item xs={12}>
            <MainCard title="Quotation: Terms & Conditions">
              <ReactQuill
                name="companyquotationtermsandconditions"
                value={companyData?.companyquotationtermsandconditions}
                onChange={(value) => setCompanyData((prevData) => ({ ...prevData, companyquotationtermsandconditions: value }))}
                theme="snow"
                placeholder="Provide terms & conditions..."
              />
            </MainCard>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant='contained'>
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant='contained'>
          Save
        </Button>
      </DialogActions>

      {/* Crop Dialog */}
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
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e, zoom) => setZoom(zoom)}
            aria-labelledby="Zoom"
          />
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
    </Dialog>
  );
};

export default CompanyFormDialog;
