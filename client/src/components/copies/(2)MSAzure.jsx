// shows images in array (sequential uploads)

import React, { useState } from 'react';
import { BlobServiceClient } from '@azure/storage-blob';

// add MS Azure container connection string info here //

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]); // Array to hold all uploaded image URLs

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

      // Update the list of uploaded URLs
      setUploadedUrls((prevUrls) => [...prevUrls, blobUrl]);

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