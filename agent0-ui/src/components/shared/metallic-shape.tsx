'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

/*
 * Agent-0 3D Visual Element
 * 
 * Design concept:
 * - Central ring/torus represents the "0" in Agent-0
 * - Orbiting particles represent data points and decisions flowing through the system
 * - The ring tilts gracefully, symbolizing the weighing of decisions
 * - Particles orbit at different speeds, representing various data streams
 *   converging into executive insights
 */

// The "0" - Core decision ring
function DecisionRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  
  useFrame((state) => {
    if (ringRef.current) {
      // Gentle tilt animation - like weighing decisions
      ringRef.current.rotation.x = Math.PI * 0.15 + Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
      ringRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  const scale = Math.min(viewport.width, viewport.height) * 0.28;

  return (
    <mesh ref={ringRef} scale={scale}>
      <torusGeometry args={[1, 0.12, 64, 128]} />
      <meshStandardMaterial
        color="#7C3AED"
        metalness={1}
        roughness={0.08}
        envMapIntensity={2}
      />
    </mesh>
  );
}

// Orbiting data particles - representing information flow
function DataParticles() {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  
  // Create particle positions on orbital paths
  const particles = useMemo(() => {
    const items = [];
    const count = 8;
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 1.3 + (i % 3) * 0.15; // Slightly varied orbits
      const speed = 0.3 + (i % 2) * 0.15; // Varied speeds
      const size = 0.04 + Math.random() * 0.03;
      const yOffset = (Math.random() - 0.5) * 0.3;
      
      items.push({ angle, radius, speed, size, yOffset, index: i });
    }
    return items;
  }, []);

  const scale = Math.min(viewport.width, viewport.height) * 0.28;

  useFrame((state) => {
    if (groupRef.current) {
      // Rotate the entire particle system
      groupRef.current.rotation.x = Math.PI * 0.15 + Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      
      // Animate each particle along its orbit
      groupRef.current.children.forEach((child, i) => {
        const particle = particles[i];
        if (particle) {
          const currentAngle = particle.angle + state.clock.elapsedTime * particle.speed;
          child.position.x = Math.cos(currentAngle) * particle.radius;
          child.position.z = Math.sin(currentAngle) * particle.radius;
          child.position.y = particle.yOffset + Math.sin(currentAngle * 2) * 0.05;
        }
      });
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {particles.map((particle, i) => (
        <mesh key={i} position={[particle.radius, particle.yOffset, 0]}>
          <sphereGeometry args={[particle.size, 16, 16]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#06B6D4" : "#8B5CF6"}
            metalness={0.9}
            roughness={0.1}
            emissive={i % 2 === 0 ? "#06B6D4" : "#8B5CF6"}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

// Inner core - representing the AI "agent" at the center
function AgentCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  
  useFrame((state) => {
    if (coreRef.current) {
      // Subtle pulse effect
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
      coreRef.current.scale.setScalar(pulse);
      coreRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  const scale = Math.min(viewport.width, viewport.height) * 0.28 * 0.15;

  return (
    <mesh ref={coreRef} scale={scale}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#E0E7FF"
        metalness={0.95}
        roughness={0.05}
        emissive="#6366F1"
        emissiveIntensity={0.2}
        envMapIntensity={3}
      />
    </mesh>
  );
}

// Complete Agent-0 symbol
function Agent0Symbol() {
  return (
    <Float
      speed={0.3}
      rotationIntensity={0.02}
      floatIntensity={0.1}
    >
      <group>
        <DecisionRing />
        <DataParticles />
        <AgentCore />
      </group>
    </Float>
  );
}

interface MetallicShapeProps {
  variant?: 'agent0' | 'ring' | 'core';
  className?: string;
  opacity?: number;
}

export function MetallicShape({ 
  variant = 'agent0', 
  className = '',
  opacity = 0.6
}: MetallicShapeProps) {
  return (
    <div className={`pointer-events-none ${className}`} style={{ opacity }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <pointLight position={[-5, -5, -5]} intensity={0.4} color="#06B6D4" />
        <pointLight position={[5, -5, 5]} intensity={0.3} color="#8B5CF6" />
        
        <Environment preset="studio" />
        
        <Agent0Symbol />
      </Canvas>
    </div>
  );
}

export function MetallicBackground({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0.5, 5], fov: 40 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 5, 5]} intensity={1.3} />
        <directionalLight position={[-5, 3, -5]} intensity={0.4} color="#ffffff" />
        <pointLight position={[-4, -4, -4]} intensity={0.25} color="#06B6D4" />
        <pointLight position={[4, -4, 4]} intensity={0.35} color="#8B5CF6" />
        
        <Environment preset="studio" />
        
        <Agent0Symbol />
      </Canvas>
    </div>
  );
}

/*
 * Small AI Assistant Orb
 * A subtle pulsing metallic orb representing the AI assistant
 * Perfect for chat interfaces and smaller UI elements
 */
function AIOrb() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating motion
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
    if (coreRef.current) {
      // Subtle pulse
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
      coreRef.current.scale.setScalar(pulse);
    }
    if (ringRef.current) {
      // Ring rotation
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.15;
    }
  });

  const scale = Math.min(viewport.width, viewport.height) * 0.4;

  return (
    <Float speed={0.5} rotationIntensity={0.02} floatIntensity={0.08}>
      <group ref={groupRef} scale={scale}>
        {/* Core sphere */}
        <mesh ref={coreRef}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial
            color="#E0E7FF"
            metalness={0.95}
            roughness={0.05}
            emissive="#6366F1"
            emissiveIntensity={0.15}
            envMapIntensity={2.5}
          />
        </mesh>
        
        {/* Orbital ring */}
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.025, 32, 64]} />
          <meshStandardMaterial
            color="#8B5CF6"
            metalness={1}
            roughness={0.05}
            envMapIntensity={2}
          />
        </mesh>
        
        {/* Small orbiting particles */}
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i / 3) * Math.PI * 2) * 0.5,
              0,
              Math.sin((i / 3) * Math.PI * 2) * 0.5
            ]}
          >
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshStandardMaterial
              color={i === 0 ? "#06B6D4" : i === 1 ? "#8B5CF6" : "#EC4899"}
              metalness={0.9}
              roughness={0.1}
              emissive={i === 0 ? "#06B6D4" : i === 1 ? "#8B5CF6" : "#EC4899"}
              emissiveIntensity={0.4}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

export function AIAssistantOrb({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 35 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 3, 3]} intensity={1.2} />
        <pointLight position={[-2, -2, -2]} intensity={0.3} color="#06B6D4" />
        <pointLight position={[2, -2, 2]} intensity={0.3} color="#8B5CF6" />
        
        <Environment preset="studio" />
        
        <AIOrb />
      </Canvas>
    </div>
  );
}
