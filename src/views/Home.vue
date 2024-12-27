<template>
  <div class="home-container">
    <div class="welcome-section">
      <h1>EASY-Translator</h1>
      <p class="subtitle">专业的文档翻译服务</p>
      <router-link to="/document" class="start-btn">
        <el-button type="primary" size="large">开始使用</el-button>
      </router-link>
    </div>
    
    <div class="features-section">
      <h2>我们的特点</h2>
      <div class="features-grid">
        <div class="feature-card">
          <el-icon><Document /></el-icon>
          <h3>多格式支持</h3>
          <p>支持 Word、PDF、Excel 等多种文档格式</p>
        </div>
        <div class="feature-card">
          <el-icon><ChatLineRound /></el-icon>
          <h3>多语言翻译</h3>
          <p>支持中英日等多种语言互译</p>
        </div>
        <div class="feature-card">
          <el-icon><Lock /></el-icon>
          <h3>安全可靠</h3>
          <p>保护您的文档安全和隐私</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  text-align: center;
  padding: 60px 0;
}

.welcome-section h1 {
  font-size: 3em;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #409EFF, #36cfc9);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.5em;
  color: #666;
  margin-bottom: 40px;
}

.start-btn {
  text-decoration: none;
}

.features-section {
  padding: 60px 0;
}

.features-section h2 {
  text-align: center;
  margin-bottom: 40px;
  color: #409EFF;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  padding: 0 20px;
}

.feature-card {
  text-align: center;
  padding: 30px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card .el-icon {
  font-size: 40px;
  color: #409EFF;
  margin-bottom: 20px;
}

.feature-card h3 {
  margin-bottom: 15px;
  color: #409EFF;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

@media screen and (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}

.panel-card {
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
}

.panel-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 15px;
  overflow: hidden;  /* 防止双滚动条 */
}

.panel-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px;
  height: 100%;
  overflow: hidden;  /* 防止双滚动条 */
}

.preview-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 15px;
  min-height: 300px;
  background: rgba(185,185,185,0.2);
  overflow: hidden;  /* 防止双滚动条 */
}

.preview-header {
  flex-shrink: 0;  /* 防止头部被压缩 */
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.preview-content {
  flex: 1;
  overflow-y: auto;  /* 只在内容区域显示滚动条 */
  padding-right: 5px;  /* 给滚动条留出空间 */
  white-space: pre-wrap;
  word-break: break-word;
}

/* 美化滚动条 */
.preview-content::-webkit-scrollbar {
  width: 6px;
}

.preview-content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.preview-content::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

/* 确保预览内容文字清晰可见 */
.preview-content :deep(p),
.preview-content :deep(span),
.preview-content :deep(div) {
  color: rgba(0, 0, 0, 0.85) !important;
  margin: 0;  /* 移除默认边距 */
  line-height: 1.6;  /* 增加行高提高可读性 */
}
</style>