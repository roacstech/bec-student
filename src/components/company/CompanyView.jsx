// /* eslint-disable no-unused-vars */
// import PropTypes from 'prop-types';

// // material-ui
// import { useTheme } from '@mui/material/styles';
// import {
//   useMediaQuery,
//   Grid,
//   Divider,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemSecondaryAction,
//   Stack,
//   TableCell,
//   TableRow,
//   Typography,
//   Chip,
//   Tooltip,
//   Button,
//   Box
// } from '@mui/material';

// // third-party
// // import { PatternFormat } from 'react-number-format';

// // project import
// import MainCard from 'components/MainCard';
// import Transitions from 'components/@extended/Transitions';

// // assets
// import { CloseOutlined, EnvironmentOutlined, EyeTwoTone, MailOutlined, PhoneOutlined } from '@ant-design/icons';
// import { useState } from 'react';

// const CompanyView = ({ data }) => {
//   console.log('CompanyView data', data);
//   const [showPassword, setShowPassword] = useState(false);
//   const theme = useTheme();
//   const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));

//   return (
//     <TableRow sx={{ '&:hover': { bgcolor: `transparent !important` }, overflow: 'hidden' }}>
//       <TableCell colSpan={12} sx={{ p: 2.5, overflow: 'hidden' }}>
//         <Transitions type="slide" direction="down" in={true}>
//           <Grid container spacing={2.5} sx={{ pl: { xs: 0, sm: 5, md: 6, lg: 10, xl: 12 } }}>
//             <Grid item xs={12} sm={5} md={5}>
//               <MainCard>
//                 <Grid container spacing={3}>
//                   <Grid item xs={12}>
//                     <Stack
//                       spacing={2}
//                       alignItems="center"
//                       sx={{
//                         px: 3
//                       }}
//                     >
//                       <Stack spacing={0.5} alignItems="center">
//                         <img
//                           src={data.companyimage}
//                           alt={data.companyname}
//                           style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10%' }}
//                         />
//                         <Typography variant="h5">{data.companyname}</Typography>
//                         <Typography color="secondary">{data.companyuniqueid}</Typography>
//                       </Stack>
//                       <Stack alignItems="center" direction="row" spacing={1}>
//                         <Typography>GST Number</Typography>
//                         <Typography sx={{ textTransform: 'capitalize' }} variant="h6">
//                           <Chip label={data.gstnumber} color="primary" />
//                         </Typography>
//                       </Stack>
//                     </Stack>
//                   </Grid>
//                   <Grid item xs={12}>
//                     <Divider />
//                   </Grid>
//                   <Grid item xs={12}>
//                     <Divider />
//                   </Grid>
//                   <Grid
//                     item
//                     xs={12}
//                     sx={{
//                       pl: 2
//                     }}
//                   >
//                     <List component="nav" aria-label="main mailbox folders" sx={{ py: 0 }}>
//                       <ListItem>
//                         <ListItemIcon>
//                           <MailOutlined />
//                         </ListItemIcon>
//                         <ListItemSecondaryAction>
//                           <Typography align="right">{data.email}</Typography>
//                           {/* <Typography align="right" variant="body2" color="textSecondary">
//                             Alternate Email: {data.alteremail}
//                           </Typography> */}
//                         </ListItemSecondaryAction>
//                       </ListItem>
//                       <ListItem>
//                         <ListItemIcon>
//                           <PhoneOutlined />
//                         </ListItemIcon>
//                         {/* <ListItemSecondaryAction>
//                           <Typography align="right">
//                             <PatternFormat displayType="text" format="+91 #####-#####" mask="_" defaultValue={data.contact} />
//                           </Typography>
//                           <Typography align="right" variant="body2" color="textSecondary">
//                             Alternate Contact:
//                             <PatternFormat displayType="text" format="+91 #####-#####" mask="_" defaultValue={data.altercontact} />
//                           </Typography>
//                         </ListItemSecondaryAction> */}
//                       </ListItem>
//                       <ListItem>
//                         <ListItemIcon>
//                           <EnvironmentOutlined />
//                         </ListItemIcon>
//                         <ListItemSecondaryAction>
//                           <Typography align="right">{data.companyaddress}</Typography>
//                         </ListItemSecondaryAction>
//                       </ListItem>
//                     </List>
//                   </Grid>
//                 </Grid>
//               </MainCard>
//             </Grid>
//             <Grid item xs={12} sm={7} md={7}>
//               <Stack spacing={2.5}>
//                 <MainCard title="Account Details">
//                   <List sx={{ py: 0 }}>
//                     <ListItem divider={!matchDownMD}>
//                       <Grid container spacing={3}>
//                         <Grid item xs={12} md={6}>
//                           <Stack spacing={1} direction="row" alignItems="center">
//                             <Typography variant="body1">Company ID: </Typography>
//                             <Typography color="primary">{data.companyid}</Typography>
//                           </Stack>
//                         </Grid>
//                       </Grid>
//                     </ListItem>
//                     <ListItem divider={!matchDownMD}>
//                       <Grid container spacing={3}>
//                         <Grid item xs={12} md={6}></Grid>
//                       </Grid>
//                     </ListItem>
//                     <ListItem>
//                       <Stack spacing={0.5}>
//                         <Typography color="secondary">Billing Address</Typography>
//                         <Typography>{data.billingaddress}</Typography>

//                         <Typography color="secondary">Alternate Email</Typography>
//                         <Typography>{data.alteremail}</Typography>

//                         <Typography color="secondary">Alternate Contact</Typography>
//                         <Typography>{data.altercontact}</Typography>
//                       </Stack>
//                     </ListItem>
//                   </List>
//                 </MainCard>
//               </Stack>
//             </Grid>
//           </Grid>
//         </Transitions>
//       </TableCell>
//     </TableRow>
//   );
// };

// CompanyView.propTypes = {
//   data: PropTypes.object.isRequired
// };

// export default CompanyView;
