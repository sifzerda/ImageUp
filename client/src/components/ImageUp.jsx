import React, { useState, useCallback } from 'react';
import { BlobServiceClient } from '@azure/storage-blob';
import { useDropzone } from 'react-dropzone';
import { useMutation } from '@apollo/client';
import { UPDATE_USER } from '../utils/mutations';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Auth from '../utils/auth';
import ImageModal from './ImageModal';
import spinner from '../assets/spinner.gif';
import fireworks from '../assets/fireworks.gif';

// Define validation schema with Yup
const validationSchema = Yup.object({
  file: Yup.mixed().required('A file is required'),
});

// Microsoft Azure Blob Storage connection string

const containerName = import.meta.env.VITE_CONTAINER_NAME;
const sasToken = import.meta.env.VITE_SAS_TOKEN; 
const accountName = import.meta.env.VITE_ACCOUNT_NAME;
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net?${sasToken}`
);

const FileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [updateUser, { loading: saving }] = useMutation(UPDATE_USER);
  const [successMessage, setSuccessMessage] = useState('');
  const [saveButtonVisible, setSaveButtonVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to handle file upload ------------------------------------//
  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const containerClient = blobServiceClient.getContainerClient(containerName);
      const containerExists = await containerClient.exists();
      if (!containerExists) {
        console.log('Container does not exist.');
        return;
      }
      const blobClient = containerClient.getBlockBlobClient(file.name);
      await blobClient.uploadBrowserData(file);
      setUploadedUrl(blobClient.url);
      setSaveButtonVisible(true);
      setSuccessMessage('');
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  // Function to handle file drop --------------------------------------//
  const handleDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      handleUpload(acceptedFiles[0]);
    }
  }, []);

  const handleSave = useCallback(async () => {
    try {
      const { data } = await updateUser({
        variables: { imageUrls: [uploadedUrl] },
      });
      if (data) {
        setSuccessMessage('Image has been successfully saved to your Profile page!');
        setSaveButtonVisible(false);
      }
    } catch (error) {
      console.error('Failed to save images:', error);
    }
  }, [uploadedUrl, updateUser]);

    // Function to save image URL to local storage ------------------------//
    const handleSaveToLocal = () => {
      try {
        const savedImages = JSON.parse(localStorage.getItem('savedImages')) || [];
        savedImages.push(uploadedUrl);
        localStorage.setItem('savedImages', JSON.stringify(savedImages));
        setSuccessMessage('Image URL saved to local storage!');
      } catch (error) {
        console.error('Failed to save image URL to local storage:', error);
      }
    };

    // react-dropzone hook to handle file drop ----------------------------//
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: 'image/*',
  });

  // Functions to open and close the modal -------------------------------//
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Render --------------------------------------------------------------//
  return (
    <Formik
    initialValues={{ file: null }}
    validationSchema={validationSchema}
    onSubmit={(values, { setSubmitting }) => {
      if (values.file) {
        handleUpload(values.file);
      }
      setSubmitting(false);
    }}
  >
    {({ setFieldValue, isSubmitting, errors, touched }) => (
      <Form>

    <div className="upload-container">
      <div className="upload-header">Image Upload</div>
      <div className='upload-box' {...getRootProps()}>
        <input {...getInputProps()} />
        <p className='black-text'>Drag and drop an image here, or click to select one</p>
      </div>

      <div className='center-content'>
        <input className='input-submit-button' type="file" onChange={(e) => handleUpload(e.target.files[0])} />
        <button className='upload-button' onClick={() => handleUpload(file)} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      {uploading && (
              <div className="center-content">
                <img src={spinner} alt="Loading..." className="spinner" />
              </div>
            )}

      <div className="uploaded-images">
        {uploadedUrl && (
          <div className="center-content">

<div className="fireworks-container">
                <img src={fireworks} alt="Done!" className="fireworks" />
                <p className='black-text'>Image uploaded successfully!</p>
                <img src={fireworks} alt="Done!" className="fireworks" />
              </div>

           
            <h5>Uploaded Image:</h5>

{/*      optional: display hosted image url, but this causes flex issues

            <p className='black-text'>File URL:</p>
            <a className='upload-url' href={uploadedUrl} target="_blank" rel="noopener noreferrer">
              {uploadedUrl}
            </a>
*/}
            <img className='black-border'
              src={uploadedUrl}
              alt={`Uploaded`}
              style={{ width: '200px', height: 'auto', cursor: 'pointer' }}
              title= {uploadedUrl}
              onClick={openModal} // Open modal on click
            />
          </div>
        )}

        {Auth.loggedIn() ? (
          saveButtonVisible && (
            <button className='upload-button' onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Image'}
            </button>
          )
        ) : (
          <>
          <p className="black-text-2">
            You must <a href="/login">LOG IN</a> or <a href="/signup">SIGN UP</a> to save an image to your
            profile page.
          </p>
          {saveButtonVisible && (
            <button className="upload-button" onClick={handleSaveToLocal}>
              Save Image to Local Storage
            </button>
          )}
        </>
      )}

        {successMessage && <p className='success-message'>{successMessage}</p>}
      </div>
      {/* Render the ImageModal component if modal is open */}
      <ImageModal imageUrl={uploadedUrl} onClose={closeModal} isOpen={isModalOpen} />
    </div>
    </Form>
    )}
    </Formik>
  );
};

export default FileUpload;
