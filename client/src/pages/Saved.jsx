import React, { useState, useEffect } from 'react';
import ProfileModal from '../components/ProfileModal';

const Saved = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // State for selected image
 
  // Retrieve images from local storage when the component mounts
  useEffect(() => {
    const savedImages = JSON.parse(localStorage.getItem('savedImages')) || [];
    setImages(savedImages);
  }, []);

  return (
    <div className="gallery-container">
      <h2>My Saved Images</h2>
      <p className='black-text'>Note: Saved images will be lost if you delete your browser data. If you don't want to lose your images, you should make an account and save uploaded images to your profile page.</p>
      <div className="gallery-grid">
        {images.length > 0 ? (
          images.map((imageUrl, index) => (
            <div key={index} className="gallery-item">
              <img
                src={imageUrl}
                alt={`Saved Image ${index + 1}`}
                className="gallery-image"
                title={imageUrl} // Tooltip showing the URL
                onClick={() => setSelectedImage(imageUrl)} // Set selected image on click
              />
            </div>
          ))
        ) : (
          <p className="black-text">No images saved in local storage.</p>
        )}
      </div>

      {/* Render the modal if an image is selected */}
      <ProfileModal
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)} // Clear selected image on close
      />

    </div>
  );
};

export default Saved;