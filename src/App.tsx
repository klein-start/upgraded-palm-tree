import { useState, useRef, useEffect, useCallback } from 'react';
import { CanvasContainer, CanvasContainerHandle } from './components/CanvasContainer';
import { ControlPanel } from './components/ControlPanel';
import { FPSMonitor } from './components/FPSMonitor';
import { CameraView } from './components/CameraView';
import { useCamera } from './hooks/useCamera';
import { useFPS } from './hooks/useFPS';
import { useAnimationFrame } from './hooks/useAnimationFrame';
import { ParticleSystem } from './utils/particleSystem';
import { GestureDetector } from './utils/gestureDetector';
import { drawChristmasTree, clearCanvas } from './utils/canvasUtils';
import { HandGesture } from './types';

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [particleCount, setParticleCount] = useState(0);

  const canvasRef = useRef<CanvasContainerHandle>(null);
  const particleSystemRef = useRef<ParticleSystem>(new ParticleSystem(500));
  const gestureDetectorRef = useRef<GestureDetector>(new GestureDetector());
  const gesturesRef = useRef<HandGesture[]>([]);

  const { videoRef, isReady: isCameraReady, error: cameraError } = useCamera({
    width: 1280,
    height: 720,
    facingMode: 'user',
  });

  const fps = useFPS(isRunning);

  useEffect(() => {
    if (cameraError) {
      setError(cameraError);
    }
  }, [cameraError]);

  useEffect(() => {
    if (!isCameraReady || !videoRef.current) return;

    const detector = gestureDetectorRef.current;

    const initGestureDetector = async () => {
      try {
        await detector.initialize();
        
        detector.onResults((gestures) => {
          gesturesRef.current = gestures;
        });
      } catch (err) {
        setError('手势识别初始化失败');
        console.error(err);
      }
    };

    initGestureDetector();

    return () => {
      detector.destroy();
    };
  }, [isCameraReady, videoRef]);

  const renderFrame = useCallback(() => {
    const ctx = canvasRef.current?.getContext();
    const canvas = canvasRef.current?.getCanvas();
    
    if (!ctx || !canvas) return;

    const width = canvas.width / window.devicePixelRatio;
    const height = canvas.height / window.devicePixelRatio;

    clearCanvas(ctx, width, height);

    drawChristmasTree(ctx, {
      x: width / 2,
      y: height - 50,
      height: height * 0.6,
      width: width * 0.3,
      layers: 5,
    });

    if (gesturesRef.current.length > 0) {
      gesturesRef.current.forEach((gesture) => {
        const detector = gestureDetectorRef.current;
        const position = detector.getHandPosition(gesture);
        
        const canvasX = position.x * width;
        const canvasY = position.y * height;

        if (detector.detectPinchGesture(gesture)) {
          particleSystemRef.current.addParticleBurst(canvasX, canvasY, 3, 'magic');
        } else if (detector.detectOpenPalm(gesture)) {
          particleSystemRef.current.addParticle(canvasX, canvasY, 'sparkle');
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, 10, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    particleSystemRef.current.update();
    particleSystemRef.current.draw(ctx);
    
    setParticleCount(particleSystemRef.current.getParticleCount());
  }, []);

  useAnimationFrame(() => {
    if (videoRef.current && isCameraReady) {
      gestureDetectorRef.current.processFrame(videoRef.current).catch(() => {
        // Silently handle errors
      });
    }
    renderFrame();
  }, isRunning);

  const handleStart = () => {
    if (isCameraReady) {
      setIsRunning(true);
      setError(null);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    particleSystemRef.current.clear();
  };

  return (
    <div style={styles.app}>
      <div style={styles.background}>
        <CameraView videoRef={videoRef} isReady={isCameraReady} />
      </div>
      
      <div style={styles.canvasLayer}>
        <CanvasContainer ref={canvasRef} />
      </div>

      <ControlPanel
        isRunning={isRunning}
        isCameraReady={isCameraReady}
        onStart={handleStart}
        onStop={handleStop}
        error={error}
      />

      {isRunning && (
        <FPSMonitor fps={fps} particleCount={particleCount} />
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  app: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    background: '#000',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  canvasLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
};

export default App;
