
<template>
  <div class="home-container">
    <el-container>
      <!-- 侧边导航栏 -->
      <el-aside width="220px" class="side-nav">
        <el-menu
          default-active="1"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
        >
          <el-menu-item index="/index/dashboard">
            <i class="el-icon-s-data"></i>
            <span>数据看板</span>
          </el-menu-item>
          <el-menu-item index="/index/settings">
            <i class="el-icon-setting"></i>
            <span>系统设置</span>
          </el-menu-item>
          <el-menu-item index="/index/profile">
            <i class="el-icon-user"></i>
            <span>个人中心</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header class="header">
          <div class="header-content">
            <div class="user-info">
              <el-avatar :size="40" :src="userInfo?.avatar || defaultAvatar" />
              <span class="username">欢迎, {{ userInfo?.username }}</span>
            </div>
            <el-button 
              type="danger" 
              plain 
              @click="logout"
              class="logout-btn"
            >
              <i class="el-icon-switch-button"></i> 退出登录
            </el-button>
          </div>
        </el-header>
        
        <el-main class="main-content">
          <div class="router-container">
            <router-view v-slot="{ Component }">
              <keep-alive>
                <component :is="Component" />
              </keep-alive>
            </router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import defaultAvatar from '@/assets/logo.svg'

export default {
  data() {
    return {
      defaultAvatar,
      showFloatWindow: true,
      isMinimized: false,
      // 悬浮窗位置和尺寸
      floatWindow: {
        x: window.innerWidth - 400,
        y: 100,
        width: 350,
        height: 450,
        minWidth: 200,
        minHeight: 200,
        maxWidth: window.innerWidth * 0.8,
        maxHeight: window.innerHeight * 0.8
      },
      // 拖动状态
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
      // 缩放状态
      isResizing: false,
      resizeStart: { x: 0, y: 0, width: 0, height: 0 }
    }
  },
  computed: {
    ...mapState(['userInfo']),
    iframeStyle() {
      return {
        width: '100%',
        height: this.isMinimized ? '0' : `calc(100% - ${this.floatWindow.headerHeight}px)`,
        display: this.isMinimized ? 'none' : 'block'
      }
    }
  },
  mounted() {
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseup', this.stopDragResize)
  },
  beforeDestroy() {
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.stopDragResize)
  },
  methods: {
    ...mapMutations(['CLEAR_STATE']),
    logout() {
      this.$confirm('确定要退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.CLEAR_STATE()
        this.$router.push('/login')
        this.$message.success('已安全退出')
      })
    },
  }
}
</script>

<style scoped>
.home-container {
  height: 100vh;
  background-color: #f5f7fa;
}

.side-nav {
  background-color: #545c64;
  height: 100vh;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
}

.header {
  background-color: #409eff;
  color: white;
  height: 60px;
  line-height: 60px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.user-info {
  display: flex;
  align-items: center;
}

.username {
  margin-left: 10px;
  font-size: 16px;
}

.logout-btn {
  padding: 8px 15px;
}

.main-content {
  padding: 20px !important;
  background-color: #f5f7fa;
}

.float-window {
  position: fixed;
  left: v-bind('floatWindow.x + "px"');
  top: v-bind('floatWindow.y + "px"');
  width: v-bind('floatWindow.width + "px"');
  height: v-bind('floatWindow.height + "px"');
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 999;
  overflow: hidden;
  cursor: move;
  user-select: none;
}

.float-header {
  height: 40px;
  line-height: 40px;
  padding: 0 15px;
  background: #409eff;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.window-controls i {
  margin-left: 10px;
  cursor: pointer;
}

.float-iframe {
  width: 100%;
  height: calc(100% - 40px);
  border: none;
}

.resize-handle {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 15px;
  height: 15px;
  background: #409eff;
  cursor: nwse-resize;
  z-index: 1000;
}

.router-container {
  width: 100%;
  min-height: calc(100vh - 120px); /* 减去header和padding */
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
