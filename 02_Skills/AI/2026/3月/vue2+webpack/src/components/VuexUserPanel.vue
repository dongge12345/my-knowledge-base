<template>
  <el-card class="panel">
    <div slot="header" class="panel-title">状态读取区 B</div>
    <div v-if="user">
      <div class="row">
        <span class="label">用户名</span>
        <strong>{{ user.name }}</strong>
      </div>
      <div class="row">
        <span class="label">角色</span>
        <el-tag type="primary">{{ user.role }}</el-tag>
      </div>
      <div class="row">
        <span class="label">本次载入计数</span>
        <strong>{{ user.visitCount }}</strong>
      </div>
    </div>
    <el-alert
      v-else
      title="尚未获取用户，点击左侧按钮触发 dispatch"
      type="info"
      :closable="false"
    />
  </el-card>
</template>

<script>
export default {
  name: "VuexUserPanel",
  computed: {
    user() {
      return this.$store.state.user;
    }
  }
};
</script>

<style lang="less" scoped>
.panel {
  height: 100%;
}

.panel-title {
  font-weight: 700;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.label {
  color: #5f6d84;
}
</style>

