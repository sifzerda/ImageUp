// working image uploading and hosting, and modal without Formik and Yup

import React, { useState, useCallback } from 'react';
import { BlobServiceClient } from '@azure/storage-blob';
import { useDropzone } from 'react-dropzone';
import { useMutation } from '@apollo/client';
import { UPDATE_USER } from '../utils/mutations';
import Auth from '../utils/auth';
import ImageModal from './ImageModal'; // Import the ImageModal component

// add MS Azure container connection string info here //

const FileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(''); // Track only the most recent uploaded image URL
  const [updateUser, { loading: saving, error }] = useMutation(UPDATE_USER);
  const [successMessage, setSuccessMessage] = useState('');
  const [saveButtonVisible, setSaveButtonVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to handle file upload
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
      const uploadBlobResponse = await blobClient.uploadBrowserData(file);
      const blobUrl = blobClient.url;
      setSuccessMessage('');
      setUploadedUrl(blobUrl);
      setSaveButtonVisible(true);
      console.log('Upload complete:', uploadBlobResponse);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  // Function to handle file drop
  const handleDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    handleUpload(acceptedFiles[0]);
  }, [handleUpload]);

  const handleSave = useCallback(async () => {
    try {
      const { data } = await updateUser({
        variables: { imageUrls: [uploadedUrl] }
      });
      if (data) {
        setSuccessMessage('Image has been successfully saved to your Profile page!');
        setSaveButtonVisible(false);
      }
    } catch (error) {
      console.error('Failed to save images:', error);
    }
  }, [uploadedUrl, updateUser]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: 'image/*',
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  return (
    <div className="upload-container">
      <div className="upload-header">Image Upload</div>

      <div className='upload-box' {...getRootProps()}>
        <input {...getInputProps()} />
        <p className='black-text'>Drag and drop an image here, or click to select one</p>
      </div>
      <div>
        <input className='input-submit-button' type="file" onChange={(e) => handleUpload(e.target.files[0])} />
        <button className='upload-button' onClick={() => handleUpload(file)} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      <div className="uploaded-images">
        {uploadedUrl && (
          <div>
            <h3>Uploaded Image:</h3>
            <p className='black-text'>File URL:</p>
            <a className='upload-url' href={uploadedUrl} target="_blank" rel="noopener noreferrer">
              {uploadedUrl}
            </a>
            <p>Uploaded Image:</p>
            <img
              src={uploadedUrl}
              alt={`Uploaded`}
              style={{ width: '200px', height: 'auto', cursor: 'pointer' }}
              onClick={openModal} // Open modal on click
            />
          </div>
        )}

        {Auth.loggedIn() ? (
          saveButtonVisible && (
            <button className='upload-button' onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          )
        ) : (
          <p className='black-text-2'>
            You must <a href="/login">LOG IN</a> or <a href="/signup">SIGN UP</a> to save an image to your profile page.
          </p>
        )}

        {successMessage && <p className='success-message'>{successMessage}</p>}
      </div>
      {/* Render the ImageModal component if modal is open */}
      <ImageModal imageUrl={uploadedUrl} onClose={closeModal} isOpen={isModalOpen} />
    </div>
  );
};

export default FileUpload;