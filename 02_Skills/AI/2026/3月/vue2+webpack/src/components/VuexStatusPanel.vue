<template>
  <el-card class="panel">
    <div slot="header" class="panel-title">状态读取区 A</div>
    <div class="row">
      <span class="label">请求状态</span>
      <el-tag :type="statusType">{{ statusText }}</el-tag>
    </div>
    <div class="row">
      <span class="label">是否已登录</span>
      <el-tag :type="isLogin ? 'success' : 'info'">{{ isLogin ? "是" : "否" }}</el-tag>
    </div>
    <div class="row">
      <span class="label">访问次数</span>
      <strong>{{ visitCount }}</strong>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "VuexStatusPanel",
  computed: {
    isLogin() {
      return this.$store.getters.isLogin;
    },
    statusText() {
      return this.$store.getters.statusText;
    },
    visitCount() {
      return this.$store.state.visitCount;
    },
    statusType() {
      return this.isLogin ? "success" : "warning";
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

