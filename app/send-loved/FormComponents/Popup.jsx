import React from 'react';

export default function Popup({ message, onClose }) {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Sorry</h2>
        <p>{message}</p>
        <button onClick={onClose} className="close-popup-button">Close</button>
      </div>
    </div>
  );
}
