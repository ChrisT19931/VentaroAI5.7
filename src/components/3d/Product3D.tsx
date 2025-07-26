'use client';

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Float, Text, Box, Sphere, Environment, useTexture, Plane, RoundedBox } from '@react-three/drei';
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

// Matrix Code Effect for AI Tools
function MatrixCodeEffect({ product, isHovered }: { product: any; isHovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const codeLines = useRef<THREE.Group[]>([]);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      
      // Scale on hover
      const targetScale = isHovered ? 1.1 : 1;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    
    // Animate code lines
    codeLines.current.forEach((line, i) => {
      if (line) {
        line.position.y = Math.sin(state.clock.elapsedTime * 0.8 + i * 0.5) * 0.05;
      }
    });
  });

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.1}>
        {/* Book Base */}
        <mesh castShadow receiveShadow position={[0, 0, 0.05]}>
          <boxGeometry args={[2.2, 3, 0.1]} />
          <meshPhysicalMaterial
            color="#0a0a0a"
            metalness={0.3}
            roughness={0.2}
            emissive="#001122"
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* Matrix Code Streams */}
        {[...Array(8)].map((_, i) => (
          <group key={i} ref={el => { if (el) codeLines.current[i] = el; }}>
            {[...Array(12)].map((_, j) => (
              <Text
                key={j}
                position={[-0.8 + i * 0.2, 1.2 - j * 0.2, 0.11]}
                fontSize={0.06}
                color={`hsl(${200 + Math.sin(j * 0.5) * 20}, 80%, ${60 + Math.sin(j * 0.3) * 20}%)`}
                anchorX="center"
                anchorY="middle"
                font="/fonts/inter-bold.woff"
              >
                {Math.random() > 0.5 ? '1' : '0'}
              </Text>
            ))}
          </group>
        ))}
        
        {/* AI/GPT/CODING Text Overlay */}
        <Text
          position={[0, 0.3, 0.12]}
          fontSize={0.12}
          color="#00aaff"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
          textAlign="center"
          font="/fonts/inter-bold.woff"
        >
          AI • GPT • CODING
        </Text>
        
        {/* Money Symbol */}
        <Text
          position={[0, -0.2, 0.12]}
          fontSize={0.2}
          color="#00ff88"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          $
        </Text>
        
        {/* Price */}
        <Text
          position={[0, -1.2, 0.12]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          ${product.price}
        </Text>
      </Float>
    </group>
  );
}

// Matrix Prompts Effect
function MatrixPromptsEffect({ product, isHovered }: { product: any; isHovered: boolean }) {
  const documentRef = useRef<THREE.Group>(null);
  const promptLines = useRef<THREE.Group[]>([]);
  
  useFrame((state) => {
    if (documentRef.current) {
      // Gentle floating
      documentRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
      
      // Scale on hover
      const targetScale = isHovered ? 1.08 : 1;
      documentRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    
    // Animate prompt lines
    promptLines.current.forEach((line, i) => {
      if (line) {
        line.position.x = Math.sin(state.clock.elapsedTime * 0.6 + i * 0.3) * 0.03;
      }
    });
  });

  return (
    <group ref={documentRef}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.15}>
        {/* Document Base */}
        <mesh castShadow receiveShadow position={[0, 0, 0.05]}>
          <boxGeometry args={[2.4, 3.2, 0.12]} />
          <meshPhysicalMaterial
            color="#0f0f0f"
            metalness={0.4}
            roughness={0.3}
            emissive="#001a33"
            emissiveIntensity={0.15}
          />
        </mesh>
        
        {/* Prompt Code Lines */}
        {[...Array(10)].map((_, i) => (
          <group key={i} ref={el => { if (el) promptLines.current[i] = el; }}>
            {[...Array(6)].map((_, j) => (
              <Text
                key={j}
                position={[-0.9 + j * 0.3, 1.3 - i * 0.25, 0.13]}
                fontSize={0.04}
                color={`hsl(${180 + Math.sin(i * 0.5) * 30}, 70%, ${50 + Math.sin(j * 0.4) * 25}%)`}
                anchorX="center"
                anchorY="middle"
                font="/fonts/inter-bold.woff"
              >
                {Math.random() > 0.3 ? 'PROMPT' : 'AI'}
              </Text>
            ))}
          </group>
        ))}
        
        {/* Central Prompt Symbol */}
        <Text
          position={[0, 0.2, 0.14]}
          fontSize={0.15}
          color="#00ccff"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.2}
          textAlign="center"
          font="/fonts/inter-bold.woff"
        >
          PROMPT • TEMPLATE
        </Text>
        
        {/* Command Symbol */}
        <Text
          position={[0, -0.3, 0.14]}
          fontSize={0.18}
          color="#00ff99"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          {product.name}
        </Text>
        
        {/* Price Display */}
        <Text
          position={[0, -1.4, 0.14]}
          fontSize={0.18}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          ${product.price}
        </Text>
      </Float>
    </group>
  );
}

// System Tapping Visualization for Coaching
function SystemTappingVisualization({ product, isHovered }: { product: any; isHovered: boolean }) {
  const serviceRef = useRef<THREE.Group>(null);
  const networkRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (serviceRef.current) {
      serviceRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
      
      const targetScale = isHovered ? 1.05 : 1;
      serviceRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
    }
    
    if (networkRef.current) {
      networkRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      networkRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.15) * 0.05;
    }
    
    if (pulseRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 1;
      pulseRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={serviceRef}>
      <Float speed={0.8} rotationIntensity={0.05} floatIntensity={0.2}>
        {/* Central System Core */}
        <mesh castShadow receiveShadow>
          <octahedronGeometry args={[0.9, 2]} />
          <meshPhysicalMaterial
            color="#000000"
            metalness={0.9}
            roughness={0.1}
            emissive="#ff0066"
            emissiveIntensity={0.3}
            clearcoat={1}
          />
        </mesh>
        
        {/* Pulsing Energy Ring */}
        <group ref={pulseRef}>
          <mesh>
            <torusGeometry args={[1.2, 0.05, 8, 32]} />
            <meshPhysicalMaterial
              color="#ff0066"
              emissive="#ff0066"
              emissiveIntensity={0.8}
              transparent
              opacity={0.7}
            />
          </mesh>
        </group>
        
        {/* Network Connection Nodes */}
        <group ref={networkRef}>
          {[...Array(8)].map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const radius = 2;
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(angle) * radius,
                  Math.sin(angle * 0.3) * 0.3,
                  Math.sin(angle) * radius
                ]}
                castShadow
              >
                <icosahedronGeometry args={[0.08, 1]} />
                <meshPhysicalMaterial
                  color={i % 3 === 0 ? "#00ffcc" : i % 3 === 1 ? "#ff0066" : "#ffcc00"}
                  metalness={0.7}
                  roughness={0.3}
                  emissive={i % 3 === 0 ? "#00aa88" : i % 3 === 1 ? "#cc0044" : "#cc9900"}
                  emissiveIntensity={0.6}
                />
              </mesh>
            );
          })}
        </group>
        
        {/* System Access Text */}
        <Text
          position={[0, -1.5, 0]}
          fontSize={0.12}
          color="#00ffcc"
          anchorX="center"
          anchorY="middle"
          maxWidth={3}
          textAlign="center"
          font="/fonts/inter-bold.woff"
        >
          SYSTEM • ACCESS • COACHING
        </Text>
        
        {/* Price */}
        <Text
          position={[0, -1.8, 0]}
          fontSize={0.18}
          color="#ffd700"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          ${product.price}
        </Text>
      </Float>
    </group>
  );
}

// Smart Product Renderer
function ProductCard3D({ product, isHovered }: { product: any; isHovered: boolean }) {
  const productType = useMemo(() => {
    const name = product.name.toLowerCase();
    if (name.includes('tools') || name.includes('mastery')) {
      return 'matrix-code'; // AI Tools get matrix coding effect
    } else if (name.includes('prompts') || name.includes('arsenal')) {
      return 'matrix-prompts'; // Prompts get matrix prompts effect
    } else if (name.includes('session') || name.includes('consultation') || name.includes('strategy')) {
      return 'system-tapping'; // Coaching gets system tapping effect
    }
    return 'matrix-prompts'; // Default to prompts style
  }, [product.name]);

  switch (productType) {
    case 'matrix-code':
      return <MatrixCodeEffect product={product} isHovered={isHovered} />;
    case 'system-tapping':
      return <SystemTappingVisualization product={product} isHovered={isHovered} />;
    default:
      return <MatrixPromptsEffect product={product} isHovered={isHovered} />;
  }
}

// Subtle particle background with reduced intensity
function ProductParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const dustRef = useRef<THREE.Points>(null);
  
  const particles = React.useMemo(() => {
    const positions = new Float32Array(80 * 3);
    for (let i = 0; i < 80; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return positions;
  }, []);
  
  const dustParticles = React.useMemo(() => {
    const positions = new Float32Array(150 * 3);
    for (let i = 0; i < 150; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.008;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.005) * 0.05;
    }
    if (dustRef.current) {
      dustRef.current.rotation.y = -state.clock.elapsedTime * 0.003;
    }
  });

  return (
    <>
      {/* Main particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={80}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.01}
          color="#ffffff"
          transparent
          opacity={0.3}
          sizeAttenuation
        />
      </points>
      
      {/* Dust particles */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={150}
            array={dustParticles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.003}
          color="#666666"
          transparent
          opacity={0.1}
          sizeAttenuation
        />
      </points>
    </>
  );
}

// Subtle lighting setup
function StudioLighting() {
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const fillLightRef = useRef<THREE.DirectionalLight>(null);
  
  useFrame((state) => {
    if (keyLightRef.current) {
      keyLightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.05) * 1 + 3;
      keyLightRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.05) * 1 + 3;
    }
  });
  
  return (
    <>
      {/* Key Light */}
      <directionalLight
        ref={keyLightRef}
        position={[5, 8, 5]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Fill Light */}
      <directionalLight
        ref={fillLightRef}
        position={[-3, 4, -2]}
        intensity={0.4}
        color="#4a90e2"
      />
      
      {/* Rim Light */}
      <directionalLight
        position={[0, -5, -8]}
        intensity={0.6}
        color="#ffffff"
      />
      
      {/* Ambient Light */}
      <ambientLight intensity={0.4} color="#404040" />
      
      {/* Point Lights for Drama */}
      <pointLight position={[10, 10, 10]} intensity={0.2} color="#00ff88" />
      <pointLight position={[-10, -10, -10]} intensity={0.15} color="#ff6b6b" />
    </>
  );
}

// Removed FeatureHUD component as features are already stated in product descriptions

// Main Product 3D Component
export default function Product3D({ product, onAddToCart }: Product3DProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative h-[450px] w-full overflow-hidden rounded-2xl" style={{
      background: 'linear-gradient(135deg, #0a0a15 0%, #12121a 50%, #0f1419 100%)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        className="absolute inset-0"
        gl={{ 
          antialias: true, 
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        dpr={[1, 2]}
        shadows={{ enabled: true, type: THREE.PCFSoftShadowMap }}
      >
        <StudioLighting />
        <ProductCard3D product={product} isHovered={isHovered} />
        <ProductParticles />
        <Environment preset="studio" background={false} />
        
        {/* Ground plane for shadows */}
        <mesh receiveShadow position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshPhysicalMaterial
            color="#000000"
            metalness={0.1}
            roughness={0.9}
            transparent
            opacity={0.1}
          />
        </mesh>
      </Canvas>

      {/* Enhanced interactive overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 flex items-center justify-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          className="absolute bottom-8 left-0 right-0 mx-auto w-56"
        >
          <button
            onClick={onAddToCart}
            className="group relative w-full py-4 px-6 text-base font-black text-black bg-white rounded-xl transition-all duration-500 transform hover:bg-gray-100 shadow-2xl overflow-hidden"
            style={{
              boxShadow: '0 20px 40px rgba(255, 255, 255, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2)',
              fontFamily: 'Inter, system-ui, sans-serif',
              letterSpacing: '-0.02em'
            }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white via-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            <span className="relative z-10 flex items-center justify-center">
              ADD TO CART
              <svg className="ml-3 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
        </motion.div>
        
        {/* Product info overlay */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
          className="absolute top-6 left-6 right-6 backdrop-blur-sm bg-black/40 rounded-xl p-4 border border-white/10"
        >
          <h3 className="text-white font-bold text-lg mb-1">{product.name}</h3>
          <p className="text-gray-300 text-sm opacity-90">Premium Digital Product</p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-2xl font-black text-white">${product.price}</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-semibold">Available Now</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}