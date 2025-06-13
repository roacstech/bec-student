import PropTypes from 'prop-types';
// material-ui
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import CountUp from 'react-countup';
// ===========================|| HOVER SOCIAL CARD ||=========================== //


const DashboardCard = ({ primary, secondary, iconPrimary, color, data, sx, prefix, suffix }) => {
  const IconPrimary = iconPrimary;
  const primaryIcon = iconPrimary ? <IconPrimary /> : null;
  return (
    <Card
      elevation={1}
      sx={{
        cursor: 'pointer',
        background: color,
        position: 'relative',
        color: '#fff',
        marginTop: '.5rem',
        '&:hover svg': {
          opacity: 1,
          transform: 'scale(1.1)'
        },
        ...sx
      }}
    >
      <CardContent>
        <Box
          sx={{
            position: 'absolute',
            right: 15,
            top: 25,
            color: '#fff',
            '& svg': {
              width: 36,
              height: 36,
              opacity: 0.5,
              transition: 'all .3s ease-in-out'
            }
          }}
        >
          {primaryIcon}
        </Box>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Typography variant="h3" color="inherit" sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
              <CountUp start={0} end={primary} duration={4} prefix={prefix ? prefix : ''} suffix={suffix ? suffix : ''} />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="inherit">
              {secondary}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
DashboardCard.propTypes = {
  primary: PropTypes.string,
  secondary: PropTypes.string,
  iconPrimary: PropTypes.object,
  color: PropTypes.string
};
export default DashboardCard;