import React from 'react';
import { OrbitControls, PerspectiveCamera, Environment, SoftShadows, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

interface SceneConfigProps {
  autoRotate: boolean;
  lightIntensity: number;
}

const SceneConfig: React.FC<SceneConfigProps> = ({ autoRotate, lightIntensity }) => {
  return (
    <>
      {/* 📸 CAMERA CONTROLS */}
      <PerspectiveCamera makeDefault position={[0, 1, 6]} fov={50} />
      <OrbitControls
        makeDefault
        enableDamping={true}
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={10}
        maxPolarAngle={Math.PI / 2 - 0.05} 
        autoRotate={autoRotate}
        autoRotateSpeed={1.0}
        target={[0, -0.5, 0]}
      />

      {/* 💡 LIGHTING SYSTEM */}
      
      {/* Ambient Fill */}
      <ambientLight intensity={0.3} color="#ffffff" />
      
      {/* Main Key Light (Shadow Caster) */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={0.8 + lightIntensity}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      >
        <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
      </directionalLight>

      {/* Rim/Fill Light (Subtle) */}
      <spotLight 
        position={[-5, 5, 5]} 
        intensity={0.2} 
        angle={0.5} 
        penumbra={1} 
        color="#ffd0b0"
      />

      {/* 🖼️ ENVIRONMENT & REFLECTIONS */}
      <Environment preset="apartment" background={false} blur={0.8} />
      
      {/* Shadow Softener */}
      <SoftShadows size={10} samples={10} focus={0.5} />

      {/* Ambient Occlusion */}
      <ContactShadows 
        resolution={1024} 
        scale={10} 
        blur={2} 
        opacity={0.5} 
        far={1} 
        color="#000000" 
      />
    </>
  );
};

export default SceneConfig;
