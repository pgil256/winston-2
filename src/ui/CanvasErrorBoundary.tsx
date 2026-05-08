import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class CanvasErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[Winston] Canvas mount failed:', error, info);
  }

  override render(): ReactNode {
    if (this.state.error) {
      const isWebGL = /webgl/i.test(this.state.error.message);
      return (
        <div className="canvas-error">
          <h2>Couldn't start the 3D view</h2>
          <p>
            {isWebGL
              ? 'Your browser couldn\'t create a WebGL context. Try updating your graphics driver or enabling hardware acceleration in your browser settings.'
              : 'An error occurred while initialising the scene.'}
          </p>
          <pre>{this.state.error.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
