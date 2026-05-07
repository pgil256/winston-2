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
        camera={{ position: [1.4, 0.7, 1.6], fov: 45, near: 0.05, far: 50 }}
        gl={{ antialias: true }}
      >
        <Scene />
        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          minDistance={0.6}
          maxDistance={6}
          maxPolarAngle={Math.PI / 2 - 0.05}
          target={[0, 0.18, 0.1]}
        />
      </Canvas>
      <Leva collapsed={false} />
      <ControlPanel />
      <div className="wordmark">Winston 2.0</div>
    </div>
  );
}
