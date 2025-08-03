<template>
  <div 
    class="metric-card"
    :class="{
      'alert': alert,
      [`trend-${trend}`]: trend
    }"
  >
    <div class="card-icon">
      <i :class="['fas', `fa-${icon}`]"></i>
    </div>
    <div class="card-content">
      <h3>{{ title }}</h3>
      <p class="value">
        {{ formattedValue }}
        <span v-if="unit" class="unit">{{ unit }}</span>
      </p>
      <div v-if="max" class="progress-bar">
        <div 
          class="progress-fill"
          :style="{ width: `${(value / max) * 100}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    value: [String, Number],
    unit: String,
    icon: String,
    max: Number,
    alert: Boolean,
    trend: String,
    isTime: Boolean
  },
  computed: {
    formattedValue() {
      if (this.isTime) return this.value
      return Number(this.value) || 0
    }
  }
}
</script>

<style scoped>
.metric-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.metric-card.alert {
  border-left: 4px solid #ef4444;
}

.metric-card.trend-up {
  border-left: 4px solid #10b981;
}

.metric-card.trend-down {
  border-left: 4px solid #3b82f6;
}

.card-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: #e2e8f0;
  font-size: 2.5rem;
}

.card-content {
  position: relative;
  z-index: 1;
}

h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
}

.value {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
}

.unit {
  font-size: 1rem;
  color: #64748b;
  margin-left: 0.25rem;
}

.progress-bar {
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  margin-top: 1rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #3b82f6;
  transition: width 0.5s ease;
}
</style>
