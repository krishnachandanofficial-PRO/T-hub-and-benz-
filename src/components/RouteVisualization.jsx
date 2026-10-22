import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

/* ─────────────────────────────────────────
   MERCEDES EQS — rear-3/4 perspective
───────────────────────────────────────── */
function MercedesEQ({ isSOS }) {
  const groupRef = useRef();
  const taillightLRef = useRef();
  const taillightRRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.9) * 0.05;
    }
    const glow = 2 + Math.sin(t * 2.5) * 0.5;
    if (taillightLRef.current) taillightLRef.current.intensity = glow;
    if (taillightRRef.current) taillightRRef.current.intensity = glow;
  });

  const bodyColor  = '#243448';   // visible dark-blue metallic
  const bodyMat    = useMemo(() => new THREE.MeshStandardMaterial({ color: bodyColor,   metalness: 0.75, roughness: 0.25 }), []);
  const glassMat   = useMemo(() => new THREE.MeshStandardMaterial({ color: '#0a1e2e',   metalness: 0.1,  roughness: 0.05, transparent: true, opacity: 0.65 }), []);
  const rimMat     = useMemo(() => new THREE.MeshStandardMaterial({ color: '#C4B896',   metalness: 1.0,  roughness: 0.15 }), []);
  const tireMat    = useMemo(() => new THREE.MeshStandardMaterial({ color: '#111111',   metalness: 0,    roughness: 0.95 }), []);
  const taillightMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: isSOS ? '#FF6B35' : '#00E5A3',
    emissive: isSOS ? '#FF6B35' : '#00E5A3',
    emissiveIntensity: 4,
  }), [isSOS]);
  const headlightMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#00F0FF', emissive: '#00F0FF', emissiveIntensity: 5,
  }), []);
  const chromeMat  = useMemo(() => new THREE.MeshStandardMaterial({ color: '#8899aa', metalness: 1.0, roughness: 0.1 }), []);

  const wheelPositions = [
    [-0.98, 0, 1.35],   // front-left
    [ 0.98, 0, 1.35],   // front-right
    [-0.98, 0,-1.35],   // rear-left
    [ 0.98, 0,-1.35],   // rear-right
  ];

  return (
    <group ref={groupRef} position={[0, 0.34, 0]}>
      {/* ── LOWER BODY SILL ── */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.05, 0.38, 4.5]} />
        <primitive object={bodyMat} />
      </mesh>

      {/* ── UPPER CABIN ── */}
      <mesh position={[0, 0.52, -0.12]} castShadow>
        <boxGeometry args={[1.88, 0.58, 2.75]} />
        <primitive object={bodyMat} />
      </mesh>

      {/* ── ROOF ── */}
      <mesh position={[0, 0.82, -0.12]} castShadow>
        <boxGeometry args={[1.80, 0.07, 2.45]} />
        <primitive object={bodyMat} />
      </mesh>

      {/* ── HOOD (front) ── */}
      <mesh position={[0, 0.2, 1.72]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[2.0, 0.14, 1.2]} />
        <primitive object={bodyMat} />
      </mesh>

      {/* ── TRUNK (rear) ── */}
      <mesh position={[0, 0.25,-1.7]} rotation={[-0.12, 0, 0]} castShadow>
        <boxGeometry args={[1.95, 0.12, 0.85]} />
        <primitive object={bodyMat} />
      </mesh>

      {/* ── WINDSHIELD ── */}
      <mesh position={[0, 0.52, 1.02]} rotation={[-0.52, 0, 0]}>
        <boxGeometry args={[1.68, 0.65, 0.06]} />
        <primitive object={glassMat} />
      </mesh>

      {/* ── REAR GLASS ── */}
      <mesh position={[0, 0.50,-1.02]} rotation={[ 0.48, 0, 0]}>
        <boxGeometry args={[1.62, 0.58, 0.06]} />
        <primitive object={glassMat} />
      </mesh>

      {/* ── SIDE WINDOWS ── */}
      {[-0.96, 0.96].map((x, i) => (
        <mesh key={i} position={[x, 0.52, -0.08]}>
          <boxGeometry args={[0.05, 0.46, 2.0]} />
          <primitive object={glassMat} />
        </mesh>
      ))}

      {/* ── TAILLIGHTS — EQ horizontal strip ── */}
      <mesh position={[-0.65, 0.05,-2.26]}>
        <boxGeometry args={[0.6, 0.07, 0.05]} />
        <primitive object={taillightMat} />
      </mesh>
      <mesh position={[ 0.65, 0.05,-2.26]}>
        <boxGeometry args={[0.6, 0.07, 0.05]} />
        <primitive object={taillightMat} />
      </mesh>
      {/* Center connector strip */}
      <mesh position={[0, 0.05,-2.26]}>
        <boxGeometry args={[0.38, 0.035, 0.05]} />
        <primitive object={taillightMat} />
      </mesh>

      {/* ── HEADLIGHTS — DRL strip ── */}
      {[-0.68, 0.68].map((x, i) => (
        <mesh key={i} position={[x, 0.04, 2.26]}>
          <boxGeometry args={[0.48, 0.055, 0.05]} />
          <primitive object={headlightMat} />
        </mesh>
      ))}

      {/* ── WHEELS ── */}
      {wheelPositions.map(([x, y, z], i) => (
        <group key={i} position={[x, y - 0.34, z]} rotation={[0, 0, Math.PI / 2]}>
          {/* Tyre */}
          <mesh castShadow>
            <cylinderGeometry args={[0.33, 0.33, 0.24, 28]} />
            <primitive object={tireMat} />
          </mesh>
          {/* Outer rim ring */}
          <mesh>
            <cylinderGeometry args={[0.25, 0.25, 0.25, 28]} />
            <primitive object={rimMat} />
          </mesh>
          {/* Hub center */}
          <mesh>
            <cylinderGeometry args={[0.06, 0.06, 0.26, 12]} />
            <meshStandardMaterial color="#0a1520" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* 5 spokes */}
          {[0, 72, 144, 216, 288].map((deg, j) => (
            <mesh key={j} rotation={[0, 0, (deg * Math.PI) / 180]}>
              <boxGeometry args={[0.038, 0.17, 0.24]} />
              <primitive object={rimMat} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ── CHROME SIDE SILL ── */}
      {[-1.03, 1.03].map((x, i) => (
        <mesh key={i} position={[x, -0.15, 0]}>
          <boxGeometry args={[0.04, 0.06, 3.6]} />
          <primitive object={chromeMat} />
        </mesh>
      ))}

      {/* ── MB STAR (front) ── */}
      <mesh position={[0, 0.04, 2.28]}>
        <circleGeometry args={[0.08, 20]} />
        <meshStandardMaterial color="#C4B896" metalness={1} roughness={0.1} emissive="#C4B896" emissiveIntensity={0.5} />
      </mesh>

      {/* ── CHARGING PORT glow (rear-left quarter) ── */}
      <mesh position={[-0.92, 0.05,-1.6]}>
        <circleGeometry args={[0.055, 16]} />
        <meshStandardMaterial color="#00E5A3" emissive="#00E5A3" emissiveIntensity={3} />
      </mesh>

      {/* ── LIGHTS ── */}
      {/* Underbody cyan ambient */}
      <pointLight position={[0, -0.5, 0]} color="#00F0FF" intensity={isSOS ? 0.5 : 1.5} distance={4} />
      {/* Taillight glows */}
      <pointLight ref={taillightLRef} position={[-0.65, 0.05,-2.5]} color={isSOS ? '#FF6B35' : '#00E5A3'} intensity={2} distance={5} />
      <pointLight ref={taillightRRef} position={[ 0.65, 0.05,-2.5]} color={isSOS ? '#FF6B35' : '#00E5A3'} intensity={2} distance={5} />
      {/* Headlight cone */}
      <pointLight position={[0, 0, 2.6]} color="#00F0FF" intensity={1.5} distance={8} />
      {/* Top fill light on body */}
      <pointLight position={[0, 2.5, 0]} color="#a0c8ff" intensity={2.5} distance={6} />
    </group>
  );
}

/* ─────────────────────────────────────────
   ROAD
───────────────────────────────────────── */
function Road() {
  const dashRefs = useRef([]);
  useFrame(({ clock }) => {
    const speed = 6;
    const t = clock.elapsedTime;
    dashRefs.current.forEach((ref, i) => {
      if (ref) {
        ref.position.z = ((-i * 5 + t * speed) % 60) - 20;
      }
    });
  });

  const dashes = Array.from({ length: 14 });

  return (
    <group>
      {/* Road surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.34, 0]} receiveShadow>
        <planeGeometry args={[20, 130]} />
        <meshStandardMaterial color="#080c12" roughness={0.98} metalness={0} />
      </mesh>

      {/* Cyan edge glow lines */}
      {[-3.9, 3.9].map((x, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, -0.33, 0]}>
          <planeGeometry args={[0.08, 130]} />
          <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={1.8} transparent opacity={0.55} />
        </mesh>
      ))}

      {/* Lane dashes — animated scroll */}
      {dashes.map((_, i) => (
        <mesh
          key={i}
          ref={el => (dashRefs.current[i] = el)}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.33, -i * 5]}
        >
          <planeGeometry args={[0.055, 2.5]} />
          <meshStandardMaterial color="white" transparent opacity={0.25} />
        </mesh>
      ))}

      {/* Road ahead glow */}
      <pointLight position={[0, 0.5,-25]} color="#00F0FF" intensity={1.5} distance={40} />
    </group>
  );
}

/* ─────────────────────────────────────────
   GHOST CARS — ambient traffic
───────────────────────────────────────── */
function GhostCar({ position, scale = 1, speed = 0, color = '#1a2840' }) {
  const ref = useRef();
  const initZ = position[2];

  useFrame(() => {
    if (ref.current && speed !== 0) {
      ref.current.position.z += speed * 0.016;
      if (ref.current.position.z > 8)   ref.current.position.z = initZ - 28;
      if (ref.current.position.z < -40)  ref.current.position.z = initZ + 8;
    }
  });

  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color, metalness: 0.55, roughness: 0.45, transparent: true, opacity: 0.88,
  }), [color]);

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[1.65, 0.35, 3.7]} />
        <primitive object={mat} />
      </mesh>
      <mesh position={[0, 0.5, -0.1]} castShadow>
        <boxGeometry args={[1.45, 0.38, 2.15]} />
        <primitive object={mat} />
      </mesh>
      {/* Taillights */}
      {[-0.6, 0.6].map((x, i) => (
        <mesh key={i} position={[x, 0.2,-1.87]}>
          <boxGeometry args={[0.38, 0.055, 0.04]} />
          <meshStandardMaterial color="#cc2200" emissive="#cc2200" emissiveIntensity={2} />
        </mesh>
      ))}
      {/* Wheels */}
      {[[-0.8,-0.1, 1.1],[0.8,-0.1, 1.1],[-0.8,-0.1,-1.1],[0.8,-0.1,-1.1]].map(([x,y,z], i) => (
        <mesh key={i} position={[x,y,z]} rotation={[0,0,Math.PI/2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.18, 16]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/* ─────────────────────────────────────────
   CHARGING STATION
───────────────────────────────────────── */
function ChargingStation() {
  const glowRef = useRef();
  useFrame(({ clock }) => {
    if (glowRef.current) {
      glowRef.current.intensity = 2 + Math.sin(clock.elapsedTime * 2.5) * 0.8;
    }
  });

  return (
    <group position={[0, -0.34, -32]}>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 1.2, 12]} />
        <meshStandardMaterial color="#00E5A3" emissive="#00E5A3" emissiveIntensity={3} />
      </mesh>
      <mesh position={[0, 1.25, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#00E5A3" emissive="#00E5A3" emissiveIntensity={5} transparent opacity={0.9} />
      </mesh>
      <pointLight ref={glowRef} position={[0, 1.2, 0]} color="#00E5A3" intensity={2} distance={14} />
      <Html position={[0, 2.4, 0]} center distanceFactor={14}>
        <div style={{
          background: 'rgba(0,18,12,0.93)',
          border: '1px solid rgba(0,229,163,0.5)',
          borderRadius: '10px',
          padding: '5px 12px',
          color: '#00E5A3',
          fontSize: '9px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 700,
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(10px)',
          textAlign: 'center',
          lineHeight: 1.7,
          boxShadow: '0 0 20px rgba(0,229,163,0.2)',
        }}>
          KM-112 EXPRESS PLAZA<br />
          <span style={{ color: 'rgba(0,229,163,0.6)', fontSize: '8px', fontWeight: 500 }}>
            120 kW · Slot Secured
          </span>
        </div>
      </Html>
    </group>
  );
}

/* ─────────────────────────────────────────
   PARTICLES
───────────────────────────────────────── */
function Particles() {
  const count = 90;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 24;
      arr[i * 3 + 1] = Math.random() * 6;
      arr[i * 3 + 2] = Math.random() * 70 - 15;
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color="#00F0FF" transparent opacity={0.38} sizeAttenuation />
    </points>
  );
}

/* ─────────────────────────────────────────
   HUD OVERLAYS
───────────────────────────────────────── */
function HudOverlays({ vehicleData, isSOS }) {
  return (
    <Html fullscreen style={{ pointerEvents: 'none' }}>
      {/* Top-left: range */}
      <div style={{ position: 'absolute', top: 14, left: 14 }}>
        <HudBox accentColor="#00F0FF" label="RANGE" value={vehicleData?.rangeKm || 462} unit="km available" />
      </div>
      {/* Top-right: speed + SoC */}
      <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <HudBox accentColor="#00F0FF" label="SPEED"       value={vehicleData?.speedKmh || 112}          unit="km/h · ECO+" />
        <HudBox accentColor="#00E5A3" label="ARRIVAL SoC" value={`${vehicleData?.arrivalSocPercent || 36}%`} unit="est. at dest." />
      </div>
      {/* Center top label */}
      <div style={{
        position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
        fontSize: 7, color: 'rgba(255,255,255,0.16)', fontWeight: 600,
        letterSpacing: 4, fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap',
      }}>
        MERCEDES-BENZ EQ · LIVE ROUTE INTELLIGENCE
      </div>
      {/* SOS overlay */}
      {isSOS && (
        <div style={{
          position: 'absolute', top: '38%', left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255,107,53,0.12)',
          border: '1.5px solid rgba(255,107,53,0.45)',
          borderRadius: 16, padding: '14px 28px', textAlign: 'center',
          backdropFilter: 'blur(12px)', fontFamily: 'Inter, sans-serif',
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#FF6B35', marginBottom: 4 }}>RAPID ASSIST ACTIVATED</div>
          <div style={{ fontSize: 10, color: 'rgba(255,107,53,0.7)' }}>Mobile Energy Pod · 9 min ETA · +40 kWh</div>
        </div>
      )}
    </Html>
  );
}

function HudBox({ accentColor, label, value, unit }) {
  return (
    <div style={{
      background: 'rgba(3,7,12,0.85)',
      border: `1px solid ${accentColor}25`,
      borderRadius: 12,
      padding: '8px 14px',
      minWidth: 82,
      fontFamily: 'Inter, system-ui, sans-serif',
      backdropFilter: 'blur(16px)',
    }}>
      <div style={{ fontSize: 8, color: `${accentColor}80`, letterSpacing: 2, marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: accentColor, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 8, color: `${accentColor}55`, marginTop: 3 }}>{unit}</div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SCENE
───────────────────────────────────────── */
function Scene({ chaosMode, vehicleData, routeData }) {
  const isSOS = chaosMode === 'sos';

  const ghostCars = [
    { position: [-5.5, -0.34, -4],  scale: 0.88, speed: 0,  color: '#182538' },
    { position: [-5.5, -0.34,-12],  scale: 0.90, speed: 0,  color: '#14203a' },
    { position: [-5.5, -0.34,-20],  scale: 0.85, speed: 0,  color: '#162035' },
    { position: [-6.5, -0.34, -1],  scale: 0.82, speed: 0,  color: '#182030' },
    { position: [-5.0, -0.34,-28],  scale: 0.88, speed: 0,  color: '#14223a' },
    { position: [ 5.5, -0.34, -6],  scale: 0.88, speed: 0,  color: '#182538' },
    { position: [ 5.5, -0.34,-14],  scale: 0.90, speed: 0,  color: '#14203a' },
    { position: [ 6.2, -0.34,-22],  scale: 0.85, speed: 0,  color: '#162035' },
    { position: [ 5.0, -0.34,-30],  scale: 0.88, speed: 0,  color: '#14223a' },
    { position: [ 3.0, -0.34, -3],  scale: 0.88, speed: -3.5, color: '#182538' },
    { position: [ 3.0, -0.34,-16],  scale: 0.90, speed: -3.5, color: '#14203a' },
    { position: [ 0,   -0.34,-10],  scale: 0.80, speed: -2, color: '#0e1a2c' },
    { position: [ 0,   -0.34,-22],  scale: 0.76, speed: -2, color: '#0e1a2c' },
  ];

  return (
    <>
      {/* ── LIGHTING ── */}
      <ambientLight intensity={0.9} color="#1a2a3a" />
      <directionalLight position={[3, 8, 5]}   intensity={1.2} color="#b0d0f0" castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-3, 6, -5]} intensity={0.5} color="#2060a0" />
      {/* Overhead fill for car */}
      <spotLight
        position={[0, 8, 3]}
        target-position={[0, 0, 0]}
        intensity={4}
        angle={0.55}
        penumbra={0.4}
        color="#c0d8f0"
        castShadow
      />
      <pointLight position={[0, 4,-15]} color="#00F0FF" intensity={1.5} distance={50} />
      <fog attach="fog" args={['#020810', 22, 70]} />

      <Road />
      <MercedesEQ isSOS={isSOS} />
      {ghostCars.map((car, i) => <GhostCar key={i} {...car} />)}
      <ChargingStation />
      <Particles />
      <HudOverlays vehicleData={vehicleData} isSOS={isSOS} />
    </>
  );
}

/* ─────────────────────────────────────────
   EXPORT
───────────────────────────────────────── */
export function RouteVisualization({ chaosMode, vehicleData, routeData }) {
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#02060C' }}>
      <Canvas
        shadows
        camera={{ position: [0, 2.6, 8.5], fov: 50, near: 0.1, far: 200 }}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.3,
        }}
        onCreated={({ camera }) => {
          camera.lookAt(0, 0.4, 0);
        }}
      >
        <Scene chaosMode={chaosMode} vehicleData={vehicleData} routeData={routeData} />
      </Canvas>

      {/* Bottom progress bar */}
      <div style={{
        position: 'absolute', bottom: 12, left: '50%',
        transform: 'translateX(-50%)', width: '70%',
        pointerEvents: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.18)', fontFamily: 'monospace', letterSpacing: 3 }}>BLR</span>
          <div style={{ flex: 1, height: 2, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 2,
              background: 'linear-gradient(90deg, #00F0FF, #00E5A3)',
              width: `${((568 - (routeData?.remainingKm || 184)) / 568) * 100}%`,
            }} />
          </div>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.18)', fontFamily: 'monospace', letterSpacing: 3 }}>HYD</span>
        </div>
        <p style={{ textAlign: 'center', fontSize: 9, color: 'rgba(255,255,255,0.16)', fontFamily: 'monospace' }}>
          {routeData?.remainingKm || 184} km remaining &bull; ETA {routeData?.arrivalTime || '12:18 PM'}
        </p>
      </div>
    </div>
  );
}
