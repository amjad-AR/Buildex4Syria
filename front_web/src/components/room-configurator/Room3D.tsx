import React from 'react';
import * as THREE from 'three';
import { MaterialOption } from './types';
import { ROOM_WIDTH, ROOM_HEIGHT, ROOM_DEPTH } from './constants';

interface Room3DProps {
  wallMaterial: MaterialOption;
  floorMaterial: MaterialOption;
}

/**
 * Room Component
 * Generates the physical geometry of the room.
 *
 * 🔄 TEXTURE INTEGRATION GUIDE:
 * To replace colors with real textures:
 * 1. Import `useTexture` from @react-three/drei
 * 2. Load maps: const props = useTexture({ map: 'url', normalMap: 'url', roughnessMap: 'url' })
 * 3. Spread props into <meshStandardMaterial {...props} />
 */
const Room3D: React.FC<Room3DProps> = ({ wallMaterial, floorMaterial }) => {
  return (
    <group>
      {/* ------------------ FLOOR ------------------ */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -ROOM_HEIGHT / 2, 0]} 
        receiveShadow
      >
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial
          color={floorMaterial.color}
          roughness={floorMaterial.roughness}
          metalness={floorMaterial.metalness}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* ------------------ WALLS ------------------ */}
      
      {/* Back Wall */}
      <mesh 
        position={[0, 0, -ROOM_DEPTH / 2]} 
        receiveShadow 
      >
        <planeGeometry args={[ROOM_WIDTH, ROOM_HEIGHT]} />
        <meshStandardMaterial
          color={wallMaterial.color}
          roughness={wallMaterial.roughness}
          metalness={wallMaterial.metalness}
        />
      </mesh>

      {/* Left Wall */}
      <mesh 
        position={[-ROOM_WIDTH / 2, 0, 0]} 
        rotation={[0, Math.PI / 2, 0]} 
        receiveShadow 
      >
        <planeGeometry args={[ROOM_DEPTH, ROOM_HEIGHT]} />
        <meshStandardMaterial
          color={wallMaterial.color}
          roughness={wallMaterial.roughness}
          metalness={wallMaterial.metalness}
        />
      </mesh>

      {/* Right Wall */}
      <mesh 
        position={[ROOM_WIDTH / 2, 0, 0]} 
        rotation={[0, -Math.PI / 2, 0]} 
        receiveShadow 
      >
        <planeGeometry args={[ROOM_DEPTH, ROOM_HEIGHT]} />
        <meshStandardMaterial
          color={wallMaterial.color}
          roughness={wallMaterial.roughness}
          metalness={wallMaterial.metalness}
        />
      </mesh>

      {/* Baseboards (Optional Detail for Realism) */}
      <mesh position={[0, -ROOM_HEIGHT/2 + 0.05, -ROOM_DEPTH/2 + 0.01]} receiveShadow>
         <boxGeometry args={[ROOM_WIDTH, 0.1, 0.02]} />
         <meshStandardMaterial color="#fff" roughness={0.5} />
      </mesh>
       <mesh position={[-ROOM_WIDTH/2 + 0.01, -ROOM_HEIGHT/2 + 0.05, 0]} rotation={[0, Math.PI/2, 0]} receiveShadow>
         <boxGeometry args={[ROOM_DEPTH, 0.1, 0.02]} />
         <meshStandardMaterial color="#fff" roughness={0.5} />
      </mesh>
       <mesh position={[ROOM_WIDTH/2 - 0.01, -ROOM_HEIGHT/2 + 0.05, 0]} rotation={[0, Math.PI/2, 0]} receiveShadow>
         <boxGeometry args={[ROOM_DEPTH, 0.1, 0.02]} />
         <meshStandardMaterial color="#fff" roughness={0.5} />
      </mesh>
    </group>
  );
};

export default Room3D;
