'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Float, Environment, Sparkles, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import Link from 'next/link';
import * as THREE from 'three';
import '@/styles/cinematic.css';
// Removed three-nebula import to fix runtime errors

// Floating particles component
function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#60a5fa"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Removed BlackHole component as requested

// Animated 3D logo with smooth entrance effect
const AnimatedLogo = () => {
  const logoRef = useRef<THREE.Group>(null);
  const [introPhase, setIntroPhase] = useState(true);
  
  useFrame((state) => {
    if (logoRef.current) {
      const time = state.clock.elapsedTime;
      
      if (time < 1) { // During the 1-second intro animation (reduced from 2 seconds)
        // Calculate progress through the intro
        const progress = time / 1; // Faster progress calculation
        
        // Smooth entrance from distance without shaking
        logoRef.current.position.z = THREE.MathUtils.lerp(30, 0, Math.min(1, progress * 2.0)); // Faster approach
        
        // Very subtle movement for elegance, not shaking
        logoRef.current.position.x = Math.sin(time * 0.8) * 0.2;
        logoRef.current.position.y = Math.cos(time * 0.6) * 0.15;
        
        // Gentle rotation for professional appearance
        logoRef.current.rotation.y = Math.sin(time * 0.5) * 0.2;
        
        // Smooth scaling without variation
        const scaleBase = THREE.MathUtils.lerp(0.5, 1.0, Math.min(1, progress * 3.0)); // Faster scaling
        logoRef.current.scale.setScalar(scaleBase);
      } else {
        // After 1 second, stabilize logo
        if (introPhase) {
          setIntroPhase(false);
        }
        
        // Gentle floating and rotation after stabilization
        logoRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
        logoRef.current.position.y = Math.sin(time * 0.8) * 0.1;
        logoRef.current.scale.setScalar(1 + Math.sin(time * 0.6) * 0.05); // Breathing effect
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={logoRef}>
        <Text
          fontSize={1.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          material-transparent
          material-opacity={1}
          material-emissive="#ffffff"
          material-emissiveIntensity={0.5}
        >
          VENTARO AI
        </Text>
        {/* Glowing ring around logo */}
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[3, 0.05, 16, 100]} />
          <meshStandardMaterial
            color="#60a5fa"
            emissive="#3b82f6"
            emissiveIntensity={0.8}
            transparent
            opacity={0.6}
          />
        </mesh>
      </group>
    </Float>
  );
};

// Simplified particle system to replace three-nebula
function SimpleParticleSystem() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    const colors = new Float32Array(2000 * 3);
    
    for (let i = 0; i < 2000; i++) {
      // Random spherical distribution
      const radius = 15 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Colorful particles
      const colorType = Math.random();
      if (colorType < 0.3) {
        colors[i * 3] = 0.4; colors[i * 3 + 1] = 0.6; colors[i * 3 + 2] = 1.0; // Blue
      } else if (colorType < 0.6) {
        colors[i * 3] = 0.5; colors[i * 3 + 1] = 0.3; colors[i * 3 + 2] = 0.9; // Purple
      } else {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.4; colors[i * 3 + 2] = 0.6; // Pink
      }
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.elapsedTime;
      particlesRef.current.rotation.y = time * 0.02;
      particlesRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particles.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        transparent
        opacity={0.8}
        sizeAttenuation
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Enhanced background stars for depth
function BackgroundStars() {
  const starsRef = useRef<THREE.Points>(null);
  const starPositions = useRef<Float32Array>();
  const originalPositions = useRef<Float32Array>();
  
  const starField = useMemo(() => {
    const positions = new Float32Array(5000 * 3);
    const colors = new Float32Array(5000 * 3);
    const sizes = new Float32Array(5000);
    
    for (let i = 0; i < 5000; i++) {
      // Spherical distribution
      const phi = Math.random() * Math.PI * 2;
      const costheta = Math.random() * 2 - 1;
      const u = Math.random();
      const theta = Math.acos(costheta);
      const r = 200 + Math.random() * 300;
      
      positions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = r * Math.cos(theta);
      
      // Realistic star colors based on temperature
      const temp = Math.random();
      if (temp < 0.3) {
        // Red stars
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.3 + Math.random() * 0.4;
        colors[i * 3 + 2] = 0.2 + Math.random() * 0.3;
      } else if (temp < 0.6) {
        // Yellow-white stars
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 2] = 0.6 + Math.random() * 0.4;
      } else {
        // Blue-white stars
        colors[i * 3] = 0.7 + Math.random() * 0.3;
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 2] = 1.0;
      }
      
      sizes[i] = 0.5 + Math.random() * 2.0;
    }
    
    // Store original positions for reference
     originalPositions.current = positions.slice();
     starPositions.current = positions.slice();
     
     return { positions, colors };
  }, []);
  
  useFrame((state) => {
    if (starsRef.current && starPositions.current && originalPositions.current) {
      const time = state.clock.elapsedTime;
      const positions = starsRef.current.geometry.attributes.position.array as Float32Array;
      
      if (time < 2) { // Reduced from 5 seconds to 2 seconds
        // During intro phase: gentle star movement without streaking/shaking
        const progress = time / 2; // Adjusted progress calculation
        
        for (let i = 0; i < 5000; i++) {
          const i3 = i * 3;
          const originalX = originalPositions.current[i3];
          const originalY = originalPositions.current[i3 + 1];
          const originalZ = originalPositions.current[i3 + 2];
          
          // Calculate distance from center for depth effect
          const distance = Math.sqrt(originalX * originalX + originalY * originalY + originalZ * originalZ);
          
          // Subtle z-axis movement for gentle forward motion
          const zOffset = Math.min(distance / 200, 1) * (1 - progress) * 10;
          
          // Very minimal lateral movement for professional look
          const lateralSpeed = time * 0.2;
          const lateralAmount = 0.5;
          const xOffset = Math.sin(lateralSpeed + distance * 0.01) * lateralAmount;
          const yOffset = Math.cos(lateralSpeed + distance * 0.01) * lateralAmount;
          
          // Update positions with subtle movement
          positions[i3] = originalX + xOffset;
          positions[i3 + 1] = originalY + yOffset;
          positions[i3 + 2] = originalZ + zOffset;
        }
        
        // Add subtle rotation for elegant effect
        starsRef.current.rotation.z = time * 0.02;
        starsRef.current.rotation.x = Math.sin(time * 0.3) * 0.05;
      } else {
        // After intro phase: stars return to normal positions with gentle rotation
        const returnProgress = Math.min((time - 2) / 1, 1); // 1 second return (reduced from 2 seconds)
        
        if (returnProgress < 1) {
          // Gradually return stars to their original positions
          for (let i = 0; i < 5000; i++) {
            const i3 = i * 3;
            const currentX = positions[i3];
            const currentY = positions[i3 + 1];
            const currentZ = positions[i3 + 2];
            
            positions[i3] = THREE.MathUtils.lerp(currentX, originalPositions.current[i3], returnProgress);
            positions[i3 + 1] = THREE.MathUtils.lerp(currentY, originalPositions.current[i3 + 1], returnProgress);
            positions[i3 + 2] = THREE.MathUtils.lerp(currentZ, originalPositions.current[i3 + 2], returnProgress);
          }
        } else {
          // Normal slow rotation after stars have returned
          starsRef.current.rotation.y = time * 0.02;
          starsRef.current.rotation.x = Math.sin(time * 0.01) * 0.1;
        }
      }
      
      starsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[starField.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[starField.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.8}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
  


// Main 3D scene with space atmosphere
function Scene() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  useFrame((state) => {
    // Smooth camera movement for professional cinematic effect
    if (state.camera) {
      const time = state.clock.elapsedTime;
      
      if (time < 2) { // During intro phase: reduced from 5 seconds to 2 seconds
        // During intro phase: smooth camera movement without shaking
        const progress = time / 2;
        
        // Subtle, professional camera movement
        const smoothX = Math.sin(time * 0.3) * 0.2;
        const smoothY = Math.cos(time * 0.2) * 0.1;
        
        // Gentle forward motion - camera starts back and moves forward
        const zPosition = THREE.MathUtils.lerp(20, 15, Math.min(1, progress * 1.5)); // Faster approach
        
        // Apply camera movement
        state.camera.position.x = smoothX;
        state.camera.position.y = smoothY;
        state.camera.position.z = zPosition;
      } else {
        // After intro phase: gentle orbital movement
        state.camera.position.x = Math.sin(time * 0.1) * 2;
        state.camera.position.y = Math.cos(time * 0.15) * 1;
        state.camera.position.z = 12 + Math.sin(time * 0.2) * 0.5;
        state.camera.rotation.z = 0; // Reset rotation
      }
      
      state.camera.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      {/* Deep space background */}
      <color attach="background" args={['#000011']} />
      
      {/* Space lighting */}
      <ambientLight intensity={0.1} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.5}
        color="#60a5fa"
        castShadow
      />
      <pointLight position={[-10, -10, -10]} color="#8b5cf6" intensity={0.8} />
      <pointLight position={[15, 5, 10]} color="#ec4899" intensity={0.6} />
      
      {/* Space elements */}
      <SimpleParticleSystem />
      <BackgroundStars />
      <AnimatedLogo />
      <FloatingParticles />
      <Sparkles count={200} scale={15} size={3} speed={0.6} color="#60a5fa" />
      <Sparkles count={150} scale={20} size={2} speed={0.3} color="#8b5cf6" />
    </>
  );
}

// Elite Glassmorphism UI overlay with professional typography
function GlassmorphismOverlay() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
      style={{ pointerEvents: 'none' }}
    >
      <div className="text-center z-10 pointer-events-auto">
        <div
            className="backdrop-blur-xl bg-black/30 border border-white/10 rounded-3xl p-8 mb-6 max-w-4xl mx-auto w-[90%] md:w-auto shadow-2xl"
            style={{ 
              opacity: 0.98,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 leading-[0.9] tracking-tight transform transition-all duration-1000 hover:scale-105">
            <span 
              className="block bg-gradient-to-r from-blue-300 via-white to-purple-300 bg-clip-text text-transparent font-black animate-pulse"
              style={{
                textShadow: '0 0 30px rgba(96, 165, 250, 0.8), 0 0 60px rgba(139, 92, 246, 0.6), 0 0 2px rgba(96, 165, 250, 1)',
                WebkitTextStroke: '1px rgba(96, 165, 250, 0.3)',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 900,
                letterSpacing: '-0.05em'
              }}
            >
              AI TOOLS THAT
            </span>
            <span 
              className="block bg-gradient-to-r from-purple-300 via-white to-blue-300 bg-clip-text text-transparent font-black mt-2"
              style={{
                textShadow: '0 0 40px rgba(139, 92, 246, 0.9), 0 0 80px rgba(96, 165, 250, 0.7), 0 0 2px rgba(139, 92, 246, 1)',
                WebkitTextStroke: '1px rgba(139, 92, 246, 0.4)',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 900,
                letterSpacing: '-0.05em'
              }}
            >
              MAKE MONEY
            </span>
            <span 
              className="block text-white font-black mt-4 text-2xl md:text-4xl opacity-90"
              style={{
                textShadow: '0 0 20px rgba(96, 165, 250, 0.8), 0 0 40px rgba(139, 92, 246, 0.6), 0 0 1px rgba(96, 165, 250, 0.9)',
                WebkitTextStroke: '0.5px rgba(96, 165, 250, 0.2)',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 800,
                letterSpacing: '-0.02em'
              }}
            >
              Build Your Online Business Fast
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto font-medium opacity-90"
             style={{
               textShadow: '0 0 10px rgba(96, 165, 250, 0.3), 0 0 20px rgba(139, 92, 246, 0.2)'
             }}>
            100% AI-generated resources to help you launch profitable online businesses. 
            <span className="text-white font-semibold"
                  style={{
                    textShadow: '0 0 15px rgba(96, 165, 250, 0.6), 0 0 30px rgba(139, 92, 246, 0.4)',
                    WebkitTextStroke: '0.3px rgba(96, 165, 250, 0.2)'
                  }}>Learn how we built this entire site with AI</span> and how you can do the same.
          </p>
          
          <div className="space-y-6">
            <Link 
              href="/products" 
              className="group relative inline-flex items-center justify-center px-12 py-5 text-lg font-black text-black bg-white rounded-2xl transition-all duration-500 transform hover:scale-110 hover:bg-gray-100 shadow-2xl overflow-hidden"
              style={{ 
                minWidth: '280px',
                boxShadow: '0 20px 40px rgba(255, 255, 255, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2)',
                fontFamily: 'Inter, system-ui, sans-serif',
                letterSpacing: '-0.02em'
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white via-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              <span className="relative z-10 flex items-center">
                EXPLORE PRODUCTS
                <svg className="ml-4 w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </Link>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 mt-8">
              <span className="flex items-center bg-black/60 backdrop-blur-sm px-5 py-3 rounded-full border border-white/10 shadow-lg">
                <div className="w-3 h-3 bg-white rounded-full mr-3 animate-pulse shadow-lg"></div>
                <span className="font-semibold text-white">Instant Access</span>
              </span>
              <span className="flex items-center bg-black/60 backdrop-blur-sm px-5 py-3 rounded-full border border-white/10 shadow-lg">
                <div className="w-3 h-3 bg-white rounded-full mr-3 animate-pulse shadow-lg"></div>
                <span className="font-semibold text-white">Secure Payment</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main cinematic hero component
export default function CinematicHero() {
  const [canvasError, setCanvasError] = useState(false);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black cinematic-hero">
      {/* Fallback background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      
      {/* 3D Canvas Background with error handling */}
      {!canvasError && (
        <Canvas
          camera={{ position: [0, 0, 12], fov: 60 }}
          className="absolute inset-0"
          gl={{ 
            antialias: true, 
            alpha: true, 
            powerPreference: "high-performance",
            preserveDrawingBuffer: false
          }}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
          onError={() => setCanvasError(true)}
        >
          <Scene />
          <Environment preset="night" background={false} />
        </Canvas>
      )}
      
      {/* Glassmorphism UI Overlay */}
      <GlassmorphismOverlay />
      
      {/* Ambient particles overlay */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="particle-field"></div>
      </div>
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 pointer-events-none"></div>
    </div>
  );
}