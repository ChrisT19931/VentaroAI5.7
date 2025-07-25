'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, Box, Sphere, Environment } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

interface CheckoutModalProps {
  items: any[];
  total: number;
  onClose: () => void;
  onCheckout: () => void;
}

// 3D Vault Animation Component
function DigitalVault({ isOpen }: { isOpen: boolean }) {
  const vaultRef = useRef<THREE.Group>(null);
  const doorRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (vaultRef.current) {
      vaultRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    
    if (doorRef.current) {
      const targetRotation = isOpen ? -Math.PI / 2 : 0;
      doorRef.current.rotation.y = THREE.MathUtils.lerp(doorRef.current.rotation.y, targetRotation, 0.1);
    }
  });

  return (
    <group ref={vaultRef}>
      {/* Vault body */}
      <mesh position={[0, 0, -0.5]} castShadow>
        <boxGeometry args={[3, 3, 1]} />
        <meshStandardMaterial
          color="#1f2937"
          metalness={0.8}
          roughness={0.2}
          emissive="#374151"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Vault door */}
      <mesh ref={doorRef} position={[0, 0, 0]} castShadow>
        <boxGeometry args={[3, 3, 0.2]} />
        <meshStandardMaterial
          color="#374151"
          metalness={0.9}
          roughness={0.1}
          emissive="#4b5563"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Digital products inside vault */}
      {isOpen && (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.3}>
          <group position={[0, 0, 0.5]}>
            <mesh position={[-0.5, 0.5, 0]}>
              <boxGeometry args={[0.4, 0.6, 0.1]} />
              <meshStandardMaterial color="#3b82f6" emissive="#1e40af" emissiveIntensity={0.3} />
            </mesh>
            <mesh position={[0.5, 0.5, 0]}>
              <boxGeometry args={[0.4, 0.6, 0.1]} />
              <meshStandardMaterial color="#8b5cf6" emissive="#5b21b6" emissiveIntensity={0.3} />
            </mesh>
            <mesh position={[0, -0.5, 0]}>
              <boxGeometry args={[0.4, 0.6, 0.1]} />
              <meshStandardMaterial color="#10b981" emissive="#047857" emissiveIntensity={0.3} />
            </mesh>
          </group>
        </Float>
      )}
      
      {/* Glowing particles */}
      {isOpen && (
        <>
          <Sphere args={[0.02]} position={[1, 1, 1]}>
            <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={1} />
          </Sphere>
          <Sphere args={[0.02]} position={[-1, 0.5, 1.2]}>
            <meshStandardMaterial color="#a78bfa" emissive="#8b5cf6" emissiveIntensity={1} />
          </Sphere>
          <Sphere args={[0.02]} position={[0.5, -1, 0.8]}>
            <meshStandardMaterial color="#34d399" emissive="#10b981" emissiveIntensity={1} />
          </Sphere>
        </>
      )}
    </group>
  );
}

// Pulsing payment button component
function PulsingPayButton({ onClick, isProcessing }: { onClick: () => void; isProcessing: boolean }) {
  const buttonRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (buttonRef.current && !isProcessing) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      buttonRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <mesh ref={buttonRef} onClick={onClick} castShadow>
      <cylinderGeometry args={[0.8, 0.8, 0.2, 32]} />
      <meshStandardMaterial
        color={isProcessing ? "#fbbf24" : "#10b981"}
        emissive={isProcessing ? "#f59e0b" : "#047857"}
        emissiveIntensity={0.5}
        metalness={0.3}
        roughness={0.2}
      />
    </mesh>
  );
}

// Success animation component
function SuccessAnimation() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.3 }} // Faster animation
      className="absolute inset-0 flex items-center justify-center z-20"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} // Faster rotation
          className="w-24 h-24 mx-auto mb-6 border-4 border-green-400 border-t-transparent rounded-full"
        />
        <h2 className="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
        <p className="text-gray-300">Your digital vault is opening...</p>
      </div>
    </motion.div>
  );
}

export default function CheckoutModal({ 
  items, 
  total, 
  onClose, 
  onCheckout
}: CheckoutModalProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [vaultOpen, setVaultOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      await onCheckout();
      setShowSuccess(true);
      setTimeout(() => {
        setVaultOpen(true);
      }, 500); // Reduced from 1000ms to 500ms
    } catch (error) {
      console.error('Checkout failed:', error);
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }} // Faster transition
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
          {/* Backdrop with blur */}
          <motion.div
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(20px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }} // Faster blur transition
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
          />
          
          {/* Modal content */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300, duration: 0.4 }} // Faster spring animation
            className="relative w-full max-w-4xl h-[600px] mx-4"
          >
            {/* Glass panel */}
            <div className="glass-panel h-full p-8 relative overflow-hidden">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* 3D Scene */}
              <div className="absolute inset-0">
                <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                  {/* Using a simple background color instead of Environment to avoid compatibility issues */}
                  <color attach="background" args={['#000']} />
                  <ambientLight intensity={0.4} />
                  <directionalLight
                    position={[5, 5, 5]}
                    intensity={1.5}
                    color="#60a5fa"
                    castShadow
                  />
                  <pointLight position={[-5, -5, 5]} color="#8b5cf6" intensity={0.8} />
                  
                  {showSuccess ? (
                    <DigitalVault isOpen={vaultOpen} />
                  ) : (
                    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.1}>
                      <PulsingPayButton onClick={handleCheckout} isProcessing={isProcessing} />
                      <Text
                        position={[0, -2, 0]}
                        fontSize={0.3}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                      >
                        {isProcessing ? 'Processing...' : 'Click to Pay'}
                      </Text>
                    </Float>
                  )}
                </Canvas>
              </div>
              
              {/* Success overlay */}
              {showSuccess && <SuccessAnimation />}
              
              {/* Content overlay */}
              {!showSuccess && (
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex-1">
                    <motion.h2
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }} // Faster animation
                      className="text-3xl font-bold text-white mb-6 text-center"
                    >
                      Complete Your Purchase
                    </motion.h2>
                    
                    {/* Cart items */}
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1, duration: 0.3 }} // Faster animation with less delay
                      className="space-y-4 mb-8"
                    >
                      {items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }} // Faster animation with less delay
                          className="flex items-center justify-between p-4 bg-white/5 rounded-lg backdrop-blur-sm"
                        >
                          <div>
                            <h3 className="text-white font-medium">{item.name}</h3>
                            <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                          </div>
                          <span className="text-yellow-400 font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                  
                  {/* Total and checkout */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }} // Faster animation with less delay
                    className="border-t border-white/20 pt-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xl text-white font-medium">Total:</span>
                      <span className="text-3xl font-bold text-yellow-400">${total.toFixed(2)}</span>
                    </div>
                    
                    {/* Payment Method Logos */}
                    <div className="mb-6 p-4 bg-white/5 rounded-lg backdrop-blur-sm">
                      <h4 className="text-white text-sm font-medium mb-3 text-center">Secure Payment Methods</h4>
                      <div className="flex items-center justify-center space-x-4 mb-3">
                        {/* Stripe Logo */}
                        <div className="bg-white/10 px-3 py-2 rounded-lg border border-white/20">
                          <svg className="h-4 w-auto" viewBox="0 0 60 25" fill="none">
                            <path d="M59.5 12.5c0-6.9-5.6-12.5-12.5-12.5S34.5 5.6 34.5 12.5 40.1 25 47 25s12.5-5.6 12.5-12.5z" fill="#635bff"/>
                            <path d="M47 7.5c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5z" fill="white"/>
                            <text x="2" y="18" fontSize="12" fill="#635bff" fontWeight="bold">stripe</text>
                          </svg>
                        </div>
                        
                        {/* Visa Logo */}
                        <div className="bg-white/10 px-3 py-2 rounded-lg border border-white/20">
                          <svg className="h-4 w-auto" viewBox="0 0 78 25" fill="none">
                            <path d="M35.5 2L30.5 23h-5L20.5 2h5l2.5 16L31 2h4.5zM40 2v21h-4V2h4zM53 9c-2 0-3 1-3 2s1 2 3 2 3-1 3-2-1-2-3-2zM60 2l-4 21h-4l4-21h4z" fill="#1a1f71"/>
                            <text x="2" y="18" fontSize="12" fill="#1a1f71" fontWeight="bold">VISA</text>
                          </svg>
                        </div>
                        
                        {/* Mastercard Logo */}
                        <div className="bg-white/10 px-3 py-2 rounded-lg border border-white/20">
                          <svg className="h-4 w-auto" viewBox="0 0 48 30" fill="none">
                            <circle cx="15" cy="15" r="12" fill="#eb001b"/>
                            <circle cx="33" cy="15" r="12" fill="#f79e1b"/>
                            <path d="M24 6c2.5 2 4 5 4 9s-1.5 7-4 9c-2.5-2-4-5-4-9s1.5-7 4-9z" fill="#ff5f00"/>
                          </svg>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-400 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <svg className="h-3 w-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>SSL Encrypted • PCI Compliant • 256-bit Security</span>
                        </div>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className="w-full neon-button py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                    >
                      {isProcessing ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing Payment...</span>
                        </div>
                      ) : (
                        <span className="flex items-center justify-center space-x-2">
                          <span>🔒</span>
                          <span>Secure Checkout - ${total.toFixed(2)}</span>
                        </span>
                      )}
                    </motion.button>
                    
                    <p className="text-center text-gray-400 text-sm mt-4">
                      Powered by Stripe • Instant download after payment • 30-day money-back guarantee
                    </p>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
  );
}