import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Import QueryClient
import { RouterProvider } from 'react-router-dom';

// project import
import router from 'routes';
import ThemeCustomization from 'themes';
import Locales from 'components/Locales';
import ScrollTop from 'components/ScrollTop';
import Snackbar from 'components/@extended/Snackbar';
import Notistack from 'components/third-party/Notistack';
import { Toaster } from 'react-hot-toast';

// auth-provider
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';

// Create a QueryClient instance
const queryClient = new QueryClient();

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

const App = () => (
  <QueryClientProvider client={queryClient}>
    {' '}
    {/* Wrap the app with QueryClientProvider */}
    <Toaster position="top-center" reverseOrder={true} />
    <ThemeCustomization>
      <Locales>
        <ScrollTop>
          <AuthProvider>
            <Notistack>
              <RouterProvider router={router} />
              <Snackbar />
            </Notistack>
          </AuthProvider>
        </ScrollTop>
      </Locales>
    </ThemeCustomization>
  </QueryClientProvider>
);

export default App;
