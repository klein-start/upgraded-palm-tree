export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
  type: 'sparkle' | 'snow' | 'magic';
}

export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

export interface HandGesture {
  landmarks: HandLandmark[];
  handedness: 'Left' | 'Right';
  confidence: number;
}

export interface AppState {
  isRunning: boolean;
  isCameraReady: boolean;
  error: string | null;
  fps: number;
}

export interface FrameConfig {
  width: number;
  height: number;
  scale: number;
}

export interface ChristmasTreeConfig {
  x: number;
  y: number;
  height: number;
  width: number;
  layers: number;
}

export interface CameraOptions {
  width: number;
  height: number;
  facingMode: 'user' | 'environment';
}

export interface CameraError {
  type: 'permission' | 'notFound' | 'inUse' | 'constraint' | 'notSupported' | 'security' | 'unknown';
  message: string;
  userMessage: string;
}
