import React from 'react';

interface FPSMonitorProps {
  fps: number;
  particleCount?: number;
}

export const FPSMonitor: React.FC<FPSMonitorProps> = ({ fps, particleCount = 0 }) => {
  const getFPSColor = (fps: number): string => {
    if (fps >= 50) return '#4CAF50';
    if (fps >= 30) return '#FF9800';
    return '#F44336';
  };

  return (
    <div style={styles.container}>
      <div style={styles.item}>
        <span style={styles.label}>FPS:</span>
        <span style={{ ...styles.value, color: getFPSColor(fps) }}>
          {fps}
        </span>
      </div>
      
      <div style={styles.separator}>|</div>
      
      <div style={styles.item}>
        <span style={styles.label}>粒子:</span>
        <span style={styles.value}>
          {particleCount}
        </span>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '12px 16px',
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  label: {
    opacity: 0.8,
  },
  value: {
    fontWeight: 'bold',
    fontSize: '16px',
  },
  separator: {
    opacity: 0.5,
  },
};
