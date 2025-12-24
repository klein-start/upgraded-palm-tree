import { ChristmasTreeConfig, FrameConfig } from '@/types';

export const clearCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
  ctx.clearRect(0, 0, width, height);
};

export const drawChristmasTree = (
  ctx: CanvasRenderingContext2D,
  config: ChristmasTreeConfig
): void => {
  const { x, y, height, width, layers } = config;
  
  ctx.fillStyle = '#8B4513';
  const trunkWidth = width * 0.2;
  const trunkHeight = height * 0.15;
  ctx.fillRect(x - trunkWidth / 2, y, trunkWidth, trunkHeight);
  
  const layerHeight = (height - trunkHeight) / layers;
  const layerWidthStep = width / layers;
  
  for (let i = 0; i < layers; i++) {
    const layerY = y - (i * layerHeight);
    const layerWidth = width - (i * layerWidthStep);
    
    ctx.fillStyle = i % 2 === 0 ? '#228B22' : '#2E8B57';
    
    ctx.beginPath();
    ctx.moveTo(x, layerY - layerHeight);
    ctx.lineTo(x - layerWidth / 2, layerY);
    ctx.lineTo(x + layerWidth / 2, layerY);
    ctx.closePath();
    ctx.fill();
  }
  
  const starSize = width * 0.15;
  drawStar(ctx, x, y - height + trunkHeight, starSize, '#FFD700');
};

export const drawStar = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
): void => {
  ctx.fillStyle = color;
  ctx.beginPath();
  
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    const xPos = x + Math.cos(angle) * size;
    const yPos = y + Math.sin(angle) * size;
    
    if (i === 0) {
      ctx.moveTo(xPos, yPos);
    } else {
      ctx.lineTo(xPos, yPos);
    }
    
    const innerAngle = angle + Math.PI / 5;
    const innerX = x + Math.cos(innerAngle) * (size * 0.4);
    const innerY = y + Math.sin(innerAngle) * (size * 0.4);
    ctx.lineTo(innerX, innerY);
  }
  
  ctx.closePath();
  ctx.fill();
};

export const getCanvasConfig = (container: HTMLElement): FrameConfig => {
  const rect = container.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  
  return {
    width: rect.width,
    height: rect.height,
    scale,
  };
};

export const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
