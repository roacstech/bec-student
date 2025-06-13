import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ButtonBase from '@mui/material/ButtonBase';

// project import
// import Logo from './LogoMain';
import Logo from '../../assets/images/bec-logo.png';
// import LogoIcon from './LogoIcon';
import { APP_DEFAULT_PATH } from 'config';
import useAuth from 'hooks/useAuth';

export default function LogoSection({ reverse, isIcon, sx, to }) {
  const { isLoggedIn } = useAuth();

  return (
    <ButtonBase disableRipple {...(isLoggedIn && { component: Link, to: !to ? APP_DEFAULT_PATH : to, sx })}>
      {isIcon ? <img src={Logo} alt="Logo" style={{ height: 80, paddingTop:'25px' }} /> :  <img src={Logo} alt="Logo" style={{ height: 130, paddingTop:'25px' }} />}
    </ButtonBase>
  );
}

LogoSection.propTypes = { reverse: PropTypes.bool, isIcon: PropTypes.bool, sx: PropTypes.any, to: PropTypes.any };
