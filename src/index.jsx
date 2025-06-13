import { createRoot } from 'react-dom/client';

// Styles and fonts (keep your existing imports)
import 'simplebar-react/dist/simplebar.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Font imports (keep your existing font imports)

// AWS SDK Configuration
import { S3Client } from '@aws-sdk/client-s3';

try {
  if (import.meta.env.VITE_AWS_REGION) {
    // Create and export the S3 client
    const s3Client = new S3Client({
      region: import.meta.env.VITE_AWS_REGION,
      credentials: {
        accessKeyId: import.meta.env.VITE_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_APP_AWS_SECRET_ACCESS_KEY
      }
    });

    // Make the client available globally if needed
    window.s3Client = s3Client;
  }
} catch (awsError) {
  console.error('AWS SDK initialization failed', awsError);
}

// App imports
import App from './App';
import { ConfigProvider } from 'contexts/ConfigContext';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ConfigProvider>
    <App />
  </ConfigProvider>
);

reportWebVitals();
