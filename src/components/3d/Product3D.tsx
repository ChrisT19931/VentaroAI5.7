'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, Box, Sphere, Environment, useTexture } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface Product3DProps {
  product: {
    id: string;
    name: string;
    price: number;
    image_url?: string;
    description: string;
  };
  onAddToCart: () => void;
}

// 3D Product Card Component
function ProductCard3D({ product, isHovered }: { product: any; isHovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current && groupRef.current) {
      // Slow rotation
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      
      // Floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
      
      // Scale on hover
      const targetScale = isHovered ? 1.1 : 1;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.2}>
        {/* Main product box */}
        <mesh ref={meshRef} castShadow receiveShadow>
          <boxGeometry args={[2, 2.5, 0.3]} />
          <meshStandardMaterial
            color={product.name.includes('E-book') ? '#3b82f6' : product.name.includes('Prompts') ? '#8b5cf6' : '#10b981'}
            metalness={0.7}
            roughness={0.2}
            emissive={product.name.includes('E-book') ? '#1e40af' : product.name.includes('Prompts') ? '#5b21b6' : '#047857'}
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* Product title */}
        <Text
          position={[0, 1.8, 0.2]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={3}
          textAlign="center"
        >
          {product.name}
        </Text>
        
        {/* Price display */}
        <Text
          position={[0, -1.8, 0.2]}
          fontSize={0.3}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          ${product.price}
        </Text>
        
        {/* Glowing orbs around the product */}
        <Sphere args={[0.05]} position={[1.5, 1, 0.5]}>
          <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={0.5} />
        </Sphere>
        <Sphere args={[0.03]} position={[-1.2, -0.5, 0.8]}>
          <meshStandardMaterial color="#a78bfa" emissive="#8b5cf6" emissiveIntensity={0.5} />
        </Sphere>
        <Sphere args={[0.04]} position={[0.8, -1.2, -0.5]}>
          <meshStandardMaterial color="#34d399" emissive="#10b981" emissiveIntensity={0.5} />
        </Sphere>
      </Float>
    </group>
  );
}

// Particle background for product scene
function ProductParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = React.useMemo(() => {
    const positions = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={500}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.01}
        color="#60a5fa"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

// Removed FeatureHUD component as features are already stated in product descriptions

// Main Product 3D Component
export default function Product3D({ product, onAddToCart }: Product3DProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Removed hardcoded features as they're already stated in product descriptions

  return (
    <div className="relative h-96 w-full bg-gradient-to-br from-black via-gray-900 to-black rounded-2xl overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        className="absolute inset-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Using a simple background color instead of Environment to avoid compatibility issues */}
        <color attach="background" args={['#000']} />
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          color="#60a5fa"
          castShadow
        />
        <pointLight position={[-5, -5, 5]} color="#8b5cf6" intensity={0.5} />
        
        <ProductCard3D product={product} isHovered={isHovered} />
        <ProductParticles />
      </Canvas>
      
      {/* Feature HUD component has been removed as features are already stated in product descriptions */}
      

      
      {/* Ambient glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-purple-900/20 pointer-events-none"></div>
    </div>
  );
}