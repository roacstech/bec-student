import { lazy } from 'react';
import Loadable from 'components/Loadable';
import ViewCompany from 'pages/settingss/company/ViewCompany';
import ComplaintType from 'pages/complainttype/ComplaintType';
import Admin from 'pages/settingss/admin/Admin';
import AdminView from 'components/admin/AdminView';
import RolesAndPermission from 'pages/settingss/rolesandpermissions/RolesAndPermissions';
import routeAccess from 'hasAccess/routeAccess';
import { getRolePermission } from 'services/modules/getRolePermission';
import EditProfile from 'layout/Dashboard/Header/HeaderContent/Profile/EditProfile';
import ViewProfile from 'layout/Dashboard/Header/HeaderContent/Profile/ViewProfile';
import CheckLists from 'pages/checklists/CheckLists';
import ChecklistDetail from 'pages/checklists/ChecklistDetail';
import Enrollments from 'pages/enrollments/Enrollments';
// project import
const DashboardLayout = Loadable(lazy(() => import('layout/Dashboard')));
const PagesLayout = Loadable(lazy(() => import('layout/Pages')));
const SimpleLayout = Loadable(lazy(() => import('layout/Simple')));
const SimpleLayoutType = Loadable(lazy(() => import('config')));

const Dashboard = Loadable(lazy(() => import('pages/dashboard/Dashboard')));
const Company = Loadable(lazy(() => import('pages/settingss/company/Company')));

const DocumentTab = Loadable(lazy(() => import('pages/settingss/document/DocumentTab')));

const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon')));

const ReportTab = Loadable(lazy(() => import('pages/features/reports/ReportTab')));

const AppContactUS = Loadable(lazy(() => import('pages/contact-us')));
const RegistrationForm = Loadable(lazy(() => import('pages/auth/registration')));

// render - sample page
// const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const roleId = localStorage.getItem('roleid');

// Fetch role permissions
// const data = await getRolePermission({
//   roleid: roleId
// });

// console.log('Main Routes:', data);

// const rolePermissions = data?.[0]?.webpermissions || [];

// console.log(rolePermissions, 'rolePermissions');??

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'dashboard',
          element: (
            // routeAccess({
            //   moduleid: 1,
            //   rolePermissions: rolePermissions
            // })?.hasAccess ? (
            <Dashboard />
          )
          // ) : (
          //   <MaintenanceError />
          // )
        },
        {
          path: 'profile/view',
          element: <ViewProfile />
        },
        // {
        //   path: 'profile/editprofile',
        //   element:
        //   // routeAccess({
        //   //   moduleid: 1,
        //   //   rolePermissions: rolePermissions
        //   // })?.hasAccess ? (
        //     <EditProfile />
        //   // ) : (
        //   //   <MaintenanceError />
        //   // )
        // },
        {
          path: 'reports',
          element: (
            // routeAccess({
            //   moduleid: 10,
            //   rolePermissions: rolePermissions
            // })?.hasAccess ? (
            <ReportTab />
          )
          // ) : (
          //   <MaintenanceError />
          // )
        },
        {
          path: 'settings',
          children: [
            {
              path: 'admin',
              element: (
                // routeAccess({
                //   moduleid: 12,
                //   submoduleid: 3,
                //   rolePermissions: rolePermissions
                // })?.hasAccess ? (
                <Admin />
              )
              // ) : (
              //   <MaintenanceError />
              // )
            },
            {
              path: 'rolesandpermissions',
              element: (
                // routeAccess({
                //   moduleid: 12,
                //   submoduleid: 4,
                //   rolePermissions: rolePermissions
                // })?.hasAccess ? (
                <RolesAndPermission />
              )
              // ) : (
              //   <MaintenanceError />
              // )
            },
            {
              path: 'admin-details',
              element: (
                // routeAccess({
                //   moduleid: 12,
                //   submoduleid: 3,
                //   rolePermissions: rolePermissions
                // })?.hasAccess ? (
                <AdminView />
              )
              // ) : (
              //   <MaintenanceError />
              // )
            },
            {
              path: 'complainttype',
              element: (
                // routeAccess({
                //   moduleid: 12,
                //   submoduleid: 6,
                //   rolePermissions: rolePermissions
                // })?.hasAccess ? (
                <ComplaintType />
              )
              // ) : (
              //   <MaintenanceError />
              // )
            },
            {
              path: 'company',
              element: (
                // routeAccess({
                //   moduleid: 12,
                //   submoduleid: 7,
                //   rolePermissions: rolePermissions
                // })?.hasAccess ? (
                <Company />
              )
              // ) : (
              //   <MaintenanceError />
              // )
            },
            {
              path: 'companydetails',
              element: (
                // routeAccess({
                //   moduleid: 12,
                //   submoduleid: 7,
                //   rolePermissions: rolePermissions
                // })?.hasAccess ? (
                <ViewCompany />
              )
              // ) : (
              //   <MaintenanceError />
              // )
            },
            // {
            //   path: 'priority',
            //   element: <PriorityTable />
            // },
            // {
            //   path: 'roles',
            //   element: <RoleTable />
            // },
            {
              path: 'documents',
              element: (
                // routeAccess({
                //   moduleid: 12,
                //   submoduleid: 8,
                //   rolePermissions: rolePermissions
                // })?.hasAccess ? (
                <DocumentTab />
              )
              // ) : (
              //   <MaintenanceError />
              // )
            }
          ]
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'contact-us',
          element: <AppContactUS />
        },
        {
          path: 'student-registration',
          element: <RegistrationForm />
        },
        {
          path: 'student-dashboard',
          element: <CheckLists />
        },
        {
          path: 'student-enrollments',
          element: <Enrollments />
        },
        {
          path: 'student-enrollments/:id',
          element: <CheckLists />
        },
        {
          path: '/checklist/:checklistdataid',
          element: <ChecklistDetail />
        }
      ]
    },
    {
      path: '/maintenance',
      element: <PagesLayout />,
      children: [
        {
          path: '404',
          element: <MaintenanceError />
        },
        {
          path: '500',
          element: <MaintenanceError500 />
        },
        {
          path: 'under-construction',
          element: <MaintenanceUnderConstruction />
        },
        {
          path: 'coming-soon',
          element: <MaintenanceComingSoon />
        }
      ]
    }
  ]
};

export default MainRoutes;
