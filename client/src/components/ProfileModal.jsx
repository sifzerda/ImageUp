// Modal.js
import React from 'react';
 
const ProfileModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div className="modal-overl" onClick={onClose}>
      <div className="modal-cont" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={onClose}>&times;</span>
        <img src={imageUrl} alt="Full size" className="modal-img" title={imageUrl}  />
      </div>
    </div>
  );
};

export default ProfileModal;