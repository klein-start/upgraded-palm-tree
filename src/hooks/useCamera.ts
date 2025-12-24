import { useEffect, useRef, useState, useCallback } from 'react';
import { CameraOptions, CameraError } from '@/types';

type StartTrigger = 'auto' | 'user';

export const useCamera = (options: CameraOptions) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(true);
  const requestSeqRef = useRef(0);

  const [isReady, setIsReady] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState<CameraError | null>(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const getErrorDetails = useCallback((err: unknown): CameraError => {
    if (!(err instanceof Error)) {
      return {
        type: 'unknown',
        message: '未知错误',
        userMessage: '无法访问摄像头，请稍后重试',
      };
    }

    const errorName = err.name;

    switch (errorName) {
      case 'NotAllowedError':
      case 'PermissionDeniedError':
        return {
          type: 'permission',
          message: err.message,
          userMessage:
            '摄像头权限被拒绝或未弹出权限提示。请点击“重新请求权限”按钮，或在浏览器地址栏权限设置中允许摄像头访问。',
        };

      case 'NotFoundError':
      case 'DevicesNotFoundError':
        return {
          type: 'notFound',
          message: err.message,
          userMessage: '未检测到摄像头设备。请确保电脑已连接摄像头，并检查系统设备管理器/驱动。',
        };

      case 'NotReadableError':
      case 'TrackStartError':
        return {
          type: 'inUse',
          message: err.message,
          userMessage: '摄像头可能被其他应用占用。请关闭 Zoom/Teams/相机应用或其他网页后重试。',
        };

      case 'OverconstrainedError':
      case 'ConstraintNotSatisfiedError':
        return {
          type: 'constraint',
          message: err.message,
          userMessage: '摄像头不支持当前请求的分辨率/配置，将尝试使用默认设置。',
        };

      case 'NotSupportedError':
        return {
          type: 'notSupported',
          message: err.message,
          userMessage: '您的浏览器不支持摄像头访问。请使用 Chrome / Edge / Firefox 等现代浏览器。',
        };

      case 'SecurityError':
        return {
          type: 'security',
          message: err.message,
          userMessage: '安全限制：请确保网站使用 HTTPS 或在 localhost 环境运行。',
        };

      default:
        return {
          type: 'unknown',
          message: `${errorName}: ${err.message}`,
          userMessage: `摄像头启动失败：${err.message}`,
        };
    }
  }, []);

  const startCamera = useCallback(
    async ({ fallback = false, trigger = 'auto' }: { fallback?: boolean; trigger?: StartTrigger } = {}) => {
      const requestId = ++requestSeqRef.current;

      console.log('[Camera] start', {
        requestId,
        trigger,
        fallback,
        isSecureContext: window.isSecureContext,
        hasMediaDevices: Boolean(navigator.mediaDevices),
      });

      if (!window.isSecureContext) {
        setError({
          type: 'security',
          message: 'Not a secure context',
          userMessage: '安全限制：请使用 HTTPS 或 localhost 访问本应用，否则浏览器不会弹出摄像头权限提示。',
        });
        setIsReady(false);
        setIsRequesting(false);
        return;
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError({
          type: 'notSupported',
          message: 'MediaDevices.getUserMedia not available',
          userMessage: '当前浏览器不支持摄像头访问（navigator.mediaDevices/getUserMedia 不可用）。请更换浏览器后重试。',
        });
        setIsReady(false);
        setIsRequesting(false);
        return;
      }

      if (trigger === 'user') {
        setError(null);
      }

      setIsRequesting(true);
      setIsReady(false);

      const buildConstraints = (useFallback: boolean): MediaStreamConstraints => {
        if (useFallback) {
          return {
            video: {
              facingMode: options.facingMode,
            },
          };
        }

        return {
          video: {
            width: { ideal: options.width },
            height: { ideal: options.height },
            facingMode: options.facingMode,
          },
        };
      };

      const tryGetStream = async (useFallback: boolean) => {
        const constraints = buildConstraints(useFallback);
        console.log('[Camera] getUserMedia', { requestId, constraints });
        return navigator.mediaDevices.getUserMedia(constraints);
      };

      try {
        stopStream();

        let stream: MediaStream;
        try {
          stream = await tryGetStream(fallback);
        } catch (err) {
          const details = getErrorDetails(err);
          console.error('[Camera] getUserMedia failed', details);

          if (details.type === 'constraint' && !fallback) {
            console.log('[Camera] retry with fallback constraints');
            stream = await tryGetStream(true);
          } else {
            throw err;
          }
        }

        if (!mountedRef.current || requestId !== requestSeqRef.current) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        streamRef.current = stream;

        const videoEl = videoRef.current;
        if (videoEl) {
          videoEl.srcObject = stream;
          try {
            await videoEl.play();
          } catch (playErr) {
            console.warn('[Camera] video.play failed (may still be ok)', playErr);
          }
        }

        if (!mountedRef.current || requestId !== requestSeqRef.current) {
          return;
        }

        console.log('[Camera] ready', { requestId });
        setIsReady(true);
        setError(null);
      } catch (err) {
        if (!mountedRef.current || requestId !== requestSeqRef.current) {
          return;
        }

        const details = getErrorDetails(err);
        console.error('[Camera] start failed', details);
        setError(details);
        setIsReady(false);
      } finally {
        if (mountedRef.current && requestId === requestSeqRef.current) {
          setIsRequesting(false);
        }
      }
    },
    [getErrorDetails, options.facingMode, options.height, options.width, stopStream]
  );

  const requestPermission = useCallback(() => {
    void startCamera({ fallback: false, trigger: 'user' });
  }, [startCamera]);

  useEffect(() => {
    mountedRef.current = true;
    void startCamera({ fallback: false, trigger: 'auto' });

    return () => {
      mountedRef.current = false;
      stopStream();
      setIsReady(false);
      setIsRequesting(false);
    };
  }, [startCamera, stopStream]);

  return {
    videoRef,
    isReady,
    isRequesting,
    error,
    requestPermission,
  };
};
