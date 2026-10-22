import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Möbius strip parametric geometry
function createMobiusGeometry(R = 2, tubeSegments = 200, radialSegments = 12) {
  const positions = [];
  const indices = [];
  const uvs = [];

  for (let i = 0; i <= tubeSegments; i++) {
    const t = (i / tubeSegments) * Math.PI * 2;
    for (let j = 0; j <= radialSegments; j++) {
      const s = (j / radialSegments - 0.5) * 1.2; // width along strip
      const x = (R + s * Math.cos(t / 2)) * Math.cos(t);
      const y = (R + s * Math.cos(t / 2)) * Math.sin(t);
      const z = s * Math.sin(t / 2);
      positions.push(x, y, z);
      uvs.push(i / tubeSegments, j / radialSegments);
    }
  }

  for (let i = 0; i < tubeSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * (radialSegments + 1) + j;
      const b = a + radialSegments + 1;
      indices.push(a, b, a + 1);
      indices.push(b, b + 1, a + 1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

// Generate CatmullRom path along Möbius strip
function createMobiusPath(R = 2, segments = 300) {
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    const s = 0;
    const x = (R + s * Math.cos(t / 2)) * Math.cos(t);
    const y = (R + s * Math.cos(t / 2)) * Math.sin(t);
    const z = s * Math.sin(t / 2);
    points.push(new THREE.Vector3(x, y, z));
  }
  return new THREE.CatmullRomCurve3(points, true);
}

// Glowing energy orb with trail
function EnergyOrb({ path, speed = 1 }) {
  const orbRef = useRef();
  const trailRef = useRef();
  const progressRef = useRef(0);
  const trailPositions = useRef(new Array(60).fill(null).map(() => new THREE.Vector3()));

  useFrame((_, delta) => {
    progressRef.current = (progressRef.current + delta * 0.06 * speed) % 1;
    const pos = path.getPoint(progressRef.current);
    if (orbRef.current) {
      orbRef.current.position.copy(pos);
    }
    // Shift trail
    for (let i = trailPositions.current.length - 1; i > 0; i--) {
      trailPositions.current[i].copy(trailPositions.current[i - 1]);
    }
    trailPositions.current[0].copy(pos);

    if (trailRef.current) {
      const positions = trailRef.current.geometry.attributes.position.array;
      for (let i = 0; i < trailPositions.current.length; i++) {
        const p = trailPositions.current[i];
        positions[i * 3] = p.x;
        positions[i * 3 + 1] = p.y;
        positions[i * 3 + 2] = p.z;
      }
      trailRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const trailGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(60 * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  return (
    <group>
      {/* Orb */}
      <mesh ref={orbRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#00F0FF"
          emissive="#00F0FF"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>
      {/* Point light follows orb via separate ref */}
      <pointLight ref={undefined} color="#00F0FF" intensity={2} distance={1.5} position={[0, 0, 0]} />
      {/* Trail */}
      <line ref={trailRef}>
        <primitive object={trailGeo} attach="geometry" />
        <lineBasicMaterial color="#00F0FF" transparent opacity={0.6} />
      </line>
    </group>
  );
}

// Möbius wireframe
function MobiusStrip() {
  const meshRef = useRef();
  const geometry = useMemo(() => createMobiusGeometry(), []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.12;
      meshRef.current.rotation.x += delta * 0.04;
    }
  });

  return (
    <group ref={meshRef}>
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color="#00F0FF"
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#00E5A3"
          emissive="#00E5A3"
          emissiveIntensity={0.4}
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// Floating starfield particles
function Starfield() {
  const pointsRef = useRef();
  const count = 400;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.015;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.008;
    }
  });

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  return (
    <points ref={pointsRef}>
      <primitive object={geo} attach="geometry" />
      <pointsMaterial
        color="#00F0FF"
        size={0.025}
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

// HUD telemetry floating text (as 2D overlay HTML)
function HUDRings() {
  const ringRef = useRef();
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.3;
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
    }
  });

  return (
    <group ref={ringRef}>
      {[3.5, 4.2, 5.0].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, (i * Math.PI) / 3]}>
          <torusGeometry args={[r, 0.008, 4, 120]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? '#00F0FF' : '#00E5A3'}
            transparent
            opacity={0.12 - i * 0.02}
          />
        </mesh>
      ))}
    </group>
  );
}

// Secondary accent grid
function GridPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
      <planeGeometry args={[20, 20, 24, 24]} />
      <meshBasicMaterial
        color="#00F0FF"
        wireframe
        transparent
        opacity={0.04}
      />
    </mesh>
  );
}

// Glowing secondary orbs
function AmbienceOrbs() {
  const groupRef = useRef();
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {[
        { pos: [3.5, 0.5, 0], color: '#00E5A3', intensity: 0.8 },
        { pos: [-3.5, -0.5, 0], color: '#00F0FF', intensity: 0.6 },
        { pos: [0, 2.5, 1.5], color: '#00E5A3', intensity: 0.5 },
      ].map((orb, i) => (
        <pointLight key={i} position={orb.pos} color={orb.color} intensity={orb.intensity} distance={4} />
      ))}
    </group>
  );
}

export function MobiusHologram({ speed = 1 }) {
  const path = useMemo(() => createMobiusPath(), []);

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.1} />
        <AmbienceOrbs />
        <Starfield />
        <GridPlane />
        <HUDRings />
        <MobiusStrip />
        <EnergyOrb path={path} speed={speed} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          maxPolarAngle={Math.PI}
          minPolarAngle={0}
        />
      </Canvas>
    </div>
  );
}
