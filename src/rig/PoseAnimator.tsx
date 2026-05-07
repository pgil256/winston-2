import { useFrame } from '@react-three/fiber';
import { tickPoseLerp } from './poseAnimation';

// Drives the pose-lerp animation each frame. Mount inside <Canvas>.
export function PoseAnimator(): null {
  useFrame(() => {
    tickPoseLerp(performance.now());
  });
  return null;
}
