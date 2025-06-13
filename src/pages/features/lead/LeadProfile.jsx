import { useRef } from 'react';
import { Grid } from '@mui/material';
import ProfileTabs from 'sections/apps/profiles/user/ProfileTabs';
import TabPersonal from 'sections/apps/profiles/user/TabPersonal';
import { useParams } from 'react-router';
import { getAllLeads } from 'services/lead/getAllLeads';
import { useQuery } from '@tanstack/react-query';

// ==============================|| PROFILE - USER ||============================== //

const LeadProfile = () => {
  const inputRef = useRef(null);
  const { id } = useParams();

  const focusInput = () => {
    inputRef.current?.focus();
  };

  // Fetch leads data based on the id from the URL
  const { data, error } = useQuery({
    queryFn: () =>
      getAllLeads({
        leadid: id,
        from: '',
        to: '',
        leadstatusid: 0,
        limit: 100,
        offset: 0
      }),
    queryKey: ['allLead', id], // Include 'id' in the query key for proper cache management
    onError: (error) => {
      console.error('Error fetching data:', error);
    },
    cacheTime: 300000, // Data is cached for 5 minutes
  });

  if (error) {
    console.error('Error fetching data:', error);
  }

  // Use optional chaining to safely access the first element of data
  const leadDetails = data?.[0];

  console.log('Lead ID:', id);
  console.log('Fetched data:', data);
  console.log('Individual lead:', leadDetails);

  return (
    <Grid container spacing={3}>
      {/* <Grid item xs={12}>
        <ProfileCard focusInput={focusInput} />
      </Grid> */}
      <Grid item xs={4}>
        <s focusInput={focusInput} leadDetails={leadDetails} />
      </Grid>
      <Grid item xs={8}>
        <TabPersonal leadDetails={leadDetails} />
      </Grid>
    </Grid>
  );
};

export default LeadProfile;
