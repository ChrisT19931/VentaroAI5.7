'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Float, Environment, Sparkles, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import Link from 'next/link';
import * as THREE from 'three';
import '@/styles/cinematic.css';

// Enhanced CSS animations for cinematic effects
const tvEffectStyles = `
  @keyframes tvStatic {
    0% { transform: translateX(0) translateY(0); }
    10% { transform: translateX(-1px) translateY(1px); }
    20% { transform: translateX(1px) translateY(-1px); }
    30% { transform: translateX(-1px) translateY(-1px); }
    40% { transform: translateX(1px) translateY(1px); }
    50% { transform: translateX(-1px) translateY(0); }
    60% { transform: translateX(1px) translateY(-1px); }
    70% { transform: translateX(-1px) translateY(1px); }
    80% { transform: translateX(1px) translateY(0); }
    90% { transform: translateX(-1px) translateY(-1px); }
    100% { transform: translateX(0) translateY(0); }
  }

  @keyframes epicGlow {
    0% { 
      filter: brightness(1.4) contrast(1.3) saturate(1.2) drop-shadow(0 0 30px rgba(96, 165, 250, 0.8)) drop-shadow(0 0 60px rgba(139, 92, 246, 0.6));
      text-shadow: 0 0 20px rgba(255, 255, 255, 0.9), 0 0 40px rgba(96, 165, 250, 0.7), 0 0 80px rgba(139, 92, 246, 0.5);
    }
    50% { 
      filter: brightness(1.8) contrast(1.5) saturate(1.4) drop-shadow(0 0 50px rgba(96, 165, 250, 1)) drop-shadow(0 0 100px rgba(139, 92, 246, 0.8));
      text-shadow: 0 0 30px rgba(255, 255, 255, 1), 0 0 60px rgba(96, 165, 250, 0.9), 0 0 120px rgba(139, 92, 246, 0.7);
    }
    100% { 
      filter: brightness(1.4) contrast(1.3) saturate(1.2) drop-shadow(0 0 30px rgba(96, 165, 250, 0.8)) drop-shadow(0 0 60px rgba(139, 92, 246, 0.6));
      text-shadow: 0 0 20px rgba(255, 255, 255, 0.9), 0 0 40px rgba(96, 165, 250, 0.7), 0 0 80px rgba(139, 92, 246, 0.5);
    }
  }

  @keyframes holographicShift {
    0% { 
      background: linear-gradient(45deg, #60a5fa, #a855f7, #ec4899, #f59e0b, #10b981, #60a5fa);
      background-size: 400% 400%;
      background-position: 0% 50%;
    }
    25% { background-position: 100% 50%; }
    50% { background-position: 100% 100%; }
    75% { background-position: 0% 100%; }
  }

  @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes purple-streak {
          0% {
            background-position: -100% 0, 0 0;
          }
          25% {
            background-position: -50% 0, 0 0;
          }
          50% {
            background-position: 50% 0, 0 0;
          }
          75% {
            background-position: 150% 0, 0 0;
          }
          100% {
            background-position: 200% 0, 0 0;
          }
        }
  }

  @keyframes matrixRain {
    0% { transform: translateY(-100vh); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(100vh); opacity: 0; }
  }

  @keyframes pulseWave {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.7; }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes energyField {
    0% { 
      box-shadow: 0 0 20px rgba(96, 165, 250, 0.5), inset 0 0 20px rgba(139, 92, 246, 0.3);
      border-color: rgba(96, 165, 250, 0.5);
    }
    50% { 
      box-shadow: 0 0 40px rgba(139, 92, 246, 0.8), inset 0 0 40px rgba(96, 165, 250, 0.5);
      border-color: rgba(139, 92, 246, 0.8);
    }
    100% { 
      box-shadow: 0 0 20px rgba(96, 165, 250, 0.5), inset 0 0 20px rgba(139, 92, 246, 0.3);
      border-color: rgba(96, 165, 250, 0.5);
    }
  }

  @keyframes quantumFloat {
    0% { transform: translateY(0px) translateX(0px); }
    25% { transform: translateY(-10px) translateX(5px); }
    50% { transform: translateY(-5px) translateX(-3px); }
    75% { transform: translateY(-15px) translateX(2px); }
    100% { transform: translateY(0px) translateX(0px); }
  }

  @keyframes dimensionalShift {
    0% { 
      transform: scale(1);
      filter: hue-rotate(0deg);
    }
    25% { 
      transform: scale(1.05);
      filter: hue-rotate(90deg);
    }
    50% { 
      transform: scale(1.1);
      filter: hue-rotate(180deg);
    }
    75% { 
      transform: scale(1.05);
      filter: hue-rotate(270deg);
    }
    100% { 
      transform: scale(1);
      filter: hue-rotate(360deg);
    }
  }

  @keyframes cosmicBreathing {
    0% { 
      transform: scale(1);
      opacity: 0.8;
      filter: brightness(1.2) contrast(1.1);
    }
    50% { 
      transform: scale(1.15);
      opacity: 1;
      filter: brightness(1.5) contrast(1.3);
    }
    100% { 
      transform: scale(1);
      opacity: 0.8;
      filter: brightness(1.2) contrast(1.1);
    }
  }

  .particle-field {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(2px 2px at 20px 30px, rgba(96, 165, 250, 0.8), transparent),
      radial-gradient(2px 2px at 40px 70px, rgba(139, 92, 246, 0.6), transparent),
      radial-gradient(1px 1px at 90px 40px, rgba(236, 72, 153, 0.7), transparent),
      radial-gradient(1px 1px at 130px 80px, rgba(245, 158, 11, 0.5), transparent),
      radial-gradient(2px 2px at 160px 30px, rgba(16, 185, 129, 0.6), transparent);
    background-repeat: repeat;
    background-size: 200px 100px;
    animation: matrixRain 8s linear infinite;
  }

`;

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
        {/* Ring removed as requested */}
      </group>
    </Float>
  );
};

// Simplified particle system to replace three-nebula
function SimpleParticleSystem() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(500 * 3);
    const colors = new Float32Array(500 * 3);
    
    for (let i = 0; i < 500; i++) {
      // Random spherical distribution
      const radius = 20 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Subtle white particles only
      colors[i * 3] = 0.8;
      colors[i * 3 + 1] = 0.8;
      colors[i * 3 + 2] = 0.9;
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

// Enhanced background stars with realistic complex movement
function BackgroundStars() {
  const starsRef = useRef<THREE.Points>(null);
  const starData = useRef<{
    originalPositions: Float32Array;
    velocities: Float32Array;
    phases: Float32Array;
  } | null>(null);
  
  const starField = useMemo(() => {
    const positions = new Float32Array(3000 * 3);
    const colors = new Float32Array(3000 * 3);
    const velocities = new Float32Array(3000 * 3);
    const phases = new Float32Array(3000);
    
    for (let i = 0; i < 3000; i++) {
      // Random spherical distribution
      const r = Math.random() * 400 + 100;
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * Math.PI * 2;
      
      positions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = r * Math.cos(theta);
      
      // Random velocities for natural movement
      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
      
      // Random phase for twinkling
      phases[i] = Math.random() * Math.PI * 2;
      
      // Varied star colors
      const temp = Math.random();
      const brightness = 0.5 + Math.random() * 0.5;
      
      if (temp < 0.7) {
        // White stars
        colors[i * 3] = brightness;
        colors[i * 3 + 1] = brightness;
        colors[i * 3 + 2] = brightness;
      } else if (temp < 0.85) {
        // Slightly blue stars
        colors[i * 3] = brightness * 0.8;
        colors[i * 3 + 1] = brightness * 0.9;
        colors[i * 3 + 2] = brightness;
      } else {
        // Slightly yellow stars
        colors[i * 3] = brightness;
        colors[i * 3 + 1] = brightness * 0.9;
        colors[i * 3 + 2] = brightness * 0.7;
      }
    }
    
    starData.current = {
      originalPositions: positions.slice(),
      velocities,
      phases
    };
     
     return { positions, colors };
  }, []);
  
  useFrame((state) => {
    if (starsRef.current && starData.current) {
      const time = state.clock.elapsedTime;
      const positions = starsRef.current.geometry.attributes.position.array as Float32Array;
      const { originalPositions, velocities, phases } = starData.current;
      
      // Random twinkling movement only - no drift
      for (let i = 0; i < 3000; i++) {
        const i3 = i * 3;
        const baseX = originalPositions[i3];
        const baseY = originalPositions[i3 + 1];
        const baseZ = originalPositions[i3 + 2];
        
        // Only twinkling movement - stars stay in place
        const twinkleX = Math.sin(time * 0.5 + phases[i]) * 0.3;
        const twinkleY = Math.cos(time * 0.7 + phases[i]) * 0.3;
        const twinkleZ = Math.sin(time * 0.3 + phases[i]) * 0.15;
        
        positions[i3] = baseX + twinkleX;
        positions[i3 + 1] = baseY + twinkleY;
        positions[i3 + 2] = baseZ + twinkleZ;
      }
      
      starsRef.current.geometry.attributes.position.needsUpdate = true;
      
      // Gentle overall rotation
      starsRef.current.rotation.y = time * 0.001;
      starsRef.current.rotation.z = Math.sin(time * 0.02) * 0.01;
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

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight tracking-tight"
                style={{
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, Inter, system-ui, sans-serif',
                  fontWeight: '700',
                  position: 'relative',
                  zIndex: 10,
                  background: 'linear-gradient(90deg, transparent 0%, transparent 47%, rgba(147, 51, 234, 0.3) 48%, rgba(147, 51, 234, 0.8) 49%, rgba(147, 51, 234, 1) 50%, rgba(147, 51, 234, 0.8) 51%, rgba(147, 51, 234, 0.3) 52%, transparent 53%, transparent 100%), linear-gradient(90deg, #888888 0%, #888888 50%, #ffffff 50%, #ffffff 100%)',
                  backgroundSize: '300% 100%, 100% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'purple-streak 10s ease-in-out infinite',
                  letterSpacing: '-0.025em'
                }}>
                Build A Fully Operational Online Business Using AI Within 2 Hours With Ventaro AI
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto font-medium opacity-90">
            <span className="text-white font-semibold"
                  style={{
                    textShadow: '0 0 15px rgba(96, 165, 250, 0.6), 0 0 30px rgba(139, 92, 246, 0.4)',
                    WebkitTextStroke: '0.3px rgba(96, 165, 250, 0.2)'
                  }}>We built this entire site with AI and we can teach you how to do the same or we can do it for you</span>
          </p>
          
          <div className="space-y-6">
            <a 
              href="#elite-custom-website-creation" 
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
                GET CUSTOM WEBSITE
                <svg className="ml-4 w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </a>
            
            <div className="flex flex-col items-center space-y-4">
              <Link href="/products" className="text-blue-400 hover:text-blue-300 transition-colors duration-300 text-lg">
                Do it yourself - Explore products
              </Link>
            </div>
            
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

  // Inject TV effect animation styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = tvEffectStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black cinematic-hero">
      {/* Enhanced fallback background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/20 to-black opacity-90"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/10 via-transparent to-pink-900/10"></div>

      
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
      

      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 pointer-events-none"></div>
    </div>
  );
}