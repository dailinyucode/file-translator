<template>
  <div class="home-container">
    <div class="translator-wrapper">
      <!-- 左侧面板 -->
      <div class="panel source-panel">
        <el-card class="panel-card">
          <template #header>
            <div class="card-header">
              <h3>原文件</h3>
            </div>
          </template>
          
          <div class="panel-content">
            <!-- 上传区域 -->
            <div class="upload-container" @click="triggerFileInput" @drop.prevent="handleDrop" @dragover.prevent>
              <input
                type="file"
                ref="fileInput"
                class="hidden-input"
                @change="handleFileChange"
                accept=".txt,.doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx"
              >
              <div class="upload-area" :class="{ 'is-dragover': isDragover }">
                <el-icon class="upload-icon"><Upload /></el-icon>
                <div class="upload-text">
                  <template v-if="!selectedFile">
                    <div>将文件拖到此处，或 <span class="click-text">点击上传</span></div>
                    <div class="upload-tip">支持 .txt, .doc, .docx, .pdf, .ppt, .pptx, .xls, .xlsx 格式</div>
                  </template>
                  <template v-else>
                    <div class="file-info">
                      <el-icon><Document /></el-icon>
                      <span>{{ selectedFile.name }}</span>
                      <el-icon class="delete-icon" @click.stop="clearFile"><Delete /></el-icon>
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <!-- 预览区域 -->
            <div class="preview-area" v-if="selectedFile">
              <div class="preview-header">
                <div class="header-left">
                  <span>文件预览</span>
                  <span class="file-info">
                    ({{ selectedFile.name }})
                  </span>
                </div>
              </div>
              <div class="preview-content" v-if="fileContent" v-html="fileContent"></div>
              <div class="preview-placeholder" v-else-if="selectedFile && !canPreview">
                <el-icon><Document /></el-icon>
                <p>该文件类型暂不支持预览</p>
                <p class="file-name">{{ selectedFile.name }}</p>
              </div>
              <div class="preview-placeholder" v-else>
                <el-icon><Upload /></el-icon>
                <p>未选择文件</p>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 中间控制区 -->
      <div class="control-panel">
        <template v-if="selectedFile">
          <el-button 
            type="primary" 
            class="translate-btn"
            :style="{ top: controlsTopPosition + 'px' }"
            :disabled="!fileContent || isTranslating"
            @click="startTranslate"
          >
            <el-icon class="translate-icon"><Right /></el-icon>
          </el-button>
          
          <div 
            class="progress-wrapper" 
            v-if="isTranslating"
            :style="{ top: (controlsTopPosition + 65) + 'px' }"
          >
            <el-progress 
              :percentage="translateProgress" 
              :status="translateProgress === 100 ? 'success' : ''"
              :stroke-width="8"
              :show-text="false"
            />
            <div class="progress-text">{{ progressText }}</div>
          </div>
        </template>
        <template v-else>
          <div 
            class="disabled-arrow"
            :style="{ top: controlsTopPosition + 'px' }"
          >
            <el-icon><Right /></el-icon>
          </div>
        </template>
      </div>

      <!-- 右侧面板 -->
      <div class="panel target-panel">
        <el-card class="panel-card">
          <template #header>
            <div class="card-header">
              <h3>翻译结果</h3>
            </div>
          </template>

          <div class="panel-content">
            <!-- 语言选择区域 -->
            <div class="language-selector">
              <el-select v-model="sourceLanguage" placeholder="源语言">
                <el-option 
                  v-for="(name, code) in languageMap" 
                  :key="code" 
                  :label="name" 
                  :value="code"
                />
              </el-select>
              <el-icon class="transform-icon"><Right /></el-icon>
              <el-select v-model="targetLanguage" placeholder="目标语言">
                <el-option 
                  v-for="(name, code) in languageMap" 
                  :key="code" 
                  :label="name" 
                  :value="code"
                />
              </el-select>
            </div>

            <!-- 翻译结果预览区域 -->
            <div class="preview-area" v-if="selectedFile">
              <div class="preview-header">
                <div class="header-left">
                  <span>翻译结果</span>
                  <el-button 
                    v-if="translatedContent"
                    type="primary" 
                    link 
                    class="download-btn"
                    @click="downloadTranslatedFile"
                  >
                    <el-icon><Download /></el-icon>
                    下载文件
                  </el-button>
                </div>
              </div>
              <div class="preview-content" v-if="translatedContent" v-html="translatedContent"></div>
              <div class="preview-placeholder" v-else>
                <el-icon><Document /></el-icon>
                <p>翻译结果将在这里显示</p>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Right, Document, Upload, Delete, Download } from '@element-plus/icons-vue'
import * as mammoth from 'mammoth'
import * as PDFJS from 'pdfjs-dist'
import { read as readXLSX, utils as xlsxUtils } from 'xlsx'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

// 设置 PDF.js 工作线程路径
PDFJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.min.js`

interface UploadFile extends File {
  uid: number;
}

const selectedFile = ref<{
  raw: File;
  name: string;
  uid: number;
} | null>(null)
const fileContent = ref<string>('')
const canPreview = ref(true)
const sourceLanguage = ref('en')
const targetLanguage = ref('zh')
const translatedContent = ref('')
const isTranslating = ref(false)
const translateProgress = ref(0)
const progressText = computed(() => {
  if (translateProgress.value === 100) return '翻译完成'
  return `正在翻译... ${translateProgress.value}%`
})

const fileInput = ref<HTMLInputElement | null>(null)
const isDragover = ref(false)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleDrop = (e: DragEvent) => {
  isDragover.value = false
  const files = e.dataTransfer?.files
  if (files?.length) {
    handleFileChange({ target: { files } } as any)
  }
}

const handleFileChange = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (!files?.length) return

  const file = files[0]
  selectedFile.value = {
    raw: file,
    name: file.name,
    uid: Date.now()
  }
  canPreview.value = true
  fileContent.value = ''

  try {
    const fileType = file.name.split('.').pop()?.toLowerCase()

    switch (fileType) {
      case 'txt':
        await handleTextFile(file)
        break
      case 'doc':
      case 'docx':
        await handleWordFile(file)
        break
      case 'pdf':
        await handlePDFFile(file)
        break
      case 'xls':
      case 'xlsx':
        await handleExcelFile(file)
        break
      default:
        canPreview.value = false
    }
  } catch (error) {
    console.error('文件预览失败:', error)
    canPreview.value = false
  }

  // 重置 input 以允许重复上传相同文件
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleTextFile = (file: File) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      fileContent.value = e.target?.result as string
      resolve(null)
    }
    reader.readAsText(file)
  })
}

const handleWordFile = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.convertToHtml({ arrayBuffer })
  fileContent.value = result.value
}

const handlePDFFile = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await PDFJS.getDocument({ data: arrayBuffer }).promise
  const numPages = pdf.numPages
  let content = ''

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    content += textContent.items.map(item => (item as any).str).join(' ') + '\n\n'
  }

  fileContent.value = content
}

const handleExcelFile = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer()
  const workbook = readXLSX(arrayBuffer)
  let content = ''

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = xlsxUtils.sheet_to_json(worksheet, { header: 1 })
    content += `Sheet: ${sheetName}\n`
    content += jsonData.map(row => (row as any[]).join('\t')).join('\n')
    content += '\n\n'
  }

  fileContent.value = content
}

const startTranslate = async () => {
  if (!selectedFile.value || !selectedFile.value.raw) {
    ElMessage.warning('请先选择并上传文件')
    return
  }

  isTranslating.value = true
  translateProgress.value = 0
  translatedContent.value = ''

  let progressInterval: ReturnType<typeof setInterval> | null = null
  let currentProgress = 0
  
  const updateProgress = () => {
    if (currentProgress < 60) {
      // 快速增长到 60%
      currentProgress += Math.max(1, (60 - currentProgress) * 0.1)
    } else if (currentProgress < 85) {
      // 中速增长到 85%
      currentProgress += 0.5
    } else if (currentProgress < 95) {
      // 慢速增长到 95%
      currentProgress += 0.2
    } else if (currentProgress < 99) {
      // 极慢速增长到 99%
      currentProgress += 0.05
    }
    translateProgress.value = Math.round(currentProgress)
  }

  progressInterval = setInterval(updateProgress, 200)

  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value.raw)
    formData.append('target_lang', targetLanguage.value)

    const response = await request.post('/translate-file', formData, {
      responseType: 'blob'
    })

    if (progressInterval) {
      clearInterval(progressInterval)
      progressInterval = null
    }

    // 保存响应的 blob 用于下载
    const responseBlob = response.data
    
    // 创建文件用于预览
    const file = new File([response.data], selectedFile.value.name, {
      type: selectedFile.value.raw.type
    })

    // 处理预览
    const fileType = file.name.split('.').pop()?.toLowerCase()
    switch (fileType) {
      case 'txt':
        await handleTranslatedTextFile(file)
        break
      case 'doc':
      case 'docx':
        await handleTranslatedWordFile(file)
        break
      case 'pdf':
        await handleTranslatedPDFFile(file)
        break
      case 'xls':
      case 'xlsx':
        await handleTranslatedExcelFile(file)
        break
    }

    // 保存 blob 用于下载
    translatedBlob.value = responseBlob

    translateProgress.value = 100
    ElMessage.success('翻译完成')
  } catch (error) {
    if (progressInterval) {
      clearInterval(progressInterval)
      progressInterval = null
    }
    ElMessage.error('翻译失败，请重试')
    console.error('翻译错误:', error)
    translateProgress.value = 0
  } finally {
    isTranslating.value = false
  }
}

const handleTranslatedTextFile = async (file: File) => {
  const text = await file.text()
  translatedContent.value = text
}

const handleTranslatedWordFile = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.convertToHtml({ arrayBuffer })
  translatedContent.value = result.value
}

const handleTranslatedPDFFile = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await PDFJS.getDocument({ data: arrayBuffer }).promise
  const numPages = pdf.numPages
  let content = ''

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    content += textContent.items.map(item => (item as any).str).join(' ') + '\n\n'
  }

  translatedContent.value = content
}

const handleTranslatedExcelFile = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer()
  const workbook = readXLSX(arrayBuffer)
  let content = ''

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = xlsxUtils.sheet_to_json(worksheet, { header: 1 })
    content += `Sheet: ${sheetName}\n`
    content += jsonData.map(row => (row as any[]).join('\t')).join('\n')
    content += '\n\n'
  }

  translatedContent.value = content
}

const clearFile = () => {
  selectedFile.value = null
  fileContent.value = ''
  canPreview.value = false
}

// 添加语言映射
const languageMap = {
  'zh': '中文',
  'en': '英语',
  'ja': '日语'
}

// 修改语言选择器的值显示
const getLanguageName = (code: string) => {
  return languageMap[code as keyof typeof languageMap] || code
}

// 添加 ref 存储翻译后的文件 blob
const translatedBlob = ref<Blob | null>(null)

// 修改下载函数
const downloadTranslatedFile = () => {
  if (!selectedFile.value?.raw || !translatedBlob.value) return
  
  const url = window.URL.createObjectURL(translatedBlob.value)
  const link = document.createElement('a')
  
  const fileName = selectedFile.value.name
  const downloadName = `translated_${fileName}`
  
  link.href = url
  link.download = downloadName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// 添加计算箭头位置的逻辑
const controlsTopPosition = computed(() => {
  // 获取上传容器和语言选择器的高度
  const uploadContainer = document.querySelector('.upload-container')
  const languageSelector = document.querySelector('.language-selector')
  
  if (!uploadContainer || !languageSelector) return 60 // 默认值
  
  const uploadHeight = uploadContainer.getBoundingClientRect().height
  const languageHeight = languageSelector.getBoundingClientRect().height
  
  // 计算中心位置
  return (uploadHeight / 2) + 15 // 15px 是 panel-content 的 padding
})
</script>

<style scoped>
.home-container {
  padding: 20px;
  min-height: 80vh;
  max-height: 100vh;
  padding-top: 80px;
}

.translator-wrapper {
  display: flex;
  gap: 20px;
  max-width: 1400px;
  height: calc(100vh - 120px);
  margin: 0 auto;
  position: relative;
}

.panel {
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
}

.panel-card:has(.preview-area) {
  height: 100%;
}

.panel-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 15px;
  overflow: hidden;
}

.card-header {
  text-align: center;
}

.upload-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  margin-bottom: 20px;
}

.hidden-input {
  display: none;
}

.upload-area {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-area:hover, .upload-area.is-dragover {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.upload-icon {
  font-size: 32px;
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
}

.upload-text {
  text-align: center;
}

.upload-tip {
  margin-top: 4px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.file-info {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-radius: 4px;
}

.delete-icon {
  cursor: pointer;
  color: var(--el-color-danger);
  transition: transform 0.2s;
}

.delete-icon:hover {
  transform: scale(1.2);
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
  overflow: hidden;
}

.preview-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left span:first-child {
  font-weight: 500;
  color: #409EFF;
}

.file-info {
  font-size: 0.9em;
  color: rgba(0, 0, 0, 0.6);
  font-weight: normal;
}

.download-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  padding: 0 12px;
  height: 28px;
  border-radius: 4px;
  background: rgba(64, 158, 255, 0.1);
}

.download-btn:hover {
  background: rgba(64, 158, 255, 0.2);
}

.download-btn .el-icon {
  font-size: 16px;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.45);
  padding: 20px;
}

.preview-placeholder .el-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: rgba(0, 0, 0, 0.45);
}

.file-name {
  margin-top: 8px;
  font-size: 0.9em;
  color: rgba(0, 0, 0, 0.6);
}

.preview-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 5px;
  white-space: pre-wrap;
  word-break: break-word;
}

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

.preview-content :deep(p),
.preview-content :deep(span),
.preview-content :deep(div) {
  color: rgba(0, 0, 0, 0.85) !important;
  margin: 0;
  line-height: 1.6;
}

.translation-content {
  color: rgba(0, 0, 0, 0.85);
  white-space: pre-wrap;
  word-break: break-word;
}

.translation-placeholder {
  color: rgba(255, 255, 255, 0.45);
  text-align: center;
  padding: 20px;
}

.language-selector {
  justify-content: center;
  gap: 20px;
  padding: 0 20px;
}

.language-selector .el-select {
  width: 200px;
}

.transform-icon {
  color: #409EFF;
  font-size: 20px;
}

.control-panel {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 90px;
  min-height: 100%;
  flex-shrink: 0;
}

.translate-btn,
.disabled-arrow {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  transition: top 0.3s ease;  /* 添加过渡效果 */
}

.translate-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, #409EFF, #36cfc9);
  border: none;
}

.translate-btn:hover {
  transform: translateX(-50%) scale(1.1);
}

.translate-btn:active {
  transform: translateX(-50%) scale(0.95);
}

.translate-btn .translate-icon {
  font-size: 24px;
}

.translate-btn:disabled {
  background: rgba(255, 255, 255, 0.2);
  cursor: not-allowed;
}

.progress-wrapper {
  width: 90px;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 6px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  transition: top 0.3s ease;  /* 添加过渡效果 */
}

.progress-wrapper :deep(.el-progress-bar__outer) {
  background-color: rgba(255, 255, 255, 0.2) !important;
}

.progress-wrapper :deep(.el-progress-bar__inner) {
  background: linear-gradient(45deg, #409EFF, #36cfc9);
  position: relative;
  transition: width 0.3s ease-in-out;
}

.progress-wrapper :deep(.el-progress-bar__inner)::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.progress-text {
  margin-top: 8px;
  font-size: 12px;
  color: #409EFF;
  white-space: nowrap;
}

@media screen and (max-width: 768px) {
  .home-container {
    padding-top: 60px;
  }

  .translator-wrapper {
    flex-direction: column;
  }
  
  .panel {
    width: 100%;
  }

  .control-panel {
    flex-direction: row;
    padding: 20px 0;
  }
  
  .progress-wrapper {
    flex: 1;
    max-width: 200px;
  }
}

.panel-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px;
  height: 100%;
  overflow: hidden;
}

.upload-container,
.language-selector {
  height: 100px;
  display: flex;
  align-items: center;
  background: var(--el-bg-color-overlay);
  border: 1px dashed var(--el-border-color);
  border-radius: 8px;
  padding: 0;
  margin: 0;
}

.language-selector {
  justify-content: center;
  gap: 20px;
}

.language-selector .el-select {
  width: 180px;
}

.panel-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px;
}

.disabled-arrow {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(0, 0, 0, 0.25);
  font-size: 24px;
  position: absolute;
  top: 60px;
}

.disabled-arrow .el-icon {
  font-size: 24px;
}

.panel-content:has(:not(.preview-area)) {
  height: auto;
}
</style> 