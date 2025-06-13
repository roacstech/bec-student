import { Box, Grid, List, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import WelcomeBanner from 'components/dashboard/WelcomeBanner';
import React from 'react';

import { useTheme } from '@mui/material/styles';
import { customercard } from 'services/dashboard/customercard';

const Dashboard = () => {
  const theme = useTheme();

  return (
    

    <Grid container rowSpacing={4.5} columnSpacing={3}>
      {/* row 1 */}
      <Grid item xs={12}>
        <WelcomeBanner />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
