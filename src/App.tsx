import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Leva } from 'leva';
import { Scene } from './scene/Scene';
import { ControlPanel } from './ui/ControlPanel';
import { CanvasErrorBoundary } from './ui/CanvasErrorBoundary';
import { useAppStore } from './store/appStore';

function BottomLeftCorner(): JSX.Element {
  const resetAll = useAppStore((s) => s.resetAll);
  return (
    <div className="corner-bl">
      <span className="wordmark">Winston 2.0</span>
      <button className="reset-btn" type="button" onClick={resetAll}>
        Reset
      </button>
    </div>
  );
}

export function App(): JSX.Element {
  return (
    <div className="app-root">
      <CanvasErrorBoundary>
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
      </CanvasErrorBoundary>
      <Leva collapsed={false} />
      <ControlPanel />
      <BottomLeftCorner />
    </div>
  );
}
