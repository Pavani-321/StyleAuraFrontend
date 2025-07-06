import React from "react";
import "../styling/RemoveButton.css"; // Ensure this path is correct
import 'bootstrap-icons/font/bootstrap-icons.css';

// Usage: <RemoveButton onClick={...} />
const RemoveButton = ({ onClick }) => {
  return (
    <>
    <button
      className="remove-btn"
      onClick={onClick}
      aria-label="Remove from cart"
      type="button"
    >
      <span className="remove-text">Remove </span>
      <span className="icon">
        <i className="bi bi-trash" aria-hidden="true"></i>
      </span>
    </button>
    
    </>

    
  );
};

export default RemoveButton;
