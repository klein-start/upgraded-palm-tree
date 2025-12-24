export class ImageManager {
  private images: Map<string, HTMLImageElement> = new Map();
  private loadingPromises: Map<string, Promise<HTMLImageElement>> = new Map();

  async loadImage(key: string, url: string): Promise<HTMLImageElement> {
    if (this.images.has(key)) {
      return this.images.get(key)!;
    }

    if (this.loadingPromises.has(key)) {
      return this.loadingPromises.get(key)!;
    }

    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.images.set(key, img);
        this.loadingPromises.delete(key);
        resolve(img);
      };
      
      img.onerror = () => {
        this.loadingPromises.delete(key);
        reject(new Error(`Failed to load image: ${url}`));
      };
      
      img.src = url;
    });

    this.loadingPromises.set(key, promise);
    return promise;
  }

  async loadImages(images: Array<{ key: string; url: string }>): Promise<void> {
    const promises = images.map(({ key, url }) => this.loadImage(key, url));
    await Promise.all(promises);
  }

  getImage(key: string): HTMLImageElement | null {
    return this.images.get(key) || null;
  }

  hasImage(key: string): boolean {
    return this.images.has(key);
  }

  clear(): void {
    this.images.clear();
    this.loadingPromises.clear();
  }
}

export const imageManager = new ImageManager();
