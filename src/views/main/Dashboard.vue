
<template>
  <div class="dashboard-container">
    <!-- 头部控制区 -->
    <header class="dashboard-header">
      <h1>系统性能监控看板</h1>
      <div class="control-panel">
        <button 
          @click="toggleConnection"
          :class="['control-btn', isConnected ? 'btn-danger' : 'btn-primary']"
        >
          {{ isConnected ? '断开连接' : '开始监控' }}
        </button>
        <div class="connection-status">
          <span :class="['status-indicator', isConnected ? 'connected' : 'disconnected']"></span>
          {{ connectionStatusText }}
        </div>
      </div>
    </header>

    <!-- 数据展示区 -->
    <div class="metrics-grid">
      <MetricCard 
        title="网络速度(下载)"
        :value="metrics.networkSpeed"
        unit="Kbps"
        :trend="networkTrend"
        icon="network-wired"
      />
      <MetricCard 
        title="CPU占用率"
        :value="metrics.cpuUsage"
        unit="%"
        :alert="cpuAlert"
        icon="microchip"
      />
      <MetricCard 
        title="内存使用"
        :value="metrics.memoryUsage"
        unit="GB"
        :max="totalMemory"
        icon="memory"
      />
      <MetricCard 
        title="当前时间"
        :value="metrics.currentTime"
        icon="clock"
        is-time
      />
    </div>

    <!-- 连接错误提示 -->
    <transition name="fade">
      <div v-if="errorMessage" class="error-alert">
        {{ errorMessage }}
        <button @click="errorMessage = ''" class="close-btn">×</button>
      </div>
    </transition>
  </div>
</template>

<script>
import MetricCard from '@/components/MetricCard.vue'

export default {
  components: { MetricCard },//组件注册
  data() {
    return {
      ws: null,// WebSocket 连接对象，初始为空
      isConnected: false,
      errorMessage: '',
      totalMemory: 16, // 假设总内存16GB
      metrics: {
        networkSpeed: 0,//下载速度Kbps
        cpuUsage: 0,// CPU 使用率，单位 %
        memoryUsage: 0, // 内存使用量，单位 GB
        currentTime: '--:--:--'//当前时间
      },
      prevMetrics: {} // 用于计算趋势
    }
  },
  computed: {
    connectionStatusText() {
      return this.isConnected ? '已连接' : '已断开'
    },
    cpuAlert() {
      return this.metrics.cpuUsage > 80 //cpu占用超80%
    },
    networkTrend() {
      if (!this.prevMetrics.networkSpeed) return null
      return this.metrics.networkSpeed > this.prevMetrics.networkSpeed 
        ? 'up' : 'down' //趋势,绿色上升，蓝色下降
    }
  },
  methods: {
    toggleConnection() {
      if (this.isConnected) {
        this.disconnect()
      } else {
        this.connect()
      }
    },
    connect() {
      const token = localStorage.getItem('token')
      
      if (!token) {
        this.errorMessage = '请先登录获取访问令牌'
        return
      }

      this.ws = new WebSocket(`ws://localhost:8033/ws/metrics`, [token])


      this.ws.onopen = () => {
        this.isConnected = true
        this.errorMessage = ''
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.prevMetrics = { ...this.metrics }
          console.log('数据: ',data)
          this.metrics = {
            networkSpeed: data.network_speed?.toFixed(2) || 0, //单位Kbps
            cpuUsage: data.cpu_usage?.toFixed(1) || 0,
            memoryUsage: (data.memory_used )?.toFixed(2) || 0,//data.memory_used单位GB
            currentTime: data.timestamp 
              ? new Date(data.timestamp * 1000).toLocaleTimeString()
              : '--:--:--'
          }
        } catch (error) {
          console.log('数据解析错误: ', error)
        }
      }

      this.ws.onerror = (error) => {
        this.errorMessage = '连接服务器失败'
        console.log('WebSocket错误: ', error)
      }

      this.ws.onclose = () => {
        this.isConnected = false
      }
    },
    disconnect() {
      if (this.ws) {
        this.ws.close()
      }
      this.isConnected = false
    }
  },
  beforeUnmount() {
    this.disconnect()
  }
}
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.control-panel {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.control-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
  border: none;
}

.btn-danger:hover {
  background-color: #dc2626;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.connected {
  background-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.disconnected {
  background-color: #64748b;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.error-alert {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  background-color: #fef2f2;
  color: #b91c1c;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.close-btn {
  background: none;
  border: none;
  color: inherit;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0 0.5rem;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
