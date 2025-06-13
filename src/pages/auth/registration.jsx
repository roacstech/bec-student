// material-ui
import { Stack, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import useAuth from 'hooks/useAuth';
import { Link } from 'react-router-dom';
import AuthWrapper from 'sections/auth/AuthWrapper';

// project imports
import ContactForm from 'sections/extra-pages/contact-us/ContactForm';
import ContactHeader from 'sections/extra-pages/contact-us/ContactHeader';
import RegistrationForm from 'sections/registration/registrationForm';

// ==============================|| CONTACT US - MAIN ||============================== //

export default function Registration() {
  const { isLoggedIn } = useAuth();

  return (
    <AuthWrapper>
      <Grid container fullWidth width="md" spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Sign up</Typography>
            <Typography
              component={Link}
              to={isLoggedIn ? '/auth/login' : '/login'}
              variant="body1"
              sx={{ textDecoration: 'none' }}
              color="primary"
            >
              Already have an account?
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <RegistrationForm />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
