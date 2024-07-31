import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { storage, ref, uploadBytes, getDownloadURL } from '../../firebase.js';

// Define the uploadFile function within the same file
const uploadFile = async (file) => {
  try {
    const storageRef = ref(storage, `images/${Date.now()}-${file.name}`);
    console.log(`Uploading file to ${storageRef}`);
    const snapshot = await uploadBytes(storageRef, file);
    console.log(`Upload successful for ${file.name}. Snapshot:`, snapshot);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log(`Download URL for ${file.name}: ${downloadURL}`);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

const ImageUploader = () => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

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
    onSubmit: async (values) => {
      setUploading(true);
      console.log('Submitting images:', values.images);
      try {
        const uploadPromises = values.images.map(async (file) => {
          console.log(`Uploading file: ${file.name}`);
          const downloadURL = await uploadFile(file); // Use the uploadFile function
          console.log(`Download URL for ${file.name}: ${downloadURL}`);
          return downloadURL;
        });
        const urls = await Promise.all(uploadPromises);
        console.log('All files uploaded successfully. URLs:', urls);
        setImages(urls);
        formik.setFieldValue('images', urls);
      } catch (error) {
        console.error('Failed to upload images', error);
      } finally {
        setUploading(false);
      }
    }
  });

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      console.log('Files dropped:', acceptedFiles);
      formik.setFieldValue('images', acceptedFiles);
    },
    onDropRejected: (fileRejections) => {
      fileRejections.forEach(({ file, errors }) => {
        console.log(`File ${file.name} rejected due to ${errors.map(e => e.message).join(', ')}`);
      });
    }
  });

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    console.log('Files selected:', files);
    if (files.length > 0) {
      formik.setFieldValue('images', files);
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
        <img
          key={index}
          src={typeof image === 'string' ? image : URL.createObjectURL(image)}
          alt={`Uploaded ${index}`}
          style={{ maxWidth: '100%', margin: '10px 0' }}
          onLoad={() => URL.revokeObjectURL(image)} // Clean up URL object after use
        />
      ))}
      {formik.errors.images && formik.touched.images ? (
        <div>{formik.errors.images}</div>
      ) : null}
      <button type="submit" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Submit'}
      </button>
    </form>
  );
};

export default ImageUploader;

// Firebase Config:
// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, ref, uploadBytes, getDownloadURL };


// .env
REACT_APP_FIREBASE_API_KEY=AIzaSyDFJFULsDl8rzimoQWRBX9YZKhLqnshgYI
REACT_APP_FIREBASE_AUTH_DOMAIN=imageup-e20ca.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=imageup-e20ca
REACT_APP_FIREBASE_STORAGE_BUCKET=imageup-e20ca.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=1021145759464
REACT_APP_FIREBASE_APP_ID=1:1021145759464:web:47545c490bb415985dd35d


// firebase utils

// src/utils/firebaseUtils.js
import { storage, ref, uploadBytes, getDownloadURL } from '../firebase';

export const uploadFile = async (file) => {
  try {
    const storageRef = ref(storage, `images/${Date.now()}-${file.name}`);
    console.log(`Uploading file to ${storageRef}`);
    const snapshot = await uploadBytes(storageRef, file);
    console.log(`Upload successful for ${file.name}. Snapshot:`, snapshot);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log(`Download URL for ${file.name}: ${downloadURL}`);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};