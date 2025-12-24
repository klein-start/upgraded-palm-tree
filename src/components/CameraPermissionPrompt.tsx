import React from 'react';
import { CameraError } from '@/types';

interface CameraPermissionPromptProps {
  error: CameraError | null;
  isRequesting: boolean;
  onRequest: () => void;
  onRetry: () => void;
}

export const CameraPermissionPrompt: React.FC<CameraPermissionPromptProps> = ({
  error,
  isRequesting,
  onRequest,
  onRetry,
}) => {
  const hasMediaDevices = Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  const isSecureContext = window.isSecureContext;

  const getIcon = () => {
    if (isRequesting) return '⏳';
    if (!error) return '📹';

    switch (error.type) {
      case 'permission':
        return '🔒';
      case 'notFound':
        return '📷';
      case 'inUse':
        return '⚠️';
      case 'notSupported':
        return '🚫';
      case 'security':
        return '🔐';
      default:
        return '❌';
    }
  };

  const getTitle = () => {
    if (isRequesting) return '正在请求摄像头权限...';
    if (!error) return '请求摄像头权限';

    switch (error.type) {
      case 'permission':
        return '需要摄像头权限';
      case 'notFound':
        return '未找到摄像头';
      case 'inUse':
        return '摄像头被占用';
      case 'notSupported':
        return '浏览器不支持';
      case 'security':
        return '安全限制';
      default:
        return '摄像头错误';
    }
  };

  const getMainMessage = () => {
    if (isRequesting) {
      return '如果浏览器没有弹出权限提示，请点击下方“允许摄像头访问”按钮（需要用户点击触发）。';
    }

    if (error) return error.userMessage;

    return '本应用需要访问您的摄像头以进行手势识别。点击下方按钮后，浏览器会提示您授予摄像头权限。';
  };

  const renderInstructions = () => {
    if (!error) {
      return (
        <div style={styles.instructions}>
          <p style={styles.instructionTitle}>使用建议</p>
          <ul style={styles.stepList}>
            <li>请确保您正在使用 Chrome / Edge / Firefox 等现代浏览器</li>
            <li>建议在 Windows 上优先使用 Edge 或 Chrome</li>
            <li>如果曾拒绝过权限，请在地址栏权限设置中改为允许</li>
          </ul>
        </div>
      );
    }

    switch (error.type) {
      case 'permission':
        return (
          <div style={styles.instructions}>
            <p style={styles.instructionTitle}>如何重新启用权限</p>
            <ol style={styles.stepList}>
              <li>点击浏览器地址栏左侧的锁形图标</li>
              <li>找到“摄像头 / Camera”权限</li>
              <li>设置为“允许”</li>
              <li>点击下方“重新尝试”按钮</li>
            </ol>
          </div>
        );

      case 'notFound':
        return (
          <div style={styles.instructions}>
            <p style={styles.instructionTitle}>排查建议</p>
            <ul style={styles.stepList}>
              <li>检查摄像头是否已连接</li>
              <li>检查摄像头驱动是否正常</li>
              <li>尝试在系统相机应用中打开摄像头</li>
            </ul>
          </div>
        );

      case 'inUse':
        return (
          <div style={styles.instructions}>
            <p style={styles.instructionTitle}>排查建议</p>
            <ul style={styles.stepList}>
              <li>关闭 Zoom/Teams/Skype 等视频会议软件</li>
              <li>关闭其他可能占用摄像头的浏览器标签页</li>
              <li>关闭系统相机应用后重试</li>
            </ul>
          </div>
        );

      case 'security':
        return (
          <div style={styles.instructions}>
            <p style={styles.instructionTitle}>说明</p>
            <ul style={styles.stepList}>
              <li>浏览器只允许在 HTTPS 或 localhost 下访问摄像头</li>
              <li>请使用 https:// 访问，或在本机 localhost 环境运行</li>
            </ul>
          </div>
        );

      case 'notSupported':
        return (
          <div style={styles.instructions}>
            <p style={styles.instructionTitle}>推荐浏览器</p>
            <ul style={styles.stepList}>
              <li>Google Chrome</li>
              <li>Microsoft Edge</li>
              <li>Mozilla Firefox</li>
            </ul>
          </div>
        );

      default:
        return (
          <div style={styles.instructions}>
            <p style={styles.instructionTitle}>排查建议</p>
            <ul style={styles.stepList}>
              <li>刷新页面</li>
              <li>重启浏览器</li>
              <li>查看浏览器控制台日志（Console）</li>
            </ul>
          </div>
        );
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.iconContainer}>
          <span style={styles.icon}>{getIcon()}</span>
        </div>

        <h2 style={styles.title}>{getTitle()}</h2>

        <div style={styles.mainMessage}>{getMainMessage()}</div>

        <div style={styles.compatibility}>
          <div style={styles.compatibilityTitle}>浏览器兼容性检查</div>
          <div style={styles.compatibilityRow}>
            <span>安全环境 (HTTPS/localhost)</span>
            <span style={{ color: isSecureContext ? '#2E7D32' : '#C62828', fontWeight: 'bold' }}>
              {isSecureContext ? '✓' : '×'}
            </span>
          </div>
          <div style={styles.compatibilityRow}>
            <span>MediaDevices / getUserMedia</span>
            <span style={{ color: hasMediaDevices ? '#2E7D32' : '#C62828', fontWeight: 'bold' }}>
              {hasMediaDevices ? '✓' : '×'}
            </span>
          </div>
        </div>

        {error && (
          <details style={styles.details}>
            <summary style={styles.detailsSummary}>查看技术详情</summary>
            <div style={styles.detailsBody}>
              <div>type: {error.type}</div>
              <div>message: {error.message}</div>
            </div>
          </details>
        )}

        {renderInstructions()}

        <div style={styles.buttonGroup}>
          <button onClick={onRequest} style={{ ...styles.button, ...styles.primaryButton }}>
            📹 允许摄像头访问
          </button>
          <button onClick={onRetry} style={{ ...styles.button, ...styles.secondaryButton }}>
            🔄 重新尝试
          </button>
        </div>

        <div style={styles.footer}>
          <small style={styles.footerText}>
            我们不会记录或存储任何摄像头画面，所有处理都在您的设备本地进行。
          </small>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(10px)',
  },
  modal: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    borderRadius: '20px',
    padding: '36px',
    maxWidth: '560px',
    width: '92%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
    animation: 'slideIn 0.3s ease-out',
  },
  iconContainer: {
    marginBottom: '16px',
  },
  icon: {
    fontSize: '56px',
    display: 'inline-block',
    animation: 'bounce 1s ease infinite',
  },
  title: {
    margin: '0 0 12px 0',
    fontSize: '26px',
    fontWeight: 'bold',
    color: '#333',
  },
  mainMessage: {
    background: 'linear-gradient(135deg, #fff5f5 0%, #ffe0e0 100%)',
    color: '#333',
    padding: '14px',
    borderRadius: '12px',
    marginBottom: '14px',
    fontSize: '14px',
    lineHeight: '1.6',
    border: '1px solid rgba(0,0,0,0.06)',
    textAlign: 'left',
  },
  compatibility: {
    background: '#f1f8ff',
    borderRadius: '12px',
    padding: '14px',
    marginBottom: '14px',
    textAlign: 'left',
    border: '1px solid rgba(21, 101, 192, 0.15)',
  },
  compatibilityTitle: {
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#0d47a1',
  },
  compatibilityRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#1b1b1b',
    marginBottom: '6px',
  },
  details: {
    marginBottom: '14px',
    textAlign: 'left',
    background: '#f7f7f7',
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid rgba(0,0,0,0.06)',
  },
  detailsSummary: {
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#333',
  },
  detailsBody: {
    marginTop: '8px',
    fontFamily: 'monospace',
    fontSize: '12px',
    color: '#555',
    lineHeight: '1.5',
    wordBreak: 'break-word',
  },
  instructions: {
    background: '#f8f9fa',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
    textAlign: 'left',
    color: '#555',
    fontSize: '14px',
    lineHeight: '1.6',
  },
  instructionTitle: {
    margin: '0 0 10px 0',
    fontWeight: 'bold',
    color: '#333',
  },
  stepList: {
    margin: 0,
    paddingLeft: '20px',
  },
  buttonGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '12px',
  },
  button: {
    padding: '14px 12px',
    fontSize: '16px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  },
  secondaryButton: {
    background: 'linear-gradient(135deg, #FFA726 0%, #FB8C00 100%)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(251, 140, 0, 0.25)',
  },
  footer: {
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: '1px solid #e0e0e0',
  },
  footerText: {
    color: '#999',
    fontSize: '12px',
    lineHeight: '1.5',
  },
};
