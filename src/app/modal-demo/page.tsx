'use client';

import { useState } from 'react';
import './page.css';
import ModalDemo from '../../components/ModalDemo';
import ModalPerformanceTest from '../../components/ModalPerformanceTest';

export default function ModalDemoPage() {
  const [activeTab, setActiveTab] = useState('demo');
  
  return (
    <div className="modal-demo-page">
      <div className="modal-demo-header">
        <h1>Modal Optimization Demo</h1>
        <p>
          This page demonstrates various optimized modal components and performance testing.
          These components are designed to provide optimal performance across different devices
          and user preferences.
        </p>
      </div>
      
      <div className="modal-demo-tabs">
        <button
          className={`modal-demo-tab ${activeTab === 'demo' ? 'active' : ''}`}
          onClick={() => setActiveTab('demo')}
        >
          Modal Examples
        </button>
        <button
          className={`modal-demo-tab ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          Performance Testing
        </button>
      </div>
      
      <div className="modal-demo-content">
        {activeTab === 'demo' ? (
          <ModalDemo title="Modal Component Examples" />
        ) : (
          <ModalPerformanceTest title="Modal Performance Comparison" />
        )}
      </div>
      
      <div className="modal-demo-footer">
        <h2>Implementation Details</h2>
        <div className="implementation-details">
          <div className="detail-section">
            <h3>OptimizedModal Component</h3>
            <ul>
              <li>Fully optimized modal with performance enhancements</li>
              <li>Detects device capabilities and adjusts accordingly</li>
              <li>Implements accessibility best practices</li>
              <li>Provides extensive customization options</li>
              <li>Handles focus management and keyboard navigation</li>
            </ul>
          </div>
          
          <div className="detail-section">
            <h3>useModalOptimizer Hook</h3>
            <ul>
              <li>Reusable hook for modal optimization logic</li>
              <li>Simplifies creation of custom modal components</li>
              <li>Handles animation, focus, and scroll management</li>
              <li>Optimizes performance based on device capabilities</li>
            </ul>
          </div>
          
          <div className="detail-section">
            <h3>Performance Optimizations</h3>
            <ul>
              <li>Conditional animations based on device capabilities</li>
              <li>Efficient DOM updates and rendering</li>
              <li>Proper cleanup to prevent memory leaks</li>
              <li>Respects user preferences like reduced motion</li>
              <li>Uses CSS optimizations for smooth animations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}