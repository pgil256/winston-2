import { Suspense } from 'react';
import { FerretRig } from '../ferret/FerretRig';
import { EnvironmentRenderer } from '../environments/EnvironmentRenderer';

export function Scene(): JSX.Element {
  return (
    <>
      <EnvironmentRenderer />
      <Suspense fallback={null}>
        <FerretRig />
      </Suspense>
    </>
  );
}
