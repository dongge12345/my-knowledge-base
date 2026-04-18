<template>
  <div class="header">
    <el-button type="primary" @click="logout">Logout</el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserInfoStore } from '@/store/userInfo'

const router = useRouter()
const userInfoStore = useUserInfoStore()

const logout = () => {
    userInfoStore.clearUserInfo()
    router.push('/login')
}
</script>

<style scoped lang="less">
.header {
    display: flex;
    justify-content: right;
    align-items: center;
    padding: 10px;
}
</style>
