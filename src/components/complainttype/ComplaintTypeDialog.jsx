import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Autocomplete, Grid } from '@mui/material';
import Joi from 'joi';
import { getAllCompany } from 'services/company/getAllCompany';
import { useQuery } from '@tanstack/react-query';

const complaintTypeSchema = Joi.object({
  complainttypename: Joi.string().min(2).required().messages({
    'string.empty': 'ComplaintType name is required',
    'string.min': 'ComplaintType name must be at least 2 characters',
  }),
});


const ComplaintTypeDialog = ({
  open,
  onClose,
  onSave,
  title,
  complainttypename,
  setcomplainttypename,
}) => {
  const [errors, setErrors] = useState({});

  const handleSave = () => {
    const validationResult = complaintTypeSchema.validate(
      { complainttypename },
      { abortEarly: false }
    );

    if (validationResult.error) {
      const validationErrors = {};
      validationResult.error.details.forEach((detail) => {
        validationErrors[detail.path[0]] = detail.message;
      });
      setErrors(validationErrors);
      return;
    }

    // Clear errors and proceed with save
    setErrors({});
    onSave();
    onClose();
  };

  // // Fetch company data
  // const { data: allCompany } = useQuery({
  //   queryFn: () => getAllCompany(1),
  //   queryKey: ['allCompany'],
  //   cacheTime: 300000,
  //   refetchOnMount: false,
  // });

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* <Grid item xs={12}>
            <Autocomplete
              fullWidth
              options={allCompany || []}
              value={allCompany?.find((company) => company.companyid === selectedCompanyIdDialog) || null}
              getOptionLabel={(option) => option.companyname || 'Unknown'}
              onChange={(event, newValue) => {
                setSelectedCompanyIdDialog(newValue ? newValue.companyid : '');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Company"
                  placeholder="Company"
                  error={!!errors.selectedCompanyIdDialog}
                  helperText={errors.selectedCompanyIdDialog}
                />
              )}
            />
          </Grid> */}
          <Grid item xs={12}>
            <TextField
              label="Complaint Type Name"
              value={complainttypename}
              onChange={(e) => setcomplainttypename(e.target.value)}
              fullWidth
              error={!!errors.complainttypename}
              helperText={errors.complainttypename}
            />
          </Grid>
        
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
    </Dialog>
  );
};

export default ComplaintTypeDialog;
