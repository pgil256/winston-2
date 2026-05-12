import type { ComponentType } from 'react';
import { Cape } from '../accessories/body/Cape';
import { Sweater } from '../accessories/body/Sweater';
import { Tutu } from '../accessories/body/Tutu';
import { Boots } from '../accessories/feet/Boots';
import { Socks } from '../accessories/feet/Socks';
import { CowboyHat } from '../accessories/hats/CowboyHat';
import { PartyHat } from '../accessories/hats/PartyHat';
import { TopHat } from '../accessories/hats/TopHat';
import { WitchHat } from '../accessories/hats/WitchHat';
import { Bowtie } from '../accessories/neck/Bowtie';
import { Collar } from '../accessories/neck/Collar';
import { Scarf } from '../accessories/neck/Scarf';
import type { BoneId } from '../rig/types';

export interface ProceduralAccessoryProps {
  readonly bone?: BoneId;
}

function Crown(): JSX.Element {
  return (
    <group position={[0, 0.055, 0.04]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.075, 0.065, 0.035, 6, 1, true]} />
        <meshStandardMaterial color="#f5c542" metalness={0.45} roughness={0.35} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.055, 0.03, Math.sin(angle) * 0.055]} castShadow>
            <sphereGeometry args={[0.012, 10, 8]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#d7354a' : '#2f72d6'} roughness={0.35} />
          </mesh>
        );
      })}
    </group>
  );
}

function WizardHat(): JSX.Element {
  return (
    <group position={[0, 0.06, 0.04]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.105, 0.105, 0.01, 28]} />
        <meshStandardMaterial color="#27347a" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.095, 0]} rotation={[0, 0, -0.08]} castShadow>
        <coneGeometry args={[0.052, 0.19, 28]} />
        <meshStandardMaterial color="#27347a" roughness={0.7} />
      </mesh>
      <mesh position={[0.018, 0.09, 0.044]} castShadow>
        <sphereGeometry args={[0.01, 10, 8]} />
        <meshStandardMaterial color="#f5d76e" emissive="#3a2f00" emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}

function PirateHat(): JSX.Element {
  return (
    <group position={[0, 0.055, 0.04]}>
      <mesh scale={[1.25, 0.24, 0.62]} castShadow>
        <sphereGeometry args={[0.075, 24, 12]} />
        <meshStandardMaterial color="#1d1713" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.018, 0.043]} castShadow>
        <boxGeometry args={[0.11, 0.01, 0.018]} />
        <meshStandardMaterial color="#e7d8a8" roughness={0.65} />
      </mesh>
    </group>
  );
}

function Sunglasses(): JSX.Element {
  return (
    <group position={[0, 0, 0.018]}>
      {[-0.026, 0.026].map((x) => (
        <mesh key={x} position={[x, 0, 0]} castShadow>
          <boxGeometry args={[0.038, 0.018, 0.006]} />
          <meshStandardMaterial color="#111111" roughness={0.45} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.018, 0.005, 0.005]} />
        <meshStandardMaterial color="#111111" roughness={0.45} />
      </mesh>
    </group>
  );
}

function Eyepatch(): JSX.Element {
  return (
    <group position={[0.022, 0, 0.02]}>
      <mesh castShadow>
        <boxGeometry args={[0.036, 0.024, 0.006]} />
        <meshStandardMaterial color="#151515" roughness={0.7} />
      </mesh>
      <mesh position={[-0.022, 0.012, -0.002]} rotation={[0, 0, -0.22]} castShadow>
        <boxGeometry args={[0.08, 0.004, 0.004]} />
        <meshStandardMaterial color="#151515" roughness={0.7} />
      </mesh>
    </group>
  );
}

function Wings(): JSX.Element {
  return (
    <group position={[0, -0.015, -0.035]}>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.065, 0.02, 0]} rotation={[0.25, 0, side * 0.45]} castShadow>
          <coneGeometry args={[0.045, 0.12, 4]} />
          <meshStandardMaterial color="#f1f1f1" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function Backpack(): JSX.Element {
  return (
    <group position={[0, -0.01, -0.035]}>
      <mesh scale={[0.8, 1.1, 0.55]} castShadow>
        <boxGeometry args={[0.12, 0.11, 0.07]} />
        <meshStandardMaterial color="#4f7b51" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.006, 0.04]} castShadow>
        <boxGeometry args={[0.07, 0.026, 0.012]} />
        <meshStandardMaterial color="#314f33" roughness={0.85} />
      </mesh>
    </group>
  );
}

function Slippers({ bone }: ProceduralAccessoryProps): JSX.Element {
  return (
    <group>
      <mesh
        position={[0, -0.002, bone === 'foot_L' || bone === 'foot_R' ? 0.018 : 0]}
        scale={[1.2, 0.45, 0.85]}
        castShadow
      >
        <sphereGeometry args={[0.034, 16, 12]} />
        <meshStandardMaterial color="#8ecae6" roughness={0.9} />
      </mesh>
    </group>
  );
}

export const PROCEDURAL_ACCESSORIES: Readonly<Record<string, ComponentType<ProceduralAccessoryProps>>> = {
  TopHat,
  PartyHat,
  WitchHat,
  CowboyHat,
  Crown,
  WizardHat,
  PirateHat,
  Sunglasses,
  Eyepatch,
  Bowtie,
  Collar,
  Scarf,
  Sweater,
  Cape,
  Tutu,
  Wings,
  Backpack,
  Socks: ({ bone }) => <Socks bone={bone ?? 'paw_L'} />,
  Boots: ({ bone }) => <Boots bone={bone ?? 'paw_L'} />,
  Slippers,
};
