declare module 'three-nebula' {
  import * as THREE from 'three';

  export class System {
    constructor(THREE: typeof THREE, preParticles?: number, integrationType?: string);
    addEmitter(emitter: Emitter): System;
    addRenderer(renderer: any): System;
    emit(hooks: {
      onStart?: () => void;
      onUpdate?: () => void;
      onEnd?: () => void;
    }): Promise<any>;
    destroy(): void;
  }

  export class Emitter {
    constructor();
    setRate(rate: Rate): Emitter;
    setInitializers(initializers: any[]): Emitter;
    setBehaviours(behaviours: any[]): Emitter;
  }

  export class Rate {
    constructor(numPan: Span, timePan: Span);
  }

  export class Span {
    constructor(a: number, b?: number);
  }

  export class Position {
    constructor(zone: any);
  }

  export class Mass {
    constructor(a: number, b?: number);
  }

  export class Radius {
    constructor(a: number, b?: number);
  }

  export class Life {
    constructor(a: number, b?: number);
  }

  export class RadialVelocity {
    constructor(radius: number, vector3d: Vector3D, angle?: number);
  }

  export class Vector3D {
    constructor(x: number, y: number, z: number);
  }

  export class Alpha {
    constructor(a: number, b: number, life?: Span, easing?: any);
  }

  export class Scale {
    constructor(a: number, b: number, life?: Span, easing?: any);
  }

  export class Color {
    constructor(a: THREE.Color, b: THREE.Color, c?: THREE.Color, d?: THREE.Color, life?: Span, easing?: any);
  }

  export class Force {
    constructor(fx: number, fy: number, fz: number);
  }

  export class SpriteRenderer {
    constructor(scene: THREE.Scene, THREE: typeof THREE);
  }

  export class PointZone {
    constructor(x: number, y: number, z?: number);
  }

  export class SphereZone {
    constructor(x: number, y: number, z: number, radius: number);
  }

  export default System;
}