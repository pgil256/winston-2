import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Sky } from '@react-three/drei';

function Ocean(): JSX.Element {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  useFrame((_, delta) => {
    const m = matRef.current;
    if (m && m.uniforms.time) m.uniforms.time.value += delta;
  });
  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      colorDeep: { value: new THREE.Color('#0a3a72') },
      colorShallow: { value: new THREE.Color('#3aa0d8') },
    }),
    [],
  );
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -5]} receiveShadow>
      <planeGeometry args={[40, 22, 80, 40]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={`
          uniform float time;
          varying float vHeight;
          void main() {
            vec3 pos = position;
            float w1 = sin(pos.x * 0.7 + time * 1.2) * 0.05;
            float w2 = cos(pos.y * 0.5 + time * 0.9) * 0.04;
            float w3 = sin((pos.x + pos.y) * 0.4 + time * 1.6) * 0.03;
            pos.z += w1 + w2 + w3;
            vHeight = w1 + w2 + w3;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 colorDeep;
          uniform vec3 colorShallow;
          varying float vHeight;
          void main() {
            float t = clamp(vHeight * 6.0 + 0.45, 0.0, 1.0);
            vec3 base = mix(colorDeep, colorShallow, t);
            gl_FragColor = vec4(base, 1.0);
          }
        `}
      />
    </mesh>
  );
}

function Palm({ x, z, scale = 1, lean = 0 }: { x: number; z: number; scale?: number; lean?: number }): JSX.Element {
  return (
    <group position={[x, 0, z]} rotation={[0, 0, lean]} scale={scale}>
      {/* trunk */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.07, 1.5, 12]} />
        <meshStandardMaterial color="#7a4f2a" roughness={0.85} />
      </mesh>
      {/* fronds */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const a = (i / 7) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.32, 1.55, Math.sin(a) * 0.32]}
            rotation={[Math.cos(a) * 0.6, a, Math.sin(a) * 0.6]}
            scale={[0.44, 0.04, 0.12]}
            castShadow
          >
            <sphereGeometry args={[1, 14, 8]} />
            <meshStandardMaterial color="#3a8a3a" roughness={0.9} />
          </mesh>
        );
      })}
      {/* coconuts */}
      <mesh position={[0.05, 1.42, 0.05]} castShadow>
        <sphereGeometry args={[0.04, 10, 8]} />
        <meshStandardMaterial color="#5a3018" />
      </mesh>
      <mesh position={[-0.04, 1.4, -0.06]} castShadow>
        <sphereGeometry args={[0.04, 10, 8]} />
        <meshStandardMaterial color="#5a3018" />
      </mesh>
    </group>
  );
}

export function Beach(): JSX.Element {
  return (
    <>
      <Sky sunPosition={[5, 3, 2]} turbidity={4} rayleigh={1.6} mieCoefficient={0.005} />
      <fog attach="fog" args={['#dbe5d8', 9, 30]} />

      <ambientLight intensity={0.4} color="#fff5e0" />
      <directionalLight
        position={[4, 4, 1]}
        intensity={1.3}
        color="#fff2d8"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />
      <hemisphereLight args={['#fff5d8', '#cba068', 0.4]} />

      {/* sand */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#e8d5a3" roughness={0.95} />
      </mesh>

      <Ocean />

      <Palm x={-1.6} z={0.3} scale={1.0} lean={-0.06} />
      <Palm x={2.0} z={-0.5} scale={0.85} lean={0.04} />
      <Palm x={-2.6} z={-1.2} scale={0.9} lean={-0.02} />
      <Palm x={3.2} z={1.4} scale={0.75} lean={0.05} />
    </>
  );
}
