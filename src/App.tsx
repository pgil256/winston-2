import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Leva } from 'leva';
import { Scene } from './scene/Scene';
import { ControlPanel } from './ui/ControlPanel';

export function App(): JSX.Element {
  return (
    <div className="app-root">
      <Canvas
        shadows
        camera={{ position: [3, 2, 4], fov: 50, near: 0.1, far: 100 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#1a1a1a']} />
        <Scene />
        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          minDistance={1.5}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2 - 0.05}
          target={[0, 0.5, 0]}
        />
      </Canvas>
      <Leva collapsed={false} />
      <ControlPanel />
      <div className="wordmark">Winston 2.0</div>
    </div>
  );
}
