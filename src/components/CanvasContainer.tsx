import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { getCanvasConfig } from '@/utils/canvasUtils';

interface CanvasContainerProps {
  width?: number;
  height?: number;
  className?: string;
}

export interface CanvasContainerHandle {
  getContext: () => CanvasRenderingContext2D | null;
  getCanvas: () => HTMLCanvasElement | null;
  clear: () => void;
}

export const CanvasContainer = forwardRef<CanvasContainerHandle, CanvasContainerProps>(
  ({ width, height, className = '' }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      getContext: () => {
        return canvasRef.current?.getContext('2d') || null;
      },
      getCanvas: () => {
        return canvasRef.current;
      },
      clear: () => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx && canvasRef.current) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      
      if (!canvas || !container) return;

      const updateCanvasSize = () => {
        const config = getCanvasConfig(container);
        canvas.width = config.width * config.scale;
        canvas.height = config.height * config.scale;
        canvas.style.width = `${config.width}px`;
        canvas.style.height = `${config.height}px`;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(config.scale, config.scale);
        }
      };

      updateCanvasSize();
      window.addEventListener('resize', updateCanvasSize);

      return () => {
        window.removeEventListener('resize', updateCanvasSize);
      };
    }, []);

    const containerStyle: React.CSSProperties = {
      width: width || '100%',
      height: height || '100%',
      position: 'relative',
      overflow: 'hidden',
    };

    return (
      <div ref={containerRef} style={containerStyle} className={className}>
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
          }}
        />
      </div>
    );
  }
);

CanvasContainer.displayName = 'CanvasContainer';
