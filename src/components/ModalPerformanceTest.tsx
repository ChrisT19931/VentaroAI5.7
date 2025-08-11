'use client';

import { useState, useEffect, useCallback } from 'react';
import OptimizedModal from './OptimizedModal';
import SimpleModal from './SimpleModal';
import useComponentOptimizer from '../hooks/useComponentOptimizer';
import { useRenderTime } from '../utils/react-optimizer';
import '../components/OptimizedModal.css';
import './ModalDemo.css';
import './ModalPerformanceTest.css';

interface ModalPerformanceTestProps {
  /** Title for the test section */
  title?: string;
}

/**
 * ModalPerformanceTest - A component to test and compare modal performance
 */
const ModalPerformanceTest = ({ title = 'Modal Performance Test' }: ModalPerformanceTestProps) => {
  // State for controlling modal visibility
  const [isOptimizedModalOpen, setIsOptimizedModalOpen] = useState(false);
  const [isSimpleModalOpen, setIsSimpleModalOpen] = useState(false);
  const [isStandardModalOpen, setIsStandardModalOpen] = useState(false);
  
  // State for test results
  const [optimizedRenderTime, setOptimizedRenderTime] = useState<number | null>(null);
  const [simpleRenderTime, setSimpleRenderTime] = useState<number | null>(null);
  const [standardRenderTime, setStandardRenderTime] = useState<number | null>(null);
  
  // State for test configuration
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [simulateLowEndDevice, setSimulateLowEndDevice] = useState(false);
  
  // Get device capabilities
  const { isLowEnd, prefersReducedMotion } = useComponentOptimizer('ModalPerformanceTest');
  
  // Measure render time for each modal type
  const { renderTime: optimizedModalRenderTime, startMeasurement: startOptimizedMeasurement, endMeasurement: endOptimizedMeasurement } = useRenderTime();
  const { renderTime: simpleModalRenderTime, startMeasurement: startSimpleMeasurement, endMeasurement: endSimpleMeasurement } = useRenderTime();
  const { renderTime: standardModalRenderTime, startMeasurement: startStandardMeasurement, endMeasurement: endStandardMeasurement } = useRenderTime();
  
  // Function to run performance test
  const runPerformanceTest = useCallback(() => {
    // Reset previous results
    setOptimizedRenderTime(null);
    setSimpleRenderTime(null);
    setStandardRenderTime(null);
    
    // Open each modal in sequence with a delay
    setTimeout(() => {
      // Open optimized modal - measurement will be handled by callbacks
      setIsOptimizedModalOpen(true);
      
      // Close modal and capture render time after a delay
      setTimeout(() => {
        setOptimizedRenderTime(optimizedModalRenderTime);
        setIsOptimizedModalOpen(false);
        
        // Open simple modal after a delay
        setTimeout(() => {
          // Open simple modal - measurement will be handled by callbacks
          setIsSimpleModalOpen(true);
          
          // Close modal and capture render time after a delay
          setTimeout(() => {
            setSimpleRenderTime(simpleModalRenderTime);
            setIsSimpleModalOpen(false);
            
            // Open standard modal after a delay
            setTimeout(() => {
              // Open standard modal - measurement will be handled by callbacks
              setIsStandardModalOpen(true);
              
              // Close modal after a delay
              setTimeout(() => {
                setStandardRenderTime(standardModalRenderTime);
                setIsStandardModalOpen(false);
              }, 500);
            }, 500);
          }, 500);
        }, 500);
      }, 500);
    }, 100);
  }, [optimizedModalRenderTime, simpleModalRenderTime, standardModalRenderTime]);
  
  // Create content for modals
  const createModalContent = () => {
    // Create a more complex content to better test performance
    return (
      <div>
        <h3>Performance Test Content</h3>
        <p>This modal contains content designed to test rendering performance.</p>
        
        <div className="performance-test-grid">
          {Array.from({ length: 20 }).map((_, index) => (
            <div key={index} className="performance-test-item">
              <div className="performance-test-number">{index + 1}</div>
              <div className="performance-test-content">
                <h4>Item {index + 1}</h4>
                <p>This is a test item with some content to render.</p>
                <div className="performance-test-buttons">
                  <button className="performance-test-button">Action 1</button>
                  <button className="performance-test-button">Action 2</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Standard modal implementation (without optimizations)
  const StandardModal = ({ 
    isOpen, 
    onClose,
    onOpen,
    onAnimationEnd
  }: { 
    isOpen: boolean; 
    onClose: () => void;
    onOpen?: () => void;
    onAnimationEnd?: () => void;
  }) => {
    useEffect(() => {
      if (isOpen) {
        // Lock scroll
        document.body.style.overflow = 'hidden';
        
        // Call onOpen callback if provided
        if (onOpen) {
          onOpen();
        }
        
        // Add event listener for escape key
        const handleEscapeKey = (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            onClose();
          }
        };
        
        document.addEventListener('keydown', handleEscapeKey);
        
        // Call onAnimationEnd after animation duration if provided
        const animationTimer = setTimeout(() => {
          if (onAnimationEnd) {
            onAnimationEnd();
          }
        }, animationsEnabled ? 300 : 0);
        
        return () => {
          document.removeEventListener('keydown', handleEscapeKey);
          document.body.style.overflow = '';
          clearTimeout(animationTimer);
        };
      }
    }, [isOpen, onClose, onOpen, onAnimationEnd]);
    
    // No need for separate measurement effect as we're using callbacks
    
    if (!isOpen) return null;
    
    return (
      <div className="standard-modal-container">
        <div 
          className="optimized-modal-backdrop"
          onClick={onClose}
          style={{
            opacity: 1,
            transition: animationsEnabled ? 'opacity 300ms ease-in-out' : 'none',
          }}
        />
        <div 
          className="optimized-modal"
          style={{
            opacity: 1,
            transform: 'translateY(0)',
            transition: animationsEnabled 
              ? 'opacity 300ms ease-in-out, transform 300ms ease-in-out'
              : 'none',
          }}
        >
          <div className="optimized-modal-header">
            <h2 className="optimized-modal-title">Standard Modal</h2>
            <button 
              className="optimized-modal-close"
              onClick={onClose}
            >
              ×
            </button>
          </div>
          <div className="optimized-modal-content">
            {createModalContent()}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="modal-performance-test">
      <h2>{title}</h2>
      
      <div className="test-controls">
        <div className="test-control-group">
          <label>
            <input 
              type="checkbox" 
              checked={animationsEnabled}
              onChange={(e) => setAnimationsEnabled(e.target.checked)}
            />
            Enable Animations
          </label>
          
          <label>
            <input 
              type="checkbox" 
              checked={simulateLowEndDevice}
              onChange={(e) => setSimulateLowEndDevice(e.target.checked)}
            />
            Simulate Low-End Device
          </label>
        </div>
        
        <button 
          className="run-test-button"
          onClick={runPerformanceTest}
        >
          Run Performance Test
        </button>
      </div>
      
      <div className="test-results">
        <h3>Test Results</h3>
        
        <div className="result-grid">
          <div className="result-item">
            <h4>OptimizedModal</h4>
            <p>Render Time: {optimizedRenderTime !== null ? `${optimizedRenderTime.toFixed(2)}ms` : 'Not tested'}</p>
          </div>
          
          <div className="result-item">
            <h4>SimpleModal (with hook)</h4>
            <p>Render Time: {simpleRenderTime !== null ? `${simpleRenderTime.toFixed(2)}ms` : 'Not tested'}</p>
          </div>
          
          <div className="result-item">
            <h4>Standard Modal</h4>
            <p>Render Time: {standardRenderTime !== null ? `${standardRenderTime.toFixed(2)}ms` : 'Not tested'}</p>
          </div>
        </div>
        
        <div className="device-info">
          <p><strong>Device Information:</strong></p>
          <p>Low-End Device: {isLowEnd ? 'Yes' : 'No'}</p>
          <p>Prefers Reduced Motion: {prefersReducedMotion ? 'Yes' : 'No'}</p>
          <p>Simulating Low-End: {simulateLowEndDevice ? 'Yes' : 'No'}</p>
        </div>
      </div>
      
      {/* Optimized Modal */}
      <OptimizedModal
        isOpen={isOptimizedModalOpen}
        onClose={() => setIsOptimizedModalOpen(false)}
        title="Optimized Modal"
        animate={animationsEnabled}
        onOpen={() => startOptimizedMeasurement()}
        onAnimationEnd={() => endOptimizedMeasurement()}
      >
        {createModalContent()}
      </OptimizedModal>
      
      {/* Simple Modal */}
      <SimpleModal
        isOpen={isSimpleModalOpen}
        onClose={() => setIsSimpleModalOpen(false)}
        title="Simple Modal (with hook)"
        animate={animationsEnabled}
        onOpen={() => startSimpleMeasurement()}
        onAnimationEnd={() => endSimpleMeasurement()}
      >
        {createModalContent()}
      </SimpleModal>
      
      {/* Standard Modal */}
      <StandardModal
        isOpen={isStandardModalOpen}
        onClose={() => setIsStandardModalOpen(false)}
        onOpen={() => startStandardMeasurement()}
        onAnimationEnd={() => endStandardMeasurement()}
      />
    </div>
  );
};

export default ModalPerformanceTest;