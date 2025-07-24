'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Float, Environment, Sparkles, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import Link from 'next/link';
import * as THREE from 'three';
import System, {
  Emitter,
  Rate,
  Span,
  Position,
  Mass,
  Radius,
  Life,
  PointZone,
  SphereZone,
  Vector3D,
  Alpha,
  Scale,
  Color,
  Force,
  SpriteRenderer,
  RadialVelocity
} from 'three-nebula';

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

// Removed BlackHole component as requested

// Animated 3D logo with smooth entrance effect
const AnimatedLogo = () => {
  const logoRef = useRef<THREE.Group>(null);
  const [introPhase, setIntroPhase] = useState(true);
  
  useFrame((state) => {
    if (logoRef.current) {
      const time = state.clock.elapsedTime;
      
      if (time < 5) { // During the 5-second intro animation
        // Calculate progress through the intro
        const progress = time / 5;
        
        // Smooth entrance from distance without shaking
        logoRef.current.position.z = THREE.MathUtils.lerp(30, 0, Math.min(1, progress * 1.2));
        
        // Very subtle movement for elegance, not shaking
        logoRef.current.position.x = Math.sin(time * 0.8) * 0.2;
        logoRef.current.position.y = Math.cos(time * 0.6) * 0.15;
        
        // Gentle rotation for professional appearance
        logoRef.current.rotation.y = Math.sin(time * 0.5) * 0.2;
        
        // Smooth scaling without variation
        const scaleBase = THREE.MathUtils.lerp(0.5, 1.0, Math.min(1, progress * 1.5));
        logoRef.current.scale.setScalar(scaleBase);
      } else {
        // After 5 seconds, stabilize logo
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

// Advanced cosmic particle system using three-nebula
function CosmicParticleSystem() {
  const systemRef = useRef<any>(null);
  const { scene } = useThree();

  useEffect(() => {
    if (!scene) return;

    // Create the advanced particle system
    const system = new System(THREE);
    const renderer = new SpriteRenderer(scene, THREE);

    // Stellar nursery emitter - creates realistic star birth regions
    const stellarNursery = new Emitter();
    stellarNursery
      .setRate(new Rate(new Span(30, 60), new Span(0.1, 0.3)))
      .setInitializers([
        new Position(new SphereZone(0, 0, 0, 25)),
        new Mass(1),
        new Radius(0.1, 0.5),
        new Life(15, 30),
        new RadialVelocity(2, new Vector3D(0, 1, 0), 360)
      ])
      .setBehaviours([
        new Alpha(0.9, 0.1),
        new Scale(0.3, 1.8),
        new Color(
          new THREE.Color('#ffffff'),
          new THREE.Color('#87ceeb'),
          new THREE.Color('#ffd700'),
          new THREE.Color('#ff6b6b')
        ),
        new Force(0, 0.02, 0)
      ]);

    // Nebula gas clouds emitter
    const nebulaGas = new Emitter();
    nebulaGas
      .setRate(new Rate(new Span(40, 80), new Span(0.05, 0.15)))
      .setInitializers([
        new Position(new SphereZone(0, 0, 0, 35)),
        new Mass(0.8),
        new Radius(0.8, 3.0),
        new Life(25, 50),
        new RadialVelocity(0.1, new Vector3D(0, 1, 0), 360)
      ])
      .setBehaviours([
        new Alpha(0.4, 0.0),
        new Scale(1.5, 6.0),
        new Color(
          new THREE.Color('#ff1493'), // Deep pink (H-alpha)
          new THREE.Color('#00ced1'), // Dark turquoise (OIII)
          new THREE.Color('#9370db'), // Medium purple
          new THREE.Color('#ff69b4')  // Hot pink
        ),
        new Force(0.05, 0.05, 0.05)
      ]);

    // Cosmic dust and distant galaxies
    const cosmicDust = new Emitter();
    cosmicDust
      .setRate(new Rate(new Span(100, 200), new Span(0.2, 0.6)))
      .setInitializers([
        new Position(new SphereZone(0, 0, 0, 50)),
        new Mass(0.3),
        new Radius(0.02, 0.15),
        new Life(30, 60),
        new RadialVelocity(0.05, new Vector3D(0, 1, 0), 360)
      ])
      .setBehaviours([
        new Alpha(0.6, 0.0),
        new Scale(0.1, 0.8),
        new Color(
          new THREE.Color('#f0f8ff'), // Alice blue
          new THREE.Color('#e6e6fa'), // Lavender
          new THREE.Color('#fffacd')  // Lemon chiffon
        )
      ]);

    // Quasar jets and high-energy phenomena
    const quasarJets = new Emitter();
    quasarJets
      .setRate(new Rate(new Span(15, 30), new Span(0.08, 0.2)))
      .setInitializers([
        new Position(new PointZone(0, 0, 0)),
        new Mass(2),
        new Radius(0.3, 1.2),
        new Life(20, 40),
        new RadialVelocity(8, new Vector3D(0, 1, 0), 45)
      ])
      .setBehaviours([
        new Alpha(1.0, 0.2),
        new Scale(0.5, 2.5),
        new Color(
          new THREE.Color('#00bfff'), // Deep sky blue
          new THREE.Color('#1e90ff'), // Dodger blue
          new THREE.Color('#ffffff')  // White
        ),
        new Force(0, 0.1, 0)
      ]);

    // Supernova remnants
    const supernovaRemnants = new Emitter();
    supernovaRemnants
      .setRate(new Rate(new Span(20, 40), new Span(0.03, 0.1)))
      .setInitializers([
        new Position(new SphereZone(0, 0, 0, 30)),
        new Mass(1.5),
        new Radius(0.5, 2.5),
        new Life(35, 70),
        new RadialVelocity(12, new Vector3D(0, 0, 1), 180)
      ])
      .setBehaviours([
        new Alpha(0.8, 0.0),
        new Scale(2.0, 8.0),
        new Color(
          new THREE.Color('#ff4500'), // Orange red
          new THREE.Color('#ff6347'), // Tomato
          new THREE.Color('#ffd700'), // Gold
          new THREE.Color('#ff1493')  // Deep pink
        ),
        new Force(0.02, 0.02, 0.02)
      ]);

    // Add all emitters to the system
    system
      .addEmitter(stellarNursery)
      .addEmitter(nebulaGas)
      .addEmitter(cosmicDust)
      .addEmitter(quasarJets)
      .addEmitter(supernovaRemnants)
      .addRenderer(renderer);

    // Start the particle system with required hooks
    system.emit({
      onStart: () => {
        console.log('Particle system started');
      },
      onUpdate: () => {
        // Optional update callback
      },
      onEnd: () => {
        console.log('Particle system ended');
      }
    });
    systemRef.current = system;

    return () => {
      if (systemRef.current) {
        systemRef.current.destroy();
      }
    };
  }, [scene]);

  useFrame((state, delta) => {
    if (systemRef.current) {
      systemRef.current.update(delta);
    }
  });

  return null;
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
      
      if (time < 5) {
        // During intro phase: gentle star movement without streaking/shaking
        const progress = time / 5;
        
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
        const returnProgress = Math.min((time - 5) / 2, 1); // 2 second return
        
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
          count={5000}
          array={starField.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={5000}
          array={starField.colors}
          itemSize={3}
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
      
      if (time < 5) {
        // During intro phase: smooth camera movement without shaking
        const progress = time / 5;
        
        // Subtle, professional camera movement
        const smoothX = Math.sin(time * 0.3) * 0.2;
        const smoothY = Math.cos(time * 0.2) * 0.1;
        
        // Gentle forward motion - camera starts back and moves forward
        const zPosition = THREE.MathUtils.lerp(20, 15, Math.min(1, progress));
        
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
      <CosmicParticleSystem />
      <BackgroundStars />
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