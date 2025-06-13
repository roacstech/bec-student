import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import toast from 'react-hot-toast';

// Ensure environment variables are correctly accessed
const S3_BUCKET = import.meta.env.VITE_APP_AWS_BUCKET_NAME;
const REGION = import.meta.env.VITE_APP_AWS_REGION;
const ACCESS_KEY = import.meta.env.VITE_APP_AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = import.meta.env.VITE_APP_AWS_SECRET_ACCESS_KEY;

// eslint-disable-next-line react/prop-types
const UploadImage = async ({ srcData, folderName }) => {
  if (!S3_BUCKET || !REGION || !ACCESS_KEY || !SECRET_ACCESS_KEY) {
    toast.error('Missing required environment variables.');
    console.error('Missing environment variables.');
    return null;
  }

  const s3Client = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_ACCESS_KEY
    },
    endpoint: `https://${REGION}.digitaloceanspaces.com`
  });

  const handleUpload = async () => {
    if (srcData) {
      const params = {
        Bucket: S3_BUCKET,
        Key: `${folderName}/${srcData.name}`,
        Body: srcData,
        ACL: 'public-read',
        ContentType: srcData.type
      };

      try {
        const command = new PutObjectCommand(params);
        await s3Client.send(command);
        return `https://${S3_BUCKET}.${REGION}.digitaloceanspaces.com/${params.Key}`;
      } catch (err) {
        toast.error('Error uploading image');
        console.error('Error uploading image:', err);
        throw err;
      }
    } else {
      toast.error('No file selected for upload.');
      console.error('No file selected for upload.');
      throw new Error('No file selected for upload.');
    }
  };

  try {
    const imageUrl = await handleUpload();
    return imageUrl;
  } catch (error) {
    console.error('Error in handleUpload:', error);
    throw error;
  }
};

export default UploadImage;
