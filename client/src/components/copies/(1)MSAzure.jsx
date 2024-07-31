// shows one image at a time, i.e. each new one replaces the previous

import React, { useState } from 'react';
import { BlobServiceClient } from '@azure/storage-blob';

const containerName = 'imageupcontainer99';
const sasToken = 'sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2027-08-01T00:37:27Z&st=2024-07-31T16:37:27Z&spr=https&sig=0XLu4HxQ2B9ViuV8T6%2Banh5SogTLmak81IqjMivOG6I%3D'; // Replace with your SAS token
const accountName = 'imageupstorageaccount99'; 
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net?${sasToken}`
);

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
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
      setUploadedUrl(blobUrl); // Set the URL of the uploaded image
      console.log('Upload complete:', uploadBlobResponse);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {uploadedUrl && (
        <div>
          <p>File URL:</p>
          <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
            {uploadedUrl}
          </a>
          <p>Uploaded Image:</p>
          <img src={uploadedUrl} alt="Uploaded" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      )}
    </div>
  );
};

export default FileUpload;