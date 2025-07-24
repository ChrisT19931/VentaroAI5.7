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
      // Slow rotation - made slightly faster
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.4;
      
      // Floating animation - made slightly faster
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.0) * 0.1;
      
      // Scale on hover - made more responsive
      const targetScale = isHovered ? 1.1 : 1;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
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

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-xl glass-panel">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        className="absolute inset-0"
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#60a5fa" />
        <pointLight position={[-5, -5, -5]} color="#8b5cf6" intensity={0.8} />
        <ProductCard3D product={product} isHovered={isHovered} />
        <ProductParticles />
        <Environment preset="city" />
      </Canvas>

      {/* Interactive overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }} // Faster animation
        className="absolute inset-0 flex items-center justify-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }} // Faster animation
          className="absolute bottom-6 left-0 right-0 mx-auto w-48"
        >
          <button
            onClick={onAddToCart}
            className="neon-button w-full py-3 text-sm font-semibold"
          >
            Add to Cart
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}