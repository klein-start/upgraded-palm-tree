import React from 'react';
import { CameraError } from '@/types';

interface ControlPanelProps {
  isRunning: boolean;
  isCameraReady: boolean;
  onStart: () => void;
  onStop: () => void;
  onRequestCameraPermission: () => void;
  appError?: string | null;
  cameraError?: CameraError | null;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isRunning,
  isCameraReady,
  onStart,
  onStop,
  onRequestCameraPermission,
  appError,
  cameraError,
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.panel}>
        <h2 style={styles.title}>圣诞树手势交互</h2>
        
        <div style={styles.status}>
          <div style={styles.statusItem}>
            <span style={styles.statusLabel}>摄像头状态:</span>
            <span style={{
              ...styles.statusValue,
              color: isCameraReady ? '#4CAF50' : '#FF5722'
            }}>
              {isCameraReady ? '✓ 就绪' : '× 未就绪'}
            </span>
          </div>
          
          <div style={styles.statusItem}>
            <span style={styles.statusLabel}>运行状态:</span>
            <span style={{
              ...styles.statusValue,
              color: isRunning ? '#4CAF50' : '#9E9E9E'
            }}>
              {isRunning ? '▶ 运行中' : '⏸ 已暂停'}
            </span>
          </div>
        </div>

        {cameraError && (
          <div style={styles.error}>
            <div style={styles.errorTitle}>📹 摄像头错误</div>
            <div style={styles.errorMessage}>{cameraError.userMessage}</div>
            <div style={styles.errorDetails}>错误类型: {cameraError.type}</div>
            <div style={styles.errorDetails}>技术信息: {cameraError.message}</div>
            {cameraError.type === 'permission' && (
              <div style={styles.errorHint}>
                💡 点击下方"重新请求权限"按钮，或在浏览器地址栏中检查权限设置
              </div>
            )}
          </div>
        )}

        {appError && !cameraError && (
          <div style={styles.error}>
            ⚠️ {appError}
          </div>
        )}

        {!isCameraReady && !cameraError && (
          <div style={styles.info}>
            <div style={styles.infoIcon}>🔄</div>
            <div>正在初始化摄像头...</div>
            <div style={styles.infoHint}>首次使用时，浏览器会弹出权限请求提示</div>
          </div>
        )}

        <div style={styles.controls}>
          {cameraError ? (
            <button
              onClick={onRequestCameraPermission}
              style={{
                ...styles.button,
                ...styles.retryButton
              }}
            >
              🔄 重新请求权限
            </button>
          ) : !isRunning ? (
            <button
              onClick={onStart}
              disabled={!isCameraReady}
              style={{
                ...styles.button,
                ...styles.startButton,
                ...(isCameraReady ? {} : styles.buttonDisabled)
              }}
            >
              开始体验
            </button>
          ) : (
            <button
              onClick={onStop}
              style={{
                ...styles.button,
                ...styles.stopButton
              }}
            >
              停止
            </button>
          )}
        </div>

        <div style={styles.instructions}>
          <p style={styles.instructionTitle}>使用说明：</p>
          <ul style={styles.instructionList}>
            <li>张开手掌靠近圣诞树触发粒子效果</li>
            <li>捏合手指（拇指和食指）产生魔法粒子</li>
            <li>移动手部可以与粒子互动</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    zIndex: 1000,
  },
  panel: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    minWidth: '280px',
    backdropFilter: 'blur(10px)',
  },
  title: {
    margin: '0 0 16px 0',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  status: {
    marginBottom: '16px',
  },
  statusItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '14px',
  },
  statusLabel: {
    color: '#666',
  },
  statusValue: {
    fontWeight: 'bold',
  },
  error: {
    background: '#FFEBEE',
    color: '#C62828',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  errorTitle: {
    fontWeight: 'bold',
    marginBottom: '6px',
  },
  errorMessage: {
    lineHeight: 1.5,
    marginBottom: '6px',
  },
  errorDetails: {
    fontSize: '11px',
    color: '#A00000',
    marginBottom: '4px',
    fontFamily: 'monospace',
  },
  errorHint: {
    marginTop: '8px',
    fontSize: '12px',
    color: '#8E0000',
    lineHeight: 1.4,
  },
  info: {
    background: '#E3F2FD',
    color: '#1565C0',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '16px',
    fontSize: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  infoIcon: {
    fontWeight: 'bold',
  },
  infoHint: {
    fontSize: '12px',
    color: '#1976D2',
  },
  controls: {
    marginBottom: '16px',
  },
  button: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  startButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  stopButton: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white',
  },
  retryButton: {
    background: 'linear-gradient(135deg, #FFA726 0%, #FB8C00 100%)',
    color: 'white',
  },
  buttonDisabled: {
    background: '#E0E0E0',
    color: '#9E9E9E',
    cursor: 'not-allowed',
  },
  instructions: {
    background: '#F5F5F5',
    borderRadius: '6px',
    padding: '12px',
    fontSize: '13px',
  },
  instructionTitle: {
    margin: '0 0 8px 0',
    fontWeight: 'bold',
    color: '#333',
  },
  instructionList: {
    margin: '0',
    paddingLeft: '20px',
    color: '#666',
  },
};
