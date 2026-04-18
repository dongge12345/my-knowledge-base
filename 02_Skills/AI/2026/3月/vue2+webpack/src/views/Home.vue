<template>
  <div>
    <el-card>
      <template #header></template>

      <el-alert
        type="info"
        :closable="false"
        title="这个项目已经预置了 webpack 性能优化、Vuex 联动、props 修改影响、组件版 v-model 和 Markdown 资源引入演示。"
      />

      <el-divider />

      <div class="tags">
        <el-tag type="success">splitChunks 分包策略</el-tag>
        <el-tag type="warning">Element UI 按需加载</el-tag>
        <el-tag type="primary">路由懒加载</el-tag>
        <el-tag type="danger">动态 import 重模块</el-tag>
        <el-tag>Vuex 状态联动</el-tag>
        <el-tag type="info">Props 修改影响演示</el-tag>
        <el-tag type="success">组件版 v-model</el-tag>
        <el-tag type="warning">Markdown 资源导入</el-tag>
      </div>

      <el-divider />

      <el-menu mode="horizontal" :default-active="activePath" @select="onSelect">
        <el-menu-item index="/home">首页</el-menu-item>
        <el-menu-item index="/heavy">重模块示例页</el-menu-item>
        <el-menu-item index="/vuex">Vuex 示例页</el-menu-item>
        <el-menu-item index="/props-mutation">Props 修改演示</el-menu-item>
        <el-menu-item index="/v-model">v-model 演示</el-menu-item>
        <el-menu-item index="/markdown">Markdown 演示</el-menu-item>
      </el-menu>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  computed: {
    activePath() {
      return this.$route.path;
    }
  },
  methods: {
    onSelect(path) {
      this.$router.push(path);
    }
  }
};
</script>

<style lang="less" scoped>
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
