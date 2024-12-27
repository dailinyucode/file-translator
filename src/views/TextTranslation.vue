<template>
  <div class="translator-container">
    <!-- 顶部语言选择器 -->
    <div class="language-bar">
      <div class="language-selector">
        <el-select v-model="sourceLanguage" placeholder="源语言">
          <el-option 
            v-for="(name, code) in languageMap" 
            :key="code" 
            :label="name" 
            :value="code"
          />
        </el-select>
      </div>

      <el-button 
        type="primary" 
        class="swap-btn"
        @click="swapLanguages"
      >
        <el-icon><SwitchButton /></el-icon>
      </el-button>

      <div class="language-selector">
        <el-select v-model="targetLanguage" placeholder="目标语言">
          <el-option 
            v-for="(name, code) in languageMap" 
            :key="code" 
            :label="name" 
            :value="code"
          />
        </el-select>
      </div>
    </div>

    <!-- 翻译面板 -->
    <div class="panels-wrapper">
      <el-card class="panel source-panel">
        <el-input
          v-model="sourceText"
          type="textarea"
          :rows="12"
          placeholder="请输入要翻译的文字"
          resize="none"
        />
        <div class="text-actions">
          <el-button type="text" @click="clearSource">
            <el-icon><Delete /></el-icon>
            清空
          </el-button>
          <span class="word-count">{{ sourceWordCount }} 字</span>
        </div>
      </el-card>

      <div class="translate-btn-wrapper">
        <el-button 
          type="primary" 
          :disabled="!sourceText || isTranslating"
          @click="startTranslate"
        >
          <el-icon><Right /></el-icon>
        </el-button>
      </div>

      <el-card class="panel target-panel">
        <el-input
          v-model="translatedText"
          type="textarea"
          :rows="12"
          placeholder="翻译结果将在这里显示"
          resize="none"
          readonly
        />
        <div class="text-actions">
          <el-button type="text" @click="copyTranslated">
            <el-icon><CopyDocument /></el-icon>
            复制
          </el-button>
          <span class="word-count">{{ translatedWordCount }} 字</span>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Right, Delete, CopyDocument, SwitchButton } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const sourceText = ref('')
const translatedText = ref('')
const sourceLanguage = ref('en')
const targetLanguage = ref('zh')
const isTranslating = ref(false)

const languageMap = {
  'zh': '中文',
  'en': '英语',
  'ja': '日语'
}

const sourceWordCount = computed(() => {
  return sourceText.value.length
})

const translatedWordCount = computed(() => {
  return translatedText.value.length
})

const clearSource = () => {
  sourceText.value = ''
}

const copyTranslated = async () => {
  if (!translatedText.value) return
  try {
    await navigator.clipboard.writeText(translatedText.value)
    ElMessage.success('复制成功')
  } catch (err) {
    ElMessage.error('复制失败')
  }
}

const startTranslate = async () => {
  if (!sourceText.value) {
    ElMessage.warning('请输入要翻译的文字')
    return
  }

  isTranslating.value = true
  try {
    const response = await request.post('/translate-text', {
      text: sourceText.value,
      source_lang: sourceLanguage.value,
      target_lang: targetLanguage.value
    })
    translatedText.value = response.data.translated_text
    ElMessage.success('翻译完成')
  } catch (error) {
    ElMessage.error('翻译失败，请重试')
    console.error('翻译错误:', error)
  } finally {
    isTranslating.value = false
  }
}

const swapLanguages = () => {
  const temp = sourceLanguage.value
  sourceLanguage.value = targetLanguage.value
  targetLanguage.value = temp
}
</script>

<style scoped>
.translator-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 60px;
}

.language-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.language-selector .el-select {
  width: 150px;
}

.swap-btn {
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.panels-wrapper {
  display: flex;
  gap: 20px;
  align-items: stretch;
}

.panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.source-panel {
  background: #ffffff;
}

.target-panel {
  background: #f5f7fa;
}

.translate-btn-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
}

.text-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.word-count {
  color: #909399;
  font-size: 12px;
}

@media screen and (max-width: 768px) {
  .language-bar {
    flex-direction: column;
    gap: 10px;
  }

  .panels-wrapper {
    flex-direction: column;
  }

  .translate-btn-wrapper {
    padding: 15px 0;
  }
}
.horizontal-arrow {
  transform: rotate(-90deg);
}
</style> 