# 圣诞树手势交互娱乐程序

一个基于React + TypeScript + MediaPipe的交互式圣诞树应用，通过摄像头捕捉手势，与屏幕上的圣诞树和粒子效果进行互动。

## 功能特性

- 🎄 **动态圣诞树渲染** - 使用Canvas绘制精美的圣诞树
- 👋 **实时手势识别** - 基于MediaPipe Hands的高精度手势检测
- ✨ **粒子特效系统** - 多种类型的粒子效果（闪光、雪花、魔法）
- 📊 **性能监控** - 实时FPS和粒子数量显示
- 📱 **响应式设计** - 自适应不同屏幕尺寸

## 手势交互

- **张开手掌** - 靠近圣诞树时产生闪光粒子效果
- **捏合手指** - 拇指和食指捏合产生魔法粒子爆发
- **手部移动** - 跟随手部位置生成粒子轨迹

## 技术栈

- **前端框架**: React 18
- **类型系统**: TypeScript 5
- **构建工具**: Vite 5
- **手势识别**: @mediapipe/hands
- **代码规范**: ESLint

## 项目结构

```
christmas-tree-gesture-app/
├── public/              # 静态资源
├── src/
│   ├── components/      # React组件
│   │   ├── CanvasContainer.tsx    # Canvas容器组件
│   │   ├── ControlPanel.tsx       # 控制面板
│   │   ├── FPSMonitor.tsx         # FPS监控
│   │   └── CameraView.tsx         # 摄像头视图
│   ├── hooks/           # 自定义Hooks
│   │   ├── useCamera.ts           # 摄像头Hook
│   │   ├── useFPS.ts              # FPS计算Hook
│   │   └── useAnimationFrame.ts   # 动画帧Hook
│   ├── utils/           # 工具函数
│   │   ├── canvasUtils.ts         # Canvas绘制工具
│   │   ├── particleSystem.ts      # 粒子系统
│   │   ├── gestureDetector.ts     # 手势检测封装
│   │   └── imageManager.ts        # 图片管理
│   ├── types/           # TypeScript类型定义
│   │   └── index.ts
│   ├── App.tsx          # 主应用组件
│   ├── main.tsx         # 应用入口
│   └── index.css        # 全局样式
├── index.html           # HTML入口
├── package.json         # 项目配置
├── tsconfig.json        # TypeScript配置
├── vite.config.ts       # Vite配置
└── README.md            # 项目文档
```

## 快速开始

### 环境要求

- Node.js >= 16
- npm >= 7

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动。

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 预览生产构建

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

## 开发指南

### 组件开发

所有组件都位于 `src/components` 目录下，使用函数式组件和TypeScript。

### 添加新的手势识别

在 `src/utils/gestureDetector.ts` 中扩展 `GestureDetector` 类：

```typescript
detectCustomGesture(gesture: HandGesture): boolean {
  // 实现自定义手势检测逻辑
  return false;
}
```

### 自定义粒子类型

在 `src/utils/particleSystem.ts` 的 `ParticleSystem` 类中添加新的粒子类型和绘制方法。

### 调整圣诞树样式

修改 `src/utils/canvasUtils.ts` 中的 `drawChristmasTree` 函数来自定义圣诞树的外观。

## 浏览器兼容性

- Chrome/Edge >= 90
- Firefox >= 88
- Safari >= 14

**注意**: 需要浏览器支持：
- WebRTC (getUserMedia)
- Canvas API
- ES2020

## 性能优化建议

1. **粒子数量控制** - 默认最大500个粒子，可在 `ParticleSystem` 构造函数中调整
2. **Canvas分辨率** - 根据设备性能调整Canvas的缩放比例
3. **手势检测频率** - 可调整MediaPipe的模型复杂度和置信度阈值

## 常见问题

### 摄像头无法启动

- 确保浏览器已授予摄像头权限
- 检查是否有其他应用占用摄像头
- 在HTTPS环境下运行（本地开发使用localhost除外）

### 手势识别不准确

- 确保环境光线充足
- 保持手部在摄像头视野内
- 调整 `gestureDetector.ts` 中的检测阈值

### 性能问题

- 降低摄像头分辨率（在 `App.tsx` 中修改 `useCamera` 参数）
- 减少最大粒子数量
- 降低MediaPipe模型复杂度

## 许可证

MIT

## 贡献

欢迎提交Issue和Pull Request！

## 致谢

- [MediaPipe](https://mediapipe.dev/) - 提供强大的手势识别能力
- [Vite](https://vitejs.dev/) - 快速的构建工具
- [React](https://react.dev/) - 优秀的UI框架
