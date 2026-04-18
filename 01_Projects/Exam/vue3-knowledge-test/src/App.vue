<template>
  <div>
    <Header v-if="!route.meta.noAuth" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import Header from '@/components/Header.vue'

const route = useRoute()
</script>

<style scoped lang="less">
header {
    display: flex;
    justify-content: right;
    padding-top: 20px;
}
</style>
