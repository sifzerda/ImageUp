
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

const ImageUpload = () => {
  const formik = useFormik({
    initialValues: {
      image: null,
    },
    validationSchema: Yup.object({
      image: Yup.mixed().required('An image is required')
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const formData = new FormData();
      formData.append('image', values.image);

      try {
        const response = await axios.post('http://localhost:3001/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert(`Image uploaded successfully: ${response.data.imageUrl}`);
        resetForm();
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image');
      }
      setSubmitting(false);
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      formik.setFieldValue('image', acceptedFiles[0]);
    }
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        {formik.values.image ? (
          <p>{formik.values.image.name}</p>
        ) : (
          <p>Drag 'n' drop an image here, or click to select one</p>
        )}
      </div>
      {formik.errors.image ? <div>{formik.errors.image}</div> : null}
      <button type="submit" disabled={formik.isSubmitting}>
        Upload
      </button>
    </form>
  );
};

export default ImageUpload;