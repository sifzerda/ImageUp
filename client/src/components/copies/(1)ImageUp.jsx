// Image uploader working
// drag and drop images only, no button click
// no 'MIME type' console terminal errors

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  });

  return (
    <div {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />
      {image ? (
        <img src={image} alt="Uploaded" style={{ maxWidth: '100%' }} />
      ) : (
        <p>Drag & drop an image here, or click to select one</p>
      )}
    </div>
  );
};

export default ImageUploader;