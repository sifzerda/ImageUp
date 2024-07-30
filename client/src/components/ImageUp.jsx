// src/components/ImageUploader.js
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const ImageUploader = () => {
  const [image, setImage] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [] // This accepts all image file types
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const reader = new FileReader();

        reader.onloadend = () => {
          setImage(reader.result);
        };

        reader.readAsDataURL(file);
      }
    },
    onDropRejected: (fileRejections) => {
      fileRejections.forEach(({ file, errors }) => {
        console.log(`File ${file.name} rejected due to ${errors.map(e => e.message).join(', ')}`);
      });
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