<template>
  <div class="contact-container">
    <el-card class="contact-card">
      <template #header>
        <div class="card-header">
          <h2>联系我们</h2>
        </div>
      </template>
      
      <div class="contact-content">
        <el-form :model="form" label-width="120px" @submit.prevent="handleSubmit">
          <el-form-item label="姓名">
            <el-input v-model="form.name" placeholder="请输入您的姓名" />
          </el-form-item>
          
          <el-form-item label="邮箱">
            <el-input v-model="form.email" placeholder="请输入您的邮箱" />
          </el-form-item>
          
          <el-form-item label="主题">
            <el-select v-model="form.subject" placeholder="请选择联系主题" style="width: 100%">
              <el-option label="产品咨询" value="product" />
              <el-option label="技术支持" value="support" />
              <el-option label="商务合作" value="business" />
              <el-option label="其他" value="other" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="消息内容">
            <el-input
              v-model="form.message"
              type="textarea"
              :rows="4"
              placeholder="请输入您的消息内容"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" native-type="submit">提交</el-button>
          </el-form-item>
        </el-form>
        
        <el-divider />
        
        <div class="contact-info">
          <h3>其他联系方式</h3>
          <p><el-icon><Location /></el-icon> 地址：北京市朝阳区xxx街道xxx号</p>
          <p><el-icon><Message /></el-icon> 邮箱：contact@eszy-translator.com</p>
          <p><el-icon><Phone /></el-icon> 电话：+86 10 xxxx xxxx</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Location, Message, Phone } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const handleSubmit = () => {
  // 这里添加表单提交逻辑
  ElMessage.success('消息已发送，我们会尽快回复您！')
}
</script>

<style scoped>
.contact-container {
  padding: 20px;
  display: flex;
  justify-content: center;
  min-height: 80vh;
}

.contact-card {
  width: 80%;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
}

.card-header {
  text-align: center;
}

.contact-content {
  padding: 20px;
}

.contact-info {
  margin-top: 20px;
}

.contact-info p {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 10px 0;
}

.el-icon {
  color: #409EFF;
}

.el-input__inner,
.el-textarea__inner {
  background: rgba(255, 255, 255, 0.15) !important;
  border: 1px solid rgba(64, 158, 255, 0.3) !important;
  color: var(--text-color) !important;
}

.el-input__inner:focus,
.el-textarea__inner:focus {
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 5px rgba(64, 158, 255, 0.5);
}

.el-form-item__label {
  color: var(--text-color-secondary) !important;
}

.el-select-dropdown {
  background: rgba(26, 26, 26, 0.95) !important;
  border: 1px solid rgba(64, 158, 255, 0.3) !important;
}

.el-select-dropdown__item {
  color: var(--text-color-secondary) !important;
}

.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background: rgba(64, 158, 255, 0.2) !important;
}
</style> 