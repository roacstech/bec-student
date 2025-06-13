// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  DashboardOutlined,
  DollarOutlined,
  LoginOutlined,
  PhoneOutlined,
  RocketOutlined,
  FormOutlined,
  UserOutlined
} from '@ant-design/icons';

// icons
const icons = { DollarOutlined, LoginOutlined, PhoneOutlined, RocketOutlined, FormOutlined, UserOutlined, DashboardOutlined };

// ==============================|| MENU ITEMS - PAGES ||============================== //

const pages = {
  id: 'group-pages',
  title: <FormattedMessage id="pages" />,
  type: 'group',
  children: [
    {
      id: 'Dashboard',
      title: <FormattedMessage id="Dashboard" />,
      type: 'item',
      icon: icons.DashboardOutlined,
      url: '/student-dashboard'
    },
    {
      id: 'Enrollments',
      title: <FormattedMessage id="Enrollments" />,
      type: 'item',
      icon: icons.DashboardOutlined,
      url: '/student-enrollments'
    },
    {
      id: 'student-registration',
      title: <FormattedMessage id="Student Registration" />,
      type: 'item',
      icon: icons.UserOutlined,
      url: '/student-registration'
    }
  ]
};

export default pages;
