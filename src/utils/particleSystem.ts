import { Particle } from '@/types';

export class ParticleSystem {
  private particles: Particle[] = [];
  private maxParticles: number;

  constructor(maxParticles: number = 500) {
    this.maxParticles = maxParticles;
  }

  addParticle(x: number, y: number, type: Particle['type'] = 'sparkle'): void {
    if (this.particles.length >= this.maxParticles) {
      this.particles.shift();
    }

    const particle: Particle = {
      x,
      y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: 1,
      maxLife: 60 + Math.random() * 60,
      size: 2 + Math.random() * 4,
      color: this.getColorForType(type),
      alpha: 1,
      type,
    };

    this.particles.push(particle);
  }

  addParticleBurst(x: number, y: number, count: number, type: Particle['type'] = 'magic'): void {
    for (let i = 0; i < count; i++) {
      this.addParticle(x, y, type);
    }
  }

  update(): void {
    this.particles = this.particles.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.1;
      particle.life--;
      particle.alpha = particle.life / particle.maxLife;
      
      return particle.life > 0;
    });
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.particles.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = particle.color;
      
      if (particle.type === 'sparkle') {
        this.drawSparkle(ctx, particle);
      } else if (particle.type === 'snow') {
        this.drawSnowflake(ctx, particle);
      } else {
        this.drawCircle(ctx, particle);
      }
      
      ctx.restore();
    });
  }

  private drawCircle(ctx: CanvasRenderingContext2D, particle: Particle): void {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawSparkle(ctx: CanvasRenderingContext2D, particle: Particle): void {
    const size = particle.size;
    ctx.beginPath();
    ctx.moveTo(particle.x, particle.y - size);
    ctx.lineTo(particle.x, particle.y + size);
    ctx.moveTo(particle.x - size, particle.y);
    ctx.lineTo(particle.x + size, particle.y);
    ctx.strokeStyle = particle.color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  private drawSnowflake(ctx: CanvasRenderingContext2D, particle: Particle): void {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
  }

  private getColorForType(type: Particle['type']): string {
    const colors = {
      sparkle: ['#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3'],
      snow: ['#FFFFFF', '#E8F8FF'],
      magic: ['#FF69B4', '#9370DB', '#00CED1', '#FFD700'],
    };
    
    const colorArray = colors[type];
    return colorArray[Math.floor(Math.random() * colorArray.length)];
  }

  getParticleCount(): number {
    return this.particles.length;
  }

  clear(): void {
    this.particles = [];
  }
}
