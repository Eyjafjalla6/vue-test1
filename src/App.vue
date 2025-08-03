<template>
  <router-view/>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
onMounted(() => {
  router.replace('/login') // 自动重定向到登录页
})
</script>
