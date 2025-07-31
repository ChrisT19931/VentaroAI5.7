'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Simple, clean star background
function BackgroundStars() {
  const starsRef = useRef<THREE.Points>(null);
  
  const starField = useMemo(() => {
    const positions = new Float32Array(800 * 3);
    const colors = new Float32Array(800 * 3);
    
    for (let i = 0; i < 800; i++) {
      // Simple random distribution
      const radius = Math.random() * 400 + 100;
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * Math.PI * 2;
      
      positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(theta);
      
      // Simple white stars with slight variation
      const brightness = 0.7 + Math.random() * 0.3;
      colors[i * 3] = brightness;
      colors[i * 3 + 1] = brightness;
      colors[i * 3 + 2] = brightness;
    }
     
    return { positions, colors };
  }, []);
  
  // Simple gentle rotation - no complex movement
  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={starField.positions.length / 3}
          array={starField.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={starField.colors.length / 3}
          array={starField.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.8}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  );
}

// Simple camera with minimal movement
function Scene() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  useFrame((state) => {
    if (cameraRef.current) {
      // Very subtle camera movement
      const time = state.clock.elapsedTime;
      cameraRef.current.position.x = Math.sin(time * 0.1) * 2;
      cameraRef.current.position.y = Math.cos(time * 0.15) * 1;
      cameraRef.current.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      <perspectiveCamera
        ref={cameraRef}
        position={[0, 0, 50]}
        fov={75}
        near={0.1}
        far={1000}
      />
      
      {/* Simple ambient lighting */}
      <ambientLight intensity={0.3} />
      
      {/* Clean star field */}
      <BackgroundStars />
    </>
  );
}

// Main component with option to disable stars entirely
interface StarBackgroundProps {
  enabled?: boolean;
  simple?: boolean;
}

export default function StarBackground({ enabled = true, simple = false }: StarBackgroundProps) {
  // Option 1: No background (black)
  if (!enabled) {
    return (
      <div className="fixed inset-0 bg-black z-0" />
    );
  }
  
  // Option 2: Very simple background
  if (simple) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-gray-900 to-black z-0">
        <div className="absolute inset-0 opacity-30">
          {/* Simple CSS stars */}
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    );
  }
  
  // Option 3: 3D star background (current)
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 50], fov: 75 }}
        style={{ background: 'linear-gradient(to bottom, #0a0a0a, #000000)' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}