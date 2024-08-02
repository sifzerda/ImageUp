import React, { useState } from 'react';
import { BlobServiceClient } from '@azure/storage-blob';
import { useDropzone } from 'react-dropzone';
import { useMutation } from '@apollo/client';
import { UPDATE_USER } from '../utils/mutations';

const containerName = 'imageupcontainer99';
const sasToken = 'sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2027-08-01T00:37:27Z&st=2024-07-31T16:37:27Z&spr=https&sig=0XLu4HxQ2B9ViuV8T6%2Banh5SogTLmak81IqjMivOG6I%3D'; // Replace with your SAS token
const accountName = 'imageupstorageaccount99';
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net?${sasToken}`
);

const FileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]); // Array to hold all uploaded image URLs
  const [updateUser, { loading: saving, error }] = useMutation(UPDATE_USER);

  // Function to handle file upload
  const handleUpload = async (file) => {
    setUploading(true);

    try {
      const containerClient = blobServiceClient.getContainerClient(containerName);

      // Check if the container exists (optional, for debugging)
      const containerExists = await containerClient.exists();
      if (!containerExists) {
        console.log('Container does not exist.');
        return;
      }

      const blobClient = containerClient.getBlockBlobClient(file.name);
      const uploadBlobResponse = await blobClient.uploadBrowserData(file);
      const blobUrl = blobClient.url;

      // Log the uploaded URL
      console.log('Blob URL:', blobUrl);

      // Update the list of uploaded URLs
      setUploadedUrls((prevUrls) => [...prevUrls, blobUrl]);

      console.log('Upload complete:', uploadBlobResponse);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  // Function to handle file drop
  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    console.log('Files dropped:', acceptedFiles);
    handleUpload(acceptedFiles[0]); // Handle the first file dropped
  };

  // Function to save uploaded URLs to the user's profile
  const handleSave = async () => {
    try {
      console.log('Saving image URLs:', uploadedUrls); // Log the URLs being saved
      const { data } = await updateUser({
        variables: { imageUrls: uploadedUrls }
      });
      if (data) {
        console.log('User images updated successfully:', data.updateUser);
      }
    } catch (error) {
      console.error('Failed to save images:', error);
    }
  };

  // Use dropzone to handle file drop
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: 'image/*',
  });

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
        {uploadedUrls.length > 0 && (
          <div>
            <h3>Uploaded Images:</h3>
            {uploadedUrls.map((url, index) => (
              <div key={index}>
                <p>File URL:</p>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url}
                </a>
                <p>Uploaded Image:</p>
                <img src={url} alt={`Uploaded ${index}`} style={{ width: '200px', height: 'auto' }} />
              </div>
            ))}

            <button className='save-button' onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;