import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import '../App.css';
import '../minesweeper.css';
import '../image.css';

const Profile = () => {
    const { data: userData, loading: userLoading, error: userError } = useQuery(QUERY_ME);

    if (userLoading) return <p>Loading user...</p>;
    if (userError) return <p>Error fetching user: {userError.message}</p>;
  
    const userId = userData.me._id;
  
    // Query to get images for the current user
    const { data: imagesData, loading: imagesLoading, error: imagesError } = useQuery(QUERY_IMAGES, {
      variables: { userId },
    });
  
    if (imagesLoading) return <p>Loading images...</p>;
    if (imagesError) return <p>Error fetching images: {imagesError.message}</p>;
  
    return (
      <div>
        <h1>Your Uploaded Images</h1>
        {imagesData.images.length === 0 ? (
          <p>You have not uploaded any images yet.</p>
        ) : (
          <div>
            {imagesData.images.map((image) => (
              <div key={image._id}>
                <img src={image.path} alt={image.filename} style={{ width: '200px', height: 'auto' }} />
                <p>{image.filename}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

export default Profile;