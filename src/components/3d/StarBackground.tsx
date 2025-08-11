'use client';

import { useRef, useMemo, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Simple, clean star background - optimized for performance
const BackgroundStars = memo(function BackgroundStars() {
  const starsRef = useRef<THREE.Points>(null);
  const frameCount = useRef(0);
  
  const starField = useMemo(() => {
    // Reduced from 800 to 600 stars for better performance
    const positions = new Float32Array(600 * 3);
    const colors = new Float32Array(600 * 3);
    
    for (let i = 0; i < 600; i++) {
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
  
  // Simple gentle rotation - optimized with frame skipping
  useFrame((state) => {
    // Performance optimization: Only update every 2 frames
    frameCount.current += 1;
    if (frameCount.current % 2 !== 0) return;
    
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.01; // Reduced rotation speed
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
})

// Simple camera with minimal movement - optimized for performance
const Scene = memo(function Scene() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const frameCount = useRef(0);
  
  useFrame((state) => {
    // Performance optimization: Only update camera every 3 frames
    frameCount.current += 1;
    if (frameCount.current % 3 !== 0) return;
    
    if (cameraRef.current) {
      // Very subtle camera movement - reduced frequency
      const time = state.clock.elapsedTime;
      cameraRef.current.position.x = Math.sin(time * 0.05) * 1.5; // Reduced movement
      cameraRef.current.position.y = Math.cos(time * 0.08) * 0.8; // Reduced movement
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
})

// Main component with option to disable stars entirely - optimized for performance
interface StarBackgroundProps {
  enabled?: boolean;
  simple?: boolean;
}

// Performance optimization: Memoize the CSS stars to prevent re-renders
const CssStars = memo(() => {
  // Memoize the stars array
  const stars = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${2 + Math.random() * 2}s`
    }));
  }, []);
  
  return (
    <div className="absolute inset-0 opacity-30">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
          style={{
            left: star.left,
            top: star.top,
            animationDelay: star.animationDelay,
            animationDuration: star.animationDuration
          }}
        />
      ))}
    </div>
  );
});

// Performance optimization: Memoize the Canvas configuration
const canvasConfig = {
  camera: { position: [0, 0, 50] as [number, number, number], fov: 75 },
  style: { background: 'linear-gradient(to bottom, #0a0a0a, #000000)' },
  dpr: [1, 2] as [number, number], // Limit pixel ratio for performance
  gl: {
    antialias: true,
    powerPreference: 'high-performance',
    depth: false, // Disable depth testing for transparent objects
    stencil: false // Disable stencil buffer when not needed
  }
};

const StarBackground = memo(function StarBackground({ enabled = true, simple = false }: StarBackgroundProps) {
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
        <CssStars />
      </div>
    );
  }
  
  // Option 3: 3D star background (current)
  return (
    <div className="fixed inset-0 z-0">
      <Canvas {...canvasConfig}>
        <Scene />
      </Canvas>
    </div>
  );
});

export default StarBackground;