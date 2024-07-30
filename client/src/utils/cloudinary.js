export const uploadFile = async (file) => {
    console.log('Uploading file:', file); // Debugging line
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
  
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error.message || 'Failed to upload image');
      }
      console.log('Upload response data:', data); // Debugging line
      return data.secure_url;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  };