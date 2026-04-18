<template>
  <div class="login-container">
    <el-form class="login-form" :model="userInfo" label-width="120px" size="large">
      <el-form-item label="Username" prop="username">
        <el-input v-model="userInfo.username" placeholder="Please input username" />
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input v-model="userInfo.password" placeholder="Please input password" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">Login</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createEmptyUserInfo, useUserInfoStore } from '@/store/userInfo'
import type { UserInfo } from '@/store/userInfo'
import { getSingleQueryValue } from '@/utils/route'

const route = useRoute()
const router = useRouter()
const userInfoStore = useUserInfoStore()
const userInfo = ref<UserInfo>({
   ...(userInfoStore.userInfo ?? createEmptyUserInfo())
})

const redirectPath = computed(() => getSingleQueryValue(route.query.redirect) ?? '/')

const submitForm = () => {
    userInfoStore.setUserInfo({ ...userInfo.value })
    router.push(redirectPath.value)
}
</script>

<style scoped lang="less">
.login-container {
    display: flex;
    justify-content: center;
    padding-top: 20vh;
    height: 100vh;
}

.login-form {
    width: 400px;
}
</style>
