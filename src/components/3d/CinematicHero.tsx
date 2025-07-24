'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, Environment, Sparkles, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import Link from 'next/link';
import * as THREE from 'three';

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
          count={1000}
          array={particles}
          itemSize={3}
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

// Animated 3D logo with dramatic zoom effect
function AnimatedLogo() {
  const logoRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (logoRef.current) {
      // More dramatic zoom-in effect from deep space
      const time = state.clock.elapsedTime;
      const zoomProgress = Math.min(time / 4, 1); // Faster 4 seconds zoom duration
      
      // Start much further away and zoom in dramatically
      logoRef.current.position.z = THREE.MathUtils.lerp(-100, 0, 
        THREE.MathUtils.smoothstep(0, 1, zoomProgress));
      logoRef.current.scale.setScalar(THREE.MathUtils.lerp(0.05, 1.2, 
        THREE.MathUtils.smoothstep(0, 1, zoomProgress)));
      
      // Add rotation during zoom for more dynamic effect
      if (zoomProgress < 1) {
        logoRef.current.rotation.z = (1 - zoomProgress) * Math.PI * 2;
        logoRef.current.rotation.y = (1 - zoomProgress) * Math.PI;
      } else {
        // Gentle floating and rotation after zoom completes
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
          material-transparent={false}
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
}

// Space environment with stars
function SpaceStars() {
  const starsRef = useRef<THREE.Points>(null);
  
  const stars = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2000}
          array={stars}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        color="#ffffff"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// Main 3D scene with space atmosphere
function Scene() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  useFrame((state) => {
    // Enhanced dynamic camera movement for cinematic effect
    if (state.camera) {
      const time = state.clock.elapsedTime;
      const zoomProgress = Math.min(time / 4, 1);
      
      if (zoomProgress < 1) {
        // During zoom: camera follows the logo zoom with slight shake
        const shake = (1 - zoomProgress) * 0.5;
        state.camera.position.x = (Math.random() - 0.5) * shake;
        state.camera.position.y = (Math.random() - 0.5) * shake;
        state.camera.position.z = THREE.MathUtils.lerp(20, 12, zoomProgress);
      } else {
        // After zoom: gentle orbital movement
        state.camera.position.x = Math.sin(time * 0.1) * 2;
        state.camera.position.y = Math.cos(time * 0.15) * 1;
        state.camera.position.z = 12 + Math.sin(time * 0.2) * 0.5;
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
      <SpaceStars />
      <AnimatedLogo />
      <FloatingParticles />
      <Sparkles count={200} scale={15} size={3} speed={0.6} color="#60a5fa" />
      <Sparkles count={150} scale={20} size={2} speed={0.3} color="#8b5cf6" />
    </>
  );
}

// Glassmorphism UI overlay
function GlassmorphismOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, delay: 0.5 }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <div className="text-center z-10 pointer-events-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="glass-panel p-8 mb-8 max-w-2xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            <motion.span 
              className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              AI-Powered
            </motion.span>
            <br />
            <motion.span 
              className="text-white"
              animate={{ opacity: [0.9, 1, 0.9] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              Digital Products
            </motion.span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Transform your business with cutting-edge AI tools, expert prompts, and personalized coaching sessions.
          </p>
          
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1.02 }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="space-y-4"
          >
            <Link href="/products" className="neon-button px-8 py-4 text-lg font-semibold">
              Explore Products
            </Link>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Instant Access
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                No Email Required
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
                Secure Payment
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Main cinematic hero component
export default function CinematicHero() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* 3D Canvas Background with cinematic camera */}
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
      >
        <Scene />
      </Canvas>
      
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