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
  Slider
} from '@mui/material';
import toast from 'react-hot-toast';
import { PhoneInput } from 'react-international-phone';
import Cropper from 'react-easy-crop';
import getCroppedImg from 'utils/getCroppedImg';
import UploadImage from 'utils/UploadImage';

const AdminFormDialog = ({ open, onClose, onSubmit, adminData, setAdminData, title }) => {
  console.log('adminData', adminData);

  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [signaturePreviewUrl, setSignaturePreviewUrl] = useState('');
  const [cropImage, setCropImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [cropField, setCropField] = useState(''); // Track which field is being cropped
  const imageFileRef = useRef(null);
  const signatureFileRef = useRef(null);

  useEffect(() => {
    setImagePreviewUrl(adminData.adminimage);
    setSignaturePreviewUrl(adminData.adminsignature);
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
        setCropField(field); // Set the field to either 'adminimage' or 'adminsignature'
        setIsCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(cropImage, croppedAreaPixels);
      if (cropField === 'adminimage') {
        setImagePreviewUrl(croppedImage);
        const imageUrl = await UploadImage({ srcData: croppedImage, folderName: 'admin' });
        setAdminData((prevData) => ({ ...prevData, adminimage: imageUrl }));
      } else if (cropField === 'adminsignature') {
        setSignaturePreviewUrl(croppedImage);
        const imageUrl = await UploadImage({ srcData: croppedImage, folderName: 'admin' });
        setAdminData((prevData) => ({ ...prevData, adminsignature: imageUrl }));
      }
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
    setAdminData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    onSubmit();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField name="adminname" label="Admin Name" fullWidth value={adminData.adminname} onChange={handleChange} />
          </Grid>
          <Grid item xs={6}>
            <TextField name="adminuniqueid" label="Admin Unique ID" fullWidth value={adminData.adminuniqueid} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <FormLabel>Primary Contact</FormLabel>
              <PhoneInput
                style={{ width: '100%' }}
                inputStyle={{ width: '100%' }}
                value={adminData.adminprimarycontact}
                defaultCountry="ae"
                onChange={(phone) => setAdminData((prevData) => ({ ...prevData, adminprimarycontact: phone }))}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <FormLabel>Alternate Contact</FormLabel>
              <PhoneInput
                style={{ width: '100%' }}
                inputStyle={{ width: '100%' }}
                value={adminData.adminaltercontact}
                defaultCountry="ae"
                onChange={(phone) => setAdminData((prevData) => ({ ...prevData, adminaltercontact: phone }))}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="adminprimaryemail"
              label="Primary Email"
              fullWidth
              value={adminData.adminprimaryemail}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField name="adminalteremail" label="Alternate Email" fullWidth value={adminData.adminalteremail} onChange={handleChange} />
          </Grid>
          <Grid item xs={6}>
            <InputLabel>Upload Admin Image</InputLabel>
            <Button variant="dashed" component="label" fullWidth>
              Upload File
              <input ref={imageFileRef} accept=".jpg, .jpeg, .png" type="file" hidden onChange={(e) => handleFileChange(e, 'adminimage')} />
            </Button>
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
          <Grid item xs={6}>
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
            {signaturePreviewUrl && (
              <img
                src={signaturePreviewUrl}
                alt="Signature Preview"
                style={{
                  marginTop: '10px',
                  maxWidth: '100%',
                  borderRadius: '16px'
                }}
              />
            )}
          </Grid>
          {/* Additional form fields */}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>

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
    </Dialog>
  );
};

export default AdminFormDialog;
