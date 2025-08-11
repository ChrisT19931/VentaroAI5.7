'use client';

import { useState } from 'react';
import OptimizedModal from './OptimizedModal';
import '../components/OptimizedModal.css';
import '../components/ModalDemo.css';

interface ModalDemoProps {
  /** Title for the demo section */
  title?: string;
}

/**
 * ModalDemo - A component to demonstrate the OptimizedModal functionality
 */
const ModalDemo = ({ title = 'Modal Optimization Demo' }: ModalDemoProps) => {
  // State for controlling modal visibility
  const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  
  // Form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  
  return (
    <div className="modal-demo-container">
      <h2>{title}</h2>
      
      <div className="modal-demo-buttons">
        <button 
          className="modal-demo-button"
          onClick={() => setIsBasicModalOpen(true)}
        >
          Open Basic Modal
        </button>
        
        <button 
          className="modal-demo-button"
          onClick={() => setIsFormModalOpen(true)}
        >
          Open Form Modal
        </button>
        
        <button 
          className="modal-demo-button"
          onClick={() => setIsCustomModalOpen(true)}
        >
          Open Custom Styled Modal
        </button>
      </div>
      
      {/* Basic Modal */}
      <OptimizedModal
        isOpen={isBasicModalOpen}
        onClose={() => setIsBasicModalOpen(false)}
        title="Basic Modal Example"
      >
        <div>
          <p>This is a basic modal with default styling and behavior.</p>
          <p>It demonstrates the core functionality of the OptimizedModal component.</p>
          <ul>
            <li>Optimized animations based on device capabilities</li>
            <li>Keyboard accessibility (Escape to close, Tab trap)</li>
            <li>Focus management</li>
            <li>Scroll locking</li>
          </ul>
          <button 
            onClick={() => setIsBasicModalOpen(false)}
            className="modal-demo-close-button"
          >
            Close Modal
          </button>
        </div>
      </OptimizedModal>
      
      {/* Form Modal */}
      <OptimizedModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title="Form Modal Example"
        closeOnOutsideClick={false}
      >
        <div>
          <p>This modal contains a form and prevents closing when clicking outside.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert(`Form submitted with Name: ${formName}, Email: ${formEmail}`);
              setIsFormModalOpen(false);
            }}
          >
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-buttons">
              <button 
                type="button" 
                onClick={() => setIsFormModalOpen(false)}
                className="modal-demo-cancel-button"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="modal-demo-submit-button"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </OptimizedModal>
      
      {/* Custom Styled Modal */}
      <OptimizedModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        title="Custom Styled Modal"
        className="custom-modal"
        backdropClassName="custom-modal-backdrop"
        animationDuration={500}
        style={{
          borderRadius: '16px',
          backgroundColor: '#f8f9fa',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          padding: '24px',
        }}
        backdropStyle={{
          backgroundColor: 'rgba(25, 25, 112, 0.7)',
        }}
      >
        <div>
          <p>This modal demonstrates custom styling options.</p>
          <p>You can customize:</p>
          <ul>
            <li>Modal appearance with className and style props</li>
            <li>Backdrop appearance with backdropClassName and backdropStyle props</li>
            <li>Animation duration and behavior</li>
            <li>Z-index for proper stacking</li>
          </ul>
          <div className="custom-modal-content">
            <div className="custom-modal-image">
              <div className="placeholder-image">Image Placeholder</div>
            </div>
            <div className="custom-modal-text">
              <h3>Custom Content Layout</h3>
              <p>This demonstrates a more complex layout within the modal.</p>
              <p>The OptimizedModal component is flexible enough to handle any content structure.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsCustomModalOpen(false)}
            className="custom-modal-button"
          >
            Close Custom Modal
          </button>
        </div>
      </OptimizedModal>
    </div>
  );
};

export default ModalDemo;