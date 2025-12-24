import { Hands, Results } from '@mediapipe/hands';
import { HandGesture } from '@/types';

export class GestureDetector {
  private hands: Hands | null = null;
  private onResultsCallback: ((gestures: HandGesture[]) => void) | null = null;

  async initialize(): Promise<void> {
    this.hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    this.hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    this.hands.onResults((results: Results) => {
      this.handleResults(results);
    });

    await this.hands.initialize();
  }

  private handleResults(results: Results): void {
    if (!this.onResultsCallback) return;

    const gestures: HandGesture[] = [];

    if (results.multiHandLandmarks && results.multiHandedness) {
      for (let i = 0; i < results.multiHandLandmarks.length; i++) {
        const landmarks = results.multiHandLandmarks[i];
        const handedness = results.multiHandedness[i];

        const gesture: HandGesture = {
          landmarks: landmarks.map((lm) => ({
            x: lm.x,
            y: lm.y,
            z: lm.z,
          })),
          handedness: handedness.label as 'Left' | 'Right',
          confidence: handedness.score,
        };

        gestures.push(gesture);
      }
    }

    this.onResultsCallback(gestures);
  }

  async processFrame(videoElement: HTMLVideoElement): Promise<void> {
    if (!this.hands) {
      throw new Error('GestureDetector not initialized');
    }
    await this.hands.send({ image: videoElement });
  }

  onResults(callback: (gestures: HandGesture[]) => void): void {
    this.onResultsCallback = callback;
  }

  detectPinchGesture(gesture: HandGesture): boolean {
    const thumbTip = gesture.landmarks[4];
    const indexTip = gesture.landmarks[8];
    
    const distance = Math.sqrt(
      Math.pow(thumbTip.x - indexTip.x, 2) +
      Math.pow(thumbTip.y - indexTip.y, 2)
    );
    
    return distance < 0.05;
  }

  detectOpenPalm(gesture: HandGesture): boolean {
    const fingerTips = [8, 12, 16, 20];
    const fingerBases = [6, 10, 14, 18];
    
    let extendedFingers = 0;
    
    for (let i = 0; i < fingerTips.length; i++) {
      const tip = gesture.landmarks[fingerTips[i]];
      const base = gesture.landmarks[fingerBases[i]];
      
      if (tip.y < base.y) {
        extendedFingers++;
      }
    }
    
    return extendedFingers >= 3;
  }

  getHandPosition(gesture: HandGesture): { x: number; y: number } {
    const wrist = gesture.landmarks[0];
    return { x: wrist.x, y: wrist.y };
  }

  destroy(): void {
    if (this.hands) {
      this.hands.close();
      this.hands = null;
    }
    this.onResultsCallback = null;
  }
}
