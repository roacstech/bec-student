// material-ui
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

// project import
import Avatar from 'components/@extended/Avatar';
import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';
import MainCard from 'components/MainCard';

// assets
import Target from 'assets/images/analytics/target.svg';
import { useEffect, useState } from 'react';

// ==============================|| LABELLED TASKS ||============================== //

export default function LabelledTasks({response}) {
  console.log('response', response);




  
  return (
    <Grid item xs={12}>
    <MainCard sx={{ width: '100%' }}>
      <Grid container spacing={1.25}>
        <Grid item xs={6}>
          <Typography>Pending jobs</Typography>
        </Grid>
        <Grid item xs={6}>
          <LinearWithLabel
            value={response?.percentages?.pending}
            sx={{ '& .MuiLinearProgress-bar': { backgroundColor: '#FFC107' } }} // Amber
          />
        </Grid>
        <Grid item xs={6}>
          <Typography>Assigned jobs</Typography>
        </Grid>
        <Grid item xs={6}>
          <LinearWithLabel
            value={response?.percentages?.assigned}
            sx={{ '& .MuiLinearProgress-bar': { backgroundColor: '#00BCD4' } }} // Cyan
          />
        </Grid>
        <Grid item xs={6}>
          <Typography>Started Jobs</Typography>
        </Grid>
        <Grid item xs={6}>
          <LinearWithLabel
            value={response?.percentages?.started}
            sx={{ '& .MuiLinearProgress-bar': { backgroundColor: '#3F51B5' } }} // Indigo
          />
        </Grid>
        <Grid item xs={6}>
          <Typography>Completed jobs</Typography>
        </Grid>
        <Grid item xs={6}>
          <LinearWithLabel
            value={response?.percentages?.completed}
            sx={{ '& .MuiLinearProgress-bar': { backgroundColor: '#4CAF50' } }} // Green
          />
        </Grid>
        <Grid item xs={6}>
          <Typography>WCC</Typography>
        </Grid>
        <Grid item xs={6}>
          <LinearWithLabel
            value={response?.percentages?.wcc}
            sx={{ '& .MuiLinearProgress-bar': { backgroundColor: '#9C27B0' } }} // Purple
          />
        </Grid>
        <Grid item xs={6}>
          <Typography>GRN</Typography>
        </Grid>
        <Grid item xs={6}>
          <LinearWithLabel
            value={response?.percentages?.grn}
            sx={{ '& .MuiLinearProgress-bar': { backgroundColor: '#FF5722' } }} // Deep Orange
          />
        </Grid>
        <Grid item xs={6}>
          <Typography>Invoice</Typography>
        </Grid>
        <Grid item xs={6}>
          <LinearWithLabel
            value={response?.percentages?.invoice}
            sx={{ '& .MuiLinearProgress-bar': { backgroundColor: '#607D8B' } }} // Blue Grey
          />
        </Grid>
        <Grid item xs={6}>
          <Typography>Payment</Typography>
        </Grid>
        <Grid item xs={6}>
          <LinearWithLabel
            value={response?.percentages?.payment}
            sx={{ '& .MuiLinearProgress-bar': { backgroundColor: '#795548' } }} // Brown
          />
        </Grid>
        <Grid item xs={6}>
          <Typography>Not Started Jobs</Typography>
        </Grid>
        <Grid item xs={6}>
          <LinearWithLabel
            value={response?.notStarted}
            sx={{ '& .MuiLinearProgress-bar': { backgroundColor: '#F44336' } }} // Red
          />
        </Grid>
      </Grid>
    </MainCard>
  </Grid>
  
  );
}
