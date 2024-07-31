import React, { useState } from 'react';
import { BlobServiceClient } from '@azure/storage-blob';
import { useDropzone } from 'react-dropzone';

const containerName = 'imageupcontainer99';
const sasToken = 'sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2027-08-01T00:37:27Z&st=2024-07-31T16:37:27Z&spr=https&sig=0XLu4HxQ2B9ViuV8T6%2Banh5SogTLmak81IqjMivOG6I%3D'; // Replace with your SAS token
const accountName = 'imageupstorageaccount99'; 
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net?${sasToken}`
);

const FileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]); // Array to hold all uploaded image URLs

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
    handleUpload(acceptedFiles[0]); // Handle the first file dropped
  };

  // Use dropzone to handle file drop
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: 'image/*',
  });

  return (
    <div>
      <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', cursor: 'pointer' }}>
        <input {...getInputProps()} />
        <p>Drag and drop an image here, or click to select one</p>
      </div>
      <div>
        <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
        <button onClick={() => handleUpload(file)} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      <div>
        {uploadedUrls.length > 0 && (
          <div>
            <h3>Uploaded Images:</h3>
            {uploadedUrls.map((url, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <p>File URL:</p>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url}
                </a>
                <p>Uploaded Image:</p>
                <img src={url} alt={`Uploaded ${index}`} style={{ maxWidth: '100%', height: 'auto' }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;