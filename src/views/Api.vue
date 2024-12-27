<template>
  <div class="api-container">
    <el-card class="api-card">
      <template #header>
        <div class="card-header">
          <h2>API 文档</h2>
        </div>
      </template>
      <div class="api-content">
        <!-- API文档内容 -->
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.api-container {
  padding: 20px;
  display: flex;
  justify-content: center;
  min-height: 80vh;
}

.api-card {
  width: 80%;
  max-width: 1000px;
}

.card-header {
  text-align: center;
}
</style> 