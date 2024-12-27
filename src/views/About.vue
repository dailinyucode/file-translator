<template>
  <div class="about-container">
    <el-card class="about-card">
      <template #header>
        <div class="card-header">
          <h2>关于我们</h2>
        </div>
      </template>
      
      <div class="about-content">
        <h3>ESZY-Translator</h3>
        <p>我们是一个致力于提供高质量文件翻译服务的团队。我们的目标是：</p>
        <ul>
          <li>提供快速准确的文件翻译服务</li>
          <li>支持多种文件格式</li>
          <li>确保用户数据安全</li>
          <li>持续优化翻译质量</li>
        </ul>
        
        <el-divider />
        
        <h3>技术优势</h3>
        <div class="features">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-card shadow="hover">
                <h4>多语言支持</h4>
                <p>支持多种语言之间的互译</p>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover">
                <h4>文件格式</h4>
                <p>支持多种常用文档格式</p>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover">
                <h4>安全可靠</h4>
                <p>确保文件安全和隐私保护</p>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.about-container {
  padding: 20px;
  display: flex;
  justify-content: center;
  min-height: 80vh;
}

.about-card {
  width: 80%;
  max-width: 1000px;
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
}

.card-header {
  text-align: center;
}

.about-content {
  padding: 20px;
}

.features {
  margin-top: 20px;
}

.el-card {
  text-align: center;
  margin-bottom: 20px;
}

h3 {
  color: #409EFF;
  margin-bottom: 20px;
}

ul {
  padding-left: 20px;
}

li {
  margin-bottom: 10px;
}

.features .el-card {
  transition: transform 0.3s ease;
  background: rgba(255, 255, 255, 0.05) !important;
}

.features .el-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.1) !important;
}
</style> 