'use client';

import { useRef, useMemo, memo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Shooting Stars Component
const ShootingStars = memo(function ShootingStars() {
  const groupRef = useRef<THREE.Group>(null);
  const shootingStarsRef = useRef<THREE.Points[]>([]);
  
  const shootingStarData = useMemo(() => {
    const stars = [];
    for (let i = 0; i < 8; i++) {
      const positions = new Float32Array(50 * 3);
      const colors = new Float32Array(50 * 3);
      
      // Create trail effect
      for (let j = 0; j < 50; j++) {
        const progress = j / 49;
        positions[j * 3] = -progress * 200;
        positions[j * 3 + 1] = 0;
        positions[j * 3 + 2] = 0;
        
        const alpha = 1 - progress;
        colors[j * 3] = 1;
        colors[j * 3 + 1] = 0.8 + Math.random() * 0.2;
        colors[j * 3 + 2] = 0.6 + Math.random() * 0.4;
      }
      
      stars.push({
        positions,
        colors,
        startTime: Math.random() * 10,
        duration: 3 + Math.random() * 2,
        startPosition: {
          x: (Math.random() - 0.5) * 400,
          y: (Math.random() - 0.5) * 200,
          z: (Math.random() - 0.5) * 300
        },
        direction: {
          x: 0.5 + Math.random() * 0.5,
          y: (Math.random() - 0.5) * 0.3,
          z: (Math.random() - 0.5) * 0.2
        }
      });
    }
    return stars;
  }, []);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    
    shootingStarsRef.current.forEach((star, index) => {
      if (!star) return;
      
      const data = shootingStarData[index];
      const elapsed = (state.clock.elapsedTime - data.startTime) % (data.duration + 5);
      
      if (elapsed > 0 && elapsed < data.duration) {
        const progress = elapsed / data.duration;
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        star.position.set(
          data.startPosition.x + data.direction.x * easeProgress * 300,
          data.startPosition.y + data.direction.y * easeProgress * 300,
          data.startPosition.z + data.direction.z * easeProgress * 300
        );
        
        star.rotation.z = Math.atan2(data.direction.y, data.direction.x);
        star.visible = true;
        
        // Fade effect
        if (star.material instanceof THREE.PointsMaterial) {
          star.material.opacity = Math.sin(progress * Math.PI) * 0.8;
        }
      } else {
        star.visible = false;
      }
    });
  });
  
  return (
    <group ref={groupRef}>
      {shootingStarData.map((data, index) => (
        <points
          key={index}
          ref={(ref) => {
            if (ref) shootingStarsRef.current[index] = ref;
          }}
        >
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={data.positions.length / 3}
              array={data.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={data.colors.length / 3}
              array={data.colors}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={2}
            vertexColors
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </points>
      ))}
    </group>
  );
});

// Enhanced Star Field with multiple layers
const EnhancedStarField = memo(function EnhancedStarField() {
  const starLayers = useRef<THREE.Points[]>([]);
  
  const starData = useMemo(() => {
    const layers = [];
    
    // Layer 1: Distant stars
    const distantStars = {
      positions: new Float32Array(1000 * 3),
      colors: new Float32Array(1000 * 3),
      sizes: new Float32Array(1000)
    };
    
    for (let i = 0; i < 1000; i++) {
      const radius = 300 + Math.random() * 200;
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * Math.PI * 2;
      
      distantStars.positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
      distantStars.positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      distantStars.positions[i * 3 + 2] = radius * Math.cos(theta);
      
      const brightness = 0.3 + Math.random() * 0.4;
      const colorType = Math.random();
      
      if (colorType < 0.7) {
        // White/blue stars
        distantStars.colors[i * 3] = brightness;
        distantStars.colors[i * 3 + 1] = brightness;
        distantStars.colors[i * 3 + 2] = brightness + 0.2;
      } else if (colorType < 0.9) {
        // Orange/red stars
        distantStars.colors[i * 3] = brightness + 0.3;
        distantStars.colors[i * 3 + 1] = brightness * 0.7;
        distantStars.colors[i * 3 + 2] = brightness * 0.5;
      } else {
        // Purple/pink stars
        distantStars.colors[i * 3] = brightness + 0.2;
        distantStars.colors[i * 3 + 1] = brightness * 0.6;
        distantStars.colors[i * 3 + 2] = brightness + 0.3;
      }
      
      distantStars.sizes[i] = 0.5 + Math.random() * 1.5;
    }
    
    // Layer 2: Medium stars
    const mediumStars = {
      positions: new Float32Array(500 * 3),
      colors: new Float32Array(500 * 3),
      sizes: new Float32Array(500)
    };
    
    for (let i = 0; i < 500; i++) {
      const radius = 150 + Math.random() * 150;
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * Math.PI * 2;
      
      mediumStars.positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
      mediumStars.positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      mediumStars.positions[i * 3 + 2] = radius * Math.cos(theta);
      
      const brightness = 0.5 + Math.random() * 0.5;
      mediumStars.colors[i * 3] = brightness;
      mediumStars.colors[i * 3 + 1] = brightness * 0.9;
      mediumStars.colors[i * 3 + 2] = brightness + 0.1;
      
      mediumStars.sizes[i] = 1 + Math.random() * 2;
    }
    
    // Layer 3: Bright foreground stars
    const brightStars = {
      positions: new Float32Array(200 * 3),
      colors: new Float32Array(200 * 3),
      sizes: new Float32Array(200)
    };
    
    for (let i = 0; i < 200; i++) {
      const radius = 50 + Math.random() * 100;
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * Math.PI * 2;
      
      brightStars.positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
      brightStars.positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      brightStars.positions[i * 3 + 2] = radius * Math.cos(theta);
      
      const brightness = 0.8 + Math.random() * 0.2;
      brightStars.colors[i * 3] = brightness;
      brightStars.colors[i * 3 + 1] = brightness;
      brightStars.colors[i * 3 + 2] = brightness;
      
      brightStars.sizes[i] = 2 + Math.random() * 3;
    }
    
    return [distantStars, mediumStars, brightStars];
  }, []);
  
  useFrame((state) => {
    starLayers.current.forEach((layer, index) => {
      if (layer) {
        const speed = (index + 1) * 0.002;
        layer.rotation.y = state.clock.elapsedTime * speed;
        layer.rotation.x = Math.sin(state.clock.elapsedTime * 0.001) * 0.1;
      }
    });
  });
  
  return (
    <>
      {starData.map((data, index) => (
        <points
          key={index}
          ref={(ref) => {
            if (ref) starLayers.current[index] = ref;
          }}
        >
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={data.positions.length / 3}
              array={data.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={data.colors.length / 3}
              array={data.colors}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-size"
              count={data.sizes.length}
              array={data.sizes}
              itemSize={1}
            />
          </bufferGeometry>
          <pointsMaterial
            size={1}
            vertexColors
            transparent
            opacity={index === 0 ? 0.6 : index === 1 ? 0.8 : 1}
            sizeAttenuation={true}
            blending={THREE.AdditiveBlending}
          />
        </points>
      ))}
    </>
  );
});

// Nebula Cloud Effect
const NebulaCloud = memo(function NebulaCloud() {
  const cloudRef = useRef<THREE.Points>(null);
  
  const cloudData = useMemo(() => {
    const positions = new Float32Array(300 * 3);
    const colors = new Float32Array(300 * 3);
    const sizes = new Float32Array(300);
    
    for (let i = 0; i < 300; i++) {
      // Create cloud-like distribution
      const radius = 100 + Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.3;
      
      positions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(phi) * 50;
      positions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);
      
      // Nebula colors (purple, blue, pink)
      const colorType = Math.random();
      if (colorType < 0.4) {
        colors[i * 3] = 0.4 + Math.random() * 0.3; // Red
        colors[i * 3 + 1] = 0.1 + Math.random() * 0.2; // Green
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2; // Blue
      } else if (colorType < 0.7) {
        colors[i * 3] = 0.6 + Math.random() * 0.4; // Red
        colors[i * 3 + 1] = 0.2 + Math.random() * 0.3; // Green
        colors[i * 3 + 2] = 0.9; // Blue
      } else {
        colors[i * 3] = 0.8 + Math.random() * 0.2; // Red
        colors[i * 3 + 1] = 0.3 + Math.random() * 0.2; // Green
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2; // Blue
      }
      
      sizes[i] = 5 + Math.random() * 15;
    }
    
    return { positions, colors, sizes };
  }, []);
  
  useFrame((state) => {
    if (cloudRef.current) {
      cloudRef.current.rotation.y = state.clock.elapsedTime * 0.001;
      cloudRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.0005) * 0.1;
    }
  });
  
  return (
    <points ref={cloudRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={cloudData.positions.length / 3}
          array={cloudData.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={cloudData.colors.length / 3}
          array={cloudData.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={cloudData.sizes.length}
          array={cloudData.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={10}
        vertexColors
        transparent
        opacity={0.3}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
});

// Cosmic Dust Particles
const CosmicDust = memo(function CosmicDust() {
  const dustRef = useRef<THREE.Points>(null);
  
  const dustData = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    const colors = new Float32Array(2000 * 3);
    
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 800;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 600;
      
      const brightness = 0.1 + Math.random() * 0.3;
      colors[i * 3] = brightness;
      colors[i * 3 + 1] = brightness * 0.9;
      colors[i * 3 + 2] = brightness + 0.1;
    }
    
    return { positions, colors };
  }, []);
  
  useFrame((state) => {
    if (dustRef.current) {
      dustRef.current.rotation.y = state.clock.elapsedTime * 0.0005;
      dustRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.0003) * 10;
    }
  });
  
  return (
    <points ref={dustRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={dustData.positions.length / 3}
          array={dustData.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={dustData.colors.length / 3}
          array={dustData.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        vertexColors
        transparent
        opacity={0.4}
        sizeAttenuation={true}
      />
    </points>
  );
});

// Main Scene Component
const CinematicScene = memo(function CinematicScene() {
  const { camera } = useThree();
  
  useFrame((state) => {
    // Subtle camera movement for cinematic effect
    const time = state.clock.elapsedTime;
    camera.position.x = Math.sin(time * 0.02) * 2;
    camera.position.y = Math.cos(time * 0.015) * 1;
    camera.position.z = 50 + Math.sin(time * 0.01) * 5;
    camera.lookAt(0, 0, 0);
  });
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <directionalLight
        position={[100, 100, 50]}
        intensity={0.5}
        color="#4a90e2"
      />
      <pointLight
        position={[-50, 30, 20]}
        intensity={0.3}
        color="#8b5cf6"
      />
      <pointLight
        position={[50, -30, -20]}
        intensity={0.2}
        color="#ec4899"
      />
      
      {/* Space Elements */}
      <CosmicDust />
      <NebulaCloud />
      <EnhancedStarField />
      <ShootingStars />
    </>
  );
});

// Main Component
interface CinematicSpaceBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  enableShootingStars?: boolean;
  enableNebula?: boolean;
}

const CinematicSpaceBackground = memo(function CinematicSpaceBackground({
  intensity = 'high',
  enableShootingStars = true,
  enableNebula = true
}: CinematicSpaceBackgroundProps) {
  const canvasConfig = useMemo(() => ({
    camera: { position: [0, 0, 50] as [number, number, number], fov: 75 },
    style: { 
      background: 'radial-gradient(ellipse at center, #0a0a1a 0%, #000000 70%, #000000 100%)'
    },
    dpr: [1, 2] as [number, number],
    gl: {
      antialias: true,
      powerPreference: 'high-performance' as const,
      alpha: true,
      premultipliedAlpha: false
    }
  }), []);
  
  if (intensity === 'low') {
    return (
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-black" />
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 100 }).map((_, i) => (
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
  
  return (
    <div className="fixed inset-0 z-0">
      <Canvas {...canvasConfig}>
        <CinematicScene />
      </Canvas>
      
      {/* CSS Overlay for additional atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/5 via-transparent to-blue-900/5" />
      </div>
    </div>
  );
});

export default CinematicSpaceBackground;