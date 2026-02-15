/// <reference types="@react-three/fiber" />

import { Object3DNode, MaterialNode } from "@react-three/fiber";
import * as THREE from "three";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Geometry
      planeGeometry: Object3DNode<
        THREE.PlaneGeometry,
        typeof THREE.PlaneGeometry
      >;
      boxGeometry: Object3DNode<THREE.BoxGeometry, typeof THREE.BoxGeometry>;
      sphereGeometry: Object3DNode<
        THREE.SphereGeometry,
        typeof THREE.SphereGeometry
      >;
      cylinderGeometry: Object3DNode<
        THREE.CylinderGeometry,
        typeof THREE.CylinderGeometry
      >;

      // Materials
      meshStandardMaterial: MaterialNode<
        THREE.MeshStandardMaterial,
        typeof THREE.MeshStandardMaterial
      >;
      meshBasicMaterial: MaterialNode<
        THREE.MeshBasicMaterial,
        typeof THREE.MeshBasicMaterial
      >;
      meshPhongMaterial: MaterialNode<
        THREE.MeshPhongMaterial,
        typeof THREE.MeshPhongMaterial
      >;

      // Objects
      mesh: Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
      group: Object3DNode<THREE.Group, typeof THREE.Group>;

      // Lights
      ambientLight: Object3DNode<THREE.AmbientLight, typeof THREE.AmbientLight>;
      directionalLight: Object3DNode<
        THREE.DirectionalLight,
        typeof THREE.DirectionalLight
      >;
      pointLight: Object3DNode<THREE.PointLight, typeof THREE.PointLight>;
      spotLight: Object3DNode<THREE.SpotLight, typeof THREE.SpotLight>;
      hemisphereLight: Object3DNode<
        THREE.HemisphereLight,
        typeof THREE.HemisphereLight
      >;

      // Helpers
      gridHelper: Object3DNode<THREE.GridHelper, typeof THREE.GridHelper>;
      axesHelper: Object3DNode<THREE.AxesHelper, typeof THREE.AxesHelper>;
    }
  }
}

export {};
