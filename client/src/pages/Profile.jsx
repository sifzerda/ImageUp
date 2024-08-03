import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import '../App.css';
import '../minesweeper.css';
import '../image.css';
import ImageModal from '../components/ImageModal'; // Import the ImageModal component

const Profile = () => {
  const { data: userData, loading: userLoading, error: userError } = useQuery(QUERY_ME);
  const [selectedImage, setSelectedImage] = useState(null); // State for selected image
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  console.log('Is modal open:', isModalOpen);
  
  // Log the loading state
  console.log('Loading user data:', userLoading);

  // Log the error, if any
  if (userError) {
    console.error('Error fetching user:', userError.message);
  }

  // Log the fetched data
  console.log('Fetched user data:', userData);

  if (userLoading) return <p>Loading user...</p>;
  if (userError) return <p>Error fetching user: {userError.message}</p>;

  const user = userData.me;

  // Log the user's image URLs
  console.log('User image URLs:', user.imageUrls);

  // Function to open modal with selected image
  const openModal = (url) => {
    console.log('Opening modal with URL:', url); // Log the URL being passed
    setSelectedImage(url);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    console.log('Closing modal'); // Log when the modal is closed
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1>Your Uploaded Images</h1>
      {user.imageUrls && user.imageUrls.length === 0 ? (
        <p>You have not uploaded any images yet.</p>
      ) : (
        <div>
          {user.imageUrls && user.imageUrls.length > 0 ? (
            user.imageUrls.map((url, index) => (
              <div key={index} style={{ display: 'inline-block', margin: '10px' }}>
            {/*     <a href={url} target="_blank" rel="noopener noreferrer">  */}
                  <img
                    src={url}
                    alt={`Uploaded ${index}`}
                    style={{ width: '200px', height: 'auto', cursor: 'pointer' }}
                    title={url} // Tooltip showing the URL
                    onClick={() => openModal(url)} // Open modal on image click
                  />
                {/*  </a> */}
                <p>Image {index + 1}</p>
              </div>
            ))
          ) : (
            <p>No images found.</p>
          )}
        </div>
      )}

 {/* Render the ImageModal component if modal is open */}
 {isModalOpen && (
        <ImageModal imageUrl={selectedImage} onClose={closeModal} />
      )}

    </div>
  );
};

export default Profile;