import moment from 'moment';

const getCroppedImg = async (imageSrc, crop, zoom = 1) => {
  console.log("imageSrc", imageSrc);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.setAttribute('crossOrigin', 'anonymous');
      image.onload = () => resolve(image);
      image.onerror = (err) => reject(err);
      image.src = url;
    });

  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  const dateTime = moment().format('YYYY-MM-DD_HH-mm-ss'); // e.g., "2025-01-21_14-35-45"

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      // Create a file object with the timestamp in the filename
      const croppedFile = new File([blob], `cropped-image_${dateTime}.jpg`, { type: 'image/jpeg' });
      resolve(croppedFile);
    }, 'image/jpeg');
  });
};

export default getCroppedImg;
