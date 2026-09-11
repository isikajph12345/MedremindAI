import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useTranslation } from 'react-i18next';

function HeroCapsule() {
  const meshGroup = useRef();

  // Smooth, slightly slower 360-degree continuous rotation on all axes
  useFrame((_, delta) => {
    if (meshGroup.current) {
      meshGroup.current.rotation.y += delta * 0.8; // Relaxed 360° spin speed
      meshGroup.current.rotation.x += delta * 0.3; // Subtle organic pitch
      meshGroup.current.rotation.z += delta * 0.15; // Subtle roll
    }
  });

  return (
    <group ref={meshGroup} position={[0.65, -0.1, 0]} scale={0.58}>
      {/* TOP HALF: Rich Magenta-Pink */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.68, 0.68, 1.2, 64]} />
        <meshPhysicalMaterial
          color="#D946EF"
          transmission={0.2}
          roughness={0.12}
          clearcoat={1}
          emissive="#B838EC"
          emissiveIntensity={1.0}
        />
      </mesh>
      <mesh position={[0, 1.35, 0]}>
        <sphereGeometry args={[0.68, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color="#E879F9"
          transmission={0.2}
          roughness={0.12}
          clearcoat={1}
          emissive="#B838EC"
          emissiveIntensity={1.0}
        />
      </mesh>

      {/* SCORCHING LIGHT CORE IN THE MIDDLE */}
      <pointLight position={[0, 0, 0]} color="#FFF500" intensity={50} distance={5} />
      <pointLight position={[0, 0, 0]} color="#FF8C00" intensity={30} distance={3} />

      {/* Inner Core Mesh */}
      <mesh position={[0, 0, 0]} scale={0.35}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0, 0, 0]} scale={0.55}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.7} />
      </mesh>

      {/* BOTTOM HALF: Rich Royal Violet */}
      <mesh position={[0, -0.75, 0]}>
        <cylinderGeometry args={[0.68, 0.68, 1.2, 64]} />
        <meshStandardMaterial
          color="#5B21B6"
          roughness={0.15}
          metalness={0.2}
          emissive="#4C1D95"
          emissiveIntensity={1.2}
        />
      </mesh>
      <mesh position={[0, -1.35, 0]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[0.68, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#5B21B6"
          roughness={0.15}
          metalness={0.2}
          emissive="#4C1D95"
          emissiveIntensity={1.2}
        />
      </mesh>

      {/* GLOWING GOLDEN ORBIT RING */}
      <mesh rotation={[Math.PI / 2.2, 0.1, 0]}>
        <torusGeometry args={[1.42, 0.04, 16, 100]} />
        <meshStandardMaterial
          color="#FFD700"
          metalness={0.95}
          roughness={0.05}
          emissive="#FFB700"
          emissiveIntensity={2.8}
        />
      </mesh>

      {/* BUZZING GOLDEN SPARKLES */}
      <Sparkles count={55} scale={2.8} size={3.8} speed={0.55} color="#FFD700" opacity={0.9} />
      <Sparkles count={35} scale={3.4} size={2.8} speed={0.4} color="#FFB700" opacity={0.7} />
    </group>
  );
}

function ExtraBackgroundComponents() {
  const extraGroup = useRef();

  useFrame((_, delta) => {
    if (extraGroup.current) {
      extraGroup.current.rotation.y -= delta * 0.25;
    }
  });

  return (
    <group ref={extraGroup}>
      {/* Cyan Pill */}
      <Float speed={1.8} rotationIntensity={1.2} floatIntensity={1}>
        <mesh position={[-1.35, -1.2, -0.2]} rotation={[0.4, 0.6, 0.2]} scale={0.45}>
          <capsuleGeometry args={[0.18, 0.45, 16, 16]} />
          <meshStandardMaterial color="#00F0FF" roughness={0.1} emissive="#00B4D8" emissiveIntensity={1.4} />
        </mesh>
      </Float>

      {/* Hot Pink Orb */}
      <Float speed={1.5} floatIntensity={1.2}>
        <mesh position={[-1.4, 1.35, -0.4]} scale={0.38}>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshPhysicalMaterial color="#FF1493" roughness={0.05} emissive="#FF007F" emissiveIntensity={1.6} />
        </mesh>
      </Float>

      {/* Golden Ring */}
      <Float speed={1.8} rotationIntensity={1.5} floatIntensity={0.8}>
        <mesh position={[1.4, 1.5, -0.6]} scale={0.25} rotation={[0.5, 0.2, 0]}>
          <torusGeometry args={[0.5, 0.15, 16, 32]} />
          <meshStandardMaterial color="#FFD700" emissive="#FFB700" emissiveIntensity={2} metalness={0.8} />
        </mesh>
      </Float>

      {/* Lavender Orb */}
      <Float speed={2} floatIntensity={1}>
        <mesh position={[-1.8, 0.2, -0.8]} scale={0.2}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#C084FC" emissive="#A855F7" emissiveIntensity={1.6} />
        </mesh>
      </Float>

      {/* Small Violet Capsule */}
      <Float speed={1.4} rotationIntensity={1}>
        <mesh position={[1.2, -1.5, -0.5]} rotation={[0.8, -0.4, 0.2]} scale={0.3}>
          <capsuleGeometry args={[0.2, 0.4, 16, 16]} />
          <meshStandardMaterial color="#7E22CE" emissive="#6B21A8" emissiveIntensity={1.4} />
        </mesh>
      </Float>
    </group>
  );
}

export default function Background3DScene() {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 5.2], fov: 50 }}>
        <ambientLight intensity={1.8} />
        <directionalLight position={[5, 8, 5]} intensity={3} color="#FFFFFF" />
        <pointLight position={[-3, 2, 3]} color="#FF1493" intensity={5} />
        <pointLight position={[3, -2, 3]} color="#7E22CE" intensity={5} />

        <HeroCapsule />
        <ExtraBackgroundComponents />

        <EffectComposer>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.8} height={300} intensity={1.6} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}