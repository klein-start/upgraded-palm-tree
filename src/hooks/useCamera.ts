import { useEffect, useRef, useState } from 'react';
import { CameraOptions } from '@/types';

export const useCamera = (options: CameraOptions) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: options.width,
            height: options.height,
            facingMode: options.facingMode,
          },
        });

        if (!mounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (mounted) {
              setIsReady(true);
              setError(null);
            }
          };
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : '无法访问摄像头');
          setIsReady(false);
        }
      }
    };

    startCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setIsReady(false);
    };
  }, [options.width, options.height, options.facingMode]);

  return { videoRef, isReady, error };
};
