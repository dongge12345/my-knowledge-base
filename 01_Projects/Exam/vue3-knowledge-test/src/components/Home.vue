<template>
  <div>
    <el-header>
      <h1 style="text-align: center;">vue3练手项目</h1>
    </el-header>
    <el-menu mode="horizontal">
      <el-menu-item index="1">
        <router-link to="/task-list">
          <el-link type="primary">
            任务列表
          </el-link>
        </router-link>
      </el-menu-item>
      <el-menu-item index="4">
        <router-link to="/about">
          <el-link type="primary">
            关于
          </el-link>
        </router-link>
      </el-menu-item>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
</script>

<style>

</style>