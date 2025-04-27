import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal__content">
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
        </div>
        <div className="modal__body">
          {children}
        </div>
        <div className="modal__footer">
          <button 
            className="modal__button modal__button--cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="modal__button modal__button--delete"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal; 