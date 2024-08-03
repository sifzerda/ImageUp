import React from 'react';
import ReactDOM from 'react-dom';
 

const ImageModal = ({ imageUrl, onClose, isOpen }) => {
  if (!isOpen) return null; // Only render if the modal is open

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <img src={imageUrl} alt="Full Size" className="modal-image" />
      </div>
    </div>,
    document.body
  );
};

export default ImageModal;