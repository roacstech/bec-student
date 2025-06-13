import React, { useState } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { MdWork, MdSchool, MdStar, MdQuestionMark } from 'react-icons/md'; // React Icons
import { useTheme } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getActivity as fetchActivity } from 'services/Lead-Activity/getActivity';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import ActivityDialog from 'components/dialog/ActivityDialog';
import { addActivity } from 'services/Lead-Activity/addActivity';
import toast from 'react-hot-toast';
import { borderTop, color } from '@mui/system';
import MainCard from 'components/MainCard';

const LeadActivity = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams(); // Fetching the 'id' from URL
  const { data, isLoading, error, refetch } = useQuery({
    queryFn: () => fetchActivity(id),
    queryKey: ['getActivity', id], // Caching the query by 'id'
    cacheTime: 300000, // Cache for 5 minutes
    refetchOnMount: false
  });

  const activityData = data?.[0]?.activities || []; // Handling missing activities
  const leadData = data?.[0] || []; // Handling missing activities
  console.log('leadData', leadData);

  // dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const handleActivityClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedActivity(null);
  };

  const handleSaveActivity = async (updatedActivity) => {
    // Prepare the data to be sent to the API
    const activityData = {
      activityname: updatedActivity.activityname, // Ensure this is the correct case (e.g., "Call")
      activitytypeid: updatedActivity.activitytypeid,
      activitystatusid: 1, // Replace with the correct ID as needed
      leadstageid: 1, // Replace with the correct ID as needed
      leadstatusid: 4, // Replace with the correct ID as needed
      leadid: id, // Ensure `id` is defined in your component
      followupdate: updatedActivity.followupdate,
      activityfromdate: updatedActivity.activityfromdate,
      activitytodate: updatedActivity.activitytodate,
      activitytags: updatedActivity.activitytags,
      activitynotes: updatedActivity.activitynotes,
      activityimage: '', // Set this value as needed
      audiofileurl: '', // Set this value as needed
      videofileurl: '' // Set this value as needed
    };

    console.log(activityData); // Log the final data being sent
    try {
      const res = await addActivity(activityData);
      console.log(res);
      if (res.status) {
        refetch();
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error('Error Saving Activity:', error);
      toast.error('Error saving activity. Please try again.');
    }

    handleDialogClose(); // Ensure this closes the dialog
  };

  if (isLoading) {
    return <p>Loading activities...</p>; // Show loading state
  }

  if (error) {
    return <p>Error loading activities.</p>; // Show error state
  }

  return (
    <Box>
      <Stack
        sx={{
          marginBottom: 3
        }}
      >
        <Grid container xs={12} spacing={3}>
          <Grid item xs={4}>
            <Card sx={{ display: 'flex' }}>
              <CardMedia component="img" sx={{ width: 151 }} image={leadData?.leadimage} alt={leadData?.leadname} />
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Typography component="div" variant="h5">
                    {leadData?.leadname}
                  </Typography>

                  <Typography variant="subtitle1" component="div" sx={{ color: 'text.secondary' }}>
                    {leadData?.primaryemail}
                  </Typography>
                  <Typography variant="subtitle2" component="div" sx={{ color: 'text.secondary' }}>
                    {leadData?.primarycontact}
                  </Typography>

                  <Chip
                    label={leadData?.leadstatusname}
                    color="primary"
                    variant="combined"
                    size="small"
                    sx={{
                      marginTop: 1
                    }}
                  />
                </CardContent>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <MainCard title="Interested Products">
              <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {leadData?.products?.map((value) => {
                  const labelId = `checkbox-list-secondary-label-${value}`;
                  return (
                    <ListItem key={value} disablePadding>
                      <ListItemButton>
                        <ListItemAvatar>
                          <Avatar alt={value?.productname} src={value?.productimage} />
                        </ListItemAvatar>
                        <ListItemText id={labelId} primary={value?.productname} secondary={value?.categoryname} />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </MainCard>
          </Grid>
          <Grid item xs={4}></Grid>
        </Grid>
      </Stack>

      <MainCard>
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'end',
            gap: 1
          }}
        >
          <Button variant="contained" color="secondary" onClick={() => navigate('/customer/details')}>
            Back
          </Button>
          <Button variant="contained" onClick={() => handleActivityClick()}>
            Add Activity
          </Button>
        </Stack>
        <VerticalTimeline lineColor={theme.palette.primary.main}>
          {activityData.length > 0 ? (
            activityData.map((activity, index) => (
              <VerticalTimelineElement
                key={index}
                className="vertical-timeline-element--work"
                date={activity?.activitydate ? format(parseISO(activity.activitydate), 'dd-MMM, yyyy') : 'No Date'}
                iconStyle={{
                  background: theme.palette.primary.main, // Primary color for the icon background
                  color: '#fff'
                }}
                icon={activity.type === 'work' ? <MdWork /> : activity.type === 'school' ? <MdSchool /> : <MdQuestionMark />} // Dynamic icon with fallback
                sx={{
                  borderTop: '3px solid red', // Change top border color here
                  borderRadius: '5px', // Optional: rounded corners
                  marginBottom: 2 // Add space between timeline elements
                }}
              >
                {/* Displaying all the activity data */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 2
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar src={activity?.activitytypeimage} />
                    <Typography variant="h6">{activity?.activitytypename || 'No Title'}</Typography>
                  </Stack>
                  <Chip label={activity?.activitystatusname || 'No Status'} color="primary" size="small" />
                </Box>

                {/* Additional Fields */}
                <Typography variant="subtitle1" gutterBottom>
                  {activity.location || 'No Location'}
                </Typography>

                <Typography variant="subtitle1">
                  <strong>Notes:</strong> {activity.activitynotes || 'No Notes'}
                </Typography>

                <Typography variant="subtitle1">
                  <strong>Tags:</strong> {activity.activitytags || 'No Tags'}
                </Typography>

                <Typography variant="subtitle1">
                  <strong>Follow-up Date:</strong>{' '}
                  {activity.followupdate ? format(parseISO(activity.followupdate), 'dd-MMM, yyyy hh:mm a') : 'No Follow-up Date'}
                </Typography>

                {/* Increased padding and spacing */}
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2, // Rounded corners
                        boxShadow: 2, // Subtle shadow for depth
                        overflow: 'hidden', // Prevent overflow
                        bgcolor: theme.palette.primary.light // Light background color
                      }}
                    >
                      <Typography variant="subtitle1" color="white" fontWeight="bold">
                        From Date
                      </Typography>
                      <Typography variant="body1" color="white">
                        {activity.activityfromdate ? format(parseISO(activity.activityfromdate), 'dd-MMM, yyyy') : 'No From Date'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2, // Rounded corners
                        boxShadow: 2, // Subtle shadow for depth
                        overflow: 'hidden', // Prevent overflow
                        bgcolor: theme.palette.primary.light // Light background color
                      }}
                    >
                      <Typography variant="subtitle1" color="white" fontWeight="bold">
                        To Date
                      </Typography>
                      <Typography variant="body1" color="white">
                        {activity.activitytodate ? format(parseISO(activity.activitytodate), 'dd-MMM, yyyy') : 'No To Date'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Optional Fields for Media */}
                {activity.activityimage && (
                  <Box mt={2}>
                    <img src={activity.activityimage} alt="Activity Image" style={{ width: '100%', height: 'auto' }} />
                  </Box>
                )}

                {activity.audiofileurl && (
                  <Box mt={2}>
                    <audio controls>
                      <source src={activity.audiofileurl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </Box>
                )}

                {activity.videofileurl && (
                  <Box mt={2}>
                    <video controls width="100%">
                      <source src={activity.videofileurl} type="video/mp4" />
                      Your browser does not support the video element.
                    </video>
                  </Box>
                )}
              </VerticalTimelineElement>
            ))
          ) : (
            <p>No activities found.</p>
          )}

          {/* Final element for the timeline */}
          {activityData.length > 0 && activityData[activityData.length - 1].activitystatusname === 'COMPLETED' && (
            <VerticalTimelineElement
              key={activityData[activityData.length - 1].id} // Use a unique key for the last element
              iconStyle={{ background: 'rgb(16, 204, 82)', color: '#000' }}
              icon={<MdStar />}
            ></VerticalTimelineElement>
          )}
        </VerticalTimeline>
      </MainCard>

      {/* Dialog for editing activity */}
      <ActivityDialog open={dialogOpen} onClose={handleDialogClose} activityData={selectedActivity || {}} handleSave={handleSaveActivity} />
    </Box>
  );
};

export default LeadActivity;
