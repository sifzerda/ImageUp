import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ImageUploader = () => {
  const [images, setImages] = useState([]);

  const formik = useFormik({
    initialValues: {
      images: []
    },
    validationSchema: Yup.object({
      images: Yup.array().of(
        Yup.mixed().test(
          'fileType',
          'Unsupported File Format',
          (value) => value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type)
        )
      )
    }),
    onSubmit: (values) => {
      console.log('Uploaded Images:', values.images);
    }
  });

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const newImages = [];
        acceptedFiles.forEach((file) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            newImages.push(reader.result);
            if (newImages.length === acceptedFiles.length) {
              setImages((prevImages) => [...prevImages, ...newImages]);
              formik.setFieldValue('images', [...formik.values.images, ...acceptedFiles]);
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
    }
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
            formik.setFieldValue('images', [...formik.values.images, ...files]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag & drop images here, or click to select images</p>
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
      {formik.errors.images && formik.touched.images ? (
        <div>{formik.errors.images}</div>
      ) : null}
      <button type="submit">Submit</button>
    </form>
  );
};

export default ImageUploader;