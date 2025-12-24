# 🎄 圣诞树手势交互 - 快速启动指南

## 🚀 快速开始（3步）

### 1️⃣ 安装依赖
```bash
npm install
```

### 2️⃣ 启动开发服务器
```bash
npm run dev
```

### 3️⃣ 打开浏览器
访问显示的地址（通常是 http://localhost:3000）

---

## 🎮 如何使用

1. **允许摄像头权限** - 浏览器会请求摄像头访问权限，必须允许
2. **点击"开始体验"** - 点击左上角的绿色按钮
3. **开始互动**：
   - 👋 **张开手掌** → 产生闪光粒子
   - 🤏 **捏合手指** → 产生魔法粒子爆发
   - 🖐️ **移动手部** → 跟随手部生成粒子轨迹

---

## 📊 界面说明

- **左上角** - 控制面板（开始/停止、状态信息）
- **右上角** - 性能监控（FPS和粒子数量）
- **中央** - 圣诞树和粒子效果
- **背景** - 摄像头画面（半透明）

---

## 🛠️ 其他命令

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint

# TypeScript类型检查
npx tsc --noEmit
```

---

## ⚠️ 常见问题

### 摄像头无法启动？
- ✅ 检查浏览器权限设置
- ✅ 确保没有其他应用占用摄像头
- ✅ 刷新页面重试

### 手势识别不准确？
- 💡 确保环境光线充足
- 💡 保持手部完整在摄像头视野内
- 💡 距离摄像头30-60cm最佳

### 性能卡顿？
- 📈 查看右上角FPS显示
- 📈 减少粒子数量（在 `src/App.tsx` 中调整）
- 📈 使用更强性能的设备

---

## 🌐 浏览器要求

推荐使用：
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+

需要支持：
- WebRTC (getUserMedia)
- Canvas API
- ES2020

---

## 📁 项目结构

```
src/
├── components/        # React组件
│   ├── CanvasContainer.tsx
│   ├── ControlPanel.tsx
│   ├── FPSMonitor.tsx
│   └── CameraView.tsx
├── hooks/            # 自定义Hooks
│   ├── useCamera.ts
│   ├── useFPS.ts
│   └── useAnimationFrame.ts
├── utils/            # 工具函数
│   ├── canvasUtils.ts
│   ├── particleSystem.ts
│   ├── gestureDetector.ts
│   └── imageManager.ts
├── types/            # TypeScript类型
│   └── index.ts
├── App.tsx           # 主应用
└── main.tsx          # 入口文件
```

---

## 🎨 自定义配置

### 调整粒子数量
编辑 `src/App.tsx`，找到：
```typescript
const particleSystemRef = useRef<ParticleSystem>(new ParticleSystem(500));
```
修改数字 `500` 为你想要的最大粒子数量

### 调整圣诞树样式
编辑 `src/utils/canvasUtils.ts` 中的 `drawChristmasTree` 函数

### 调整手势检测灵敏度
编辑 `src/utils/gestureDetector.ts` 中的检测阈值

---

## 📚 更多文档

- [README.md](./README.md) - 完整项目文档
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - 项目结构详解

---

**现在就开始体验吧！** 🎄✨

运行 `npm run dev` 启动应用！
