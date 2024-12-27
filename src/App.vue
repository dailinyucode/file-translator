<template>
  <div class="app-container">
    <nav class="nav-menu">
      <div class="menu-wrapper">
        <div class="logo">
          <span class="logo-text">EASY</span>
          <span class="logo-separator">-</span>
          <span class="logo-text">Translator</span>
        </div>
        <div class="menu-items-wrapper">
          <div class="menu-items">
            <router-link to="/" class="menu-item" active-class="is-active">
              <span class="menu-text">首页</span>
            </router-link>
            <router-link to="/text" class="menu-item" active-class="is-active">
              <span class="menu-text">文字翻译</span>
            </router-link>
            <router-link to="/document" class="menu-item" active-class="is-active">
              <span class="menu-text">文档翻译</span>
            </router-link>
            <router-link to="/api" class="menu-item" active-class="is-active">
              <span class="menu-text">接口服务</span>
            </router-link>
            <router-link to="/about" class="menu-item" active-class="is-active">
              <span class="menu-text">关于我们</span>
            </router-link>
            <router-link to="/contact" class="menu-item" active-class="is-active">
              <span class="menu-text">联系我们</span>
            </router-link>
          </div>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeIndex = ref('/')
</script>

<style>
.app-container {
  min-height: 100vh;
  position: relative;
}

.nav-menu {
  background: rgba(13, 20, 37, 0.9);
  backdrop-filter: blur(10px);
  border: none;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
}

.menu-wrapper {
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  height: 60px;
  padding: 0 20px;
  position: relative;
}

.logo {
  position: absolute;
  left: 20px;
  font-size: 1.5em;
  font-weight: bold;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 5px;
  height: 100%;
}

.logo-text {
  background: linear-gradient(45deg, #409EFF, #36cfc9);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  transition: all 0.3s ease;
}

.logo-text:hover {
  text-shadow: 0 0 20px rgba(64, 158, 255, 0.5);
  transform: scale(1.05);
}

.logo-separator {
  color: rgba(255, 255, 255, 0.9);
  opacity: 0.8;
}

.menu-items-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.menu-items {
  display: flex;
  gap: 10px;
  height: 100%;
}

.menu-item {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 16px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  transition: all 0.3s ease;
  position: relative;
  font-weight: 500;
  letter-spacing: 0.5px;
  min-width: 80px;
  width: auto;
}

.menu-text {
  position: relative;
  padding: 5px 0;
  text-align: center;
}

.menu-text::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(45deg, #409EFF, #36cfc9);
  transition: width 0.3s ease;
}

.menu-item:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.menu-item:hover .menu-text::after {
  width: 100%;
}

.menu-item.is-active {
  color: #409EFF;
  text-shadow: 0 0 10px rgba(64, 158, 255, 0.3);
}

.menu-item.is-active .menu-text::after {
  width: 100%;
}

/* 确保内容不被导航栏遮挡 */
.home-container,
.about-container,
.contact-container,
.api-container {
  padding-top: 80px;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .menu-wrapper {
    padding: 0 10px;
  }

  .logo {
    left: 10px;
    font-size: 1.2em;
  }

  .menu-items {
    gap: 5px;
  }

  .menu-item {
    padding: 0 10px;
    min-width: 60px;
    font-size: 14px;
  }

  .menu-text {
    white-space: nowrap;
  }
}

/* 小屏幕适配 */
@media screen and (max-width: 480px) {
  .logo {
    font-size: 1em;
  }

  .menu-item {
    padding: 0 8px;
    min-width: 50px;
    font-size: 12px;
  }

  .menu-items {
    gap: 2px;
  }
}

/* 超小屏幕适配 */
@media screen and (max-width: 360px) {
  .logo-separator, .logo-text:last-child {
    display: none;
  }

  .menu-item {
    padding: 0 5px;
    min-width: 40px;
    font-size: 12px;
  }
}
</style> 