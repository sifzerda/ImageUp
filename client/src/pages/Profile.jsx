import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import '../App.css';
import '../minesweeper.css';
import '../image.css';
import ProfileModal from '../components/ProfileModal';

const Profile = () => {
  const { data: userData, loading: userLoading, error: userError } = useQuery(QUERY_ME);
  const [selectedImage, setSelectedImage] = useState(null); // State for selected image

  // Log the error, if any
  if (userError) {
    console.error('Error fetching user:', userError.message);
  }
  if (userLoading) return <p>Loading user...</p>;
  if (userError) return <p>Error fetching user: {userError.message}</p>;

  const user = userData.me;

  return (
    <div className="gallery-container">
      <h1>Your Uploaded Images</h1>
      {user.imageUrls && user.imageUrls.length === 0 ? (
        <p className="no-images-message">You have not uploaded any images yet.</p>
      ) : (
        <div className="gallery-grid">
          {user.imageUrls && user.imageUrls.length > 0 ? (
            user.imageUrls.map((url, index) => (
              <div key={index} className="gallery-item">
                <img
                  src={url}
                  alt={`Uploaded ${index}`}
                  className="gallery-image"
                  title={url} // Tooltip showing the URL
                  onClick={() => setSelectedImage(url)} // Set selected image on click
                />
                <p className="image-description">Image {index + 1}</p>
              </div>
            ))
          ) : (
            <p className="no-images-message">No images found.</p>
          )}
        </div>
      )}

      {/* Render the modal if an image is selected */}
      <ProfileModal
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)} // Clear selected image on close
      />
    </div>
  );
};

export default Profile;