<template>
  <div class="page">
    <el-card>
      <div slot="header" class="card-title">Vuex 联动示例</div>
      <el-alert
        type="info"
        :closable="false"
        title="目标：把 dispatch -> action -> commit -> mutation -> 组件联动更新 这条链直接跑出来"
      />

      <el-divider />

      <div class="actions">
        <el-button type="primary" @click="runDemo" :disabled="loading">
          {{ loading ? "action 执行中..." : "触发 fetchUser action" }}
        </el-button>
        <el-button @click="resetDemo">重置示例</el-button>
      </div>

      <div class="grid">
        <vuex-status-panel />
        <vuex-user-panel />
      </div>

      <el-divider />

      <div class="chain">
        <div class="chain-title">链路说明</div>
        <div class="chain-list">
          <el-tag>1. 组件按钮点击</el-tag>
          <el-tag type="warning">2. dispatch action</el-tag>
          <el-tag type="primary">3. action 处理异步</el-tag>
          <el-tag type="success">4. commit mutation</el-tag>
          <el-tag type="danger">5. state 改变后多组件同步更新</el-tag>
        </div>
      </div>

      <el-divider />

      <div class="log-section">
        <div class="chain-title">运行日志</div>
        <ul class="log-list">
          <li v-for="(item, index) in logs" :key="index">{{ item }}</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script>
import VuexStatusPanel from "@/components/VuexStatusPanel.vue";
import VuexUserPanel from "@/components/VuexUserPanel.vue";

export default {
  name: "VuexDemoView",
  components: {
    VuexStatusPanel,
    VuexUserPanel
  },
  computed: {
    loading() {
      return this.$store.state.requestStatus === "loading";
    },
    logs() {
      return this.$store.state.logs;
    }
  },
  methods: {
    runDemo() {
      this.$store.dispatch("fetchUser");
    },
    resetDemo() {
      this.$store.commit("resetDemo");
    }
  }
};
</script>

<style lang="less" scoped>
.page {
  display: block;
}

.card-title {
  font-weight: 700;
}

.actions {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.chain-title {
  margin-bottom: 12px;
  font-weight: 700;
}

.chain-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.log-list {
  margin: 0;
  padding-left: 20px;
  color: #33415c;
}

.log-list li {
  margin-bottom: 10px;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
