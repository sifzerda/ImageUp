import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const ImageUploader = () => {
  const [images, setImages] = useState([]);

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: 'image/*', // This accepts all image file types
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const newImages = [];
        acceptedFiles.forEach((file) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            newImages.push(reader.result);
            if (newImages.length === acceptedFiles.length) {
              setImages((prevImages) => [...prevImages, ...newImages]);
            }
          };
          reader.readAsDataURL(file);
        });
      }
    },
    onDropRejected: (fileRejections) => {
      fileRejections.forEach(({ file, errors }) => {
        console.log(`File ${file.name} rejected due to ${errors.map(e => e.message).join(', ')}`);
      });
    },
    noClick: true, // Disable the click behavior of the dropzone
  });

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const newImages = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result);
          if (newImages.length === files.length) {
            setImages((prevImages) => [...prevImages, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <div>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag & drop images here</p>
      </div>
      <button type="button" onClick={open}>
        Select Images
      </button>
      <input
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {images.length > 0 && images.map((image, index) => (
        <img key={index} src={image} alt={`Uploaded ${index}`} style={{ maxWidth: '100%', margin: '10px 0' }} />
      ))}
    </div>
  );
};

export default ImageUploader;