<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-title">重模块按需加载示例</div>
      </template>
      <p class="desc">
        进入此页面后，点击按钮才会动态加载 ECharts。首次加载完成后会被缓存，二次点击会更快。
      </p>

      <el-button type="primary" @click="loadChart" :disabled="loading">
        {{ loading ? "加载中..." : "动态加载并渲染图表" }}
      </el-button>

      <el-divider />

      <div v-if="loaded" class="status">
        <el-tag type="success">ECharts 已按需加载</el-tag>
      </div>
      <div v-else class="status">
        <el-tag type="info">尚未加载重模块</el-tag>
      </div>

      <div ref="chartRef" class="chart"></div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "HeavyView",
  data() {
    return {
      loading: false,
      loaded: false,
      chart: null
    };
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  },
  methods: {
    async loadChart() {
      if (this.loading) {
        return;
      }

      this.loading = true;
      try {
        // 业务重模块按需加载：用户触发时再下载 echarts
        const echarts = await import(
          /* webpackChunkName: "feature-echarts" */
          /* 给浏览器预取提示：空闲时可提前下载该异步资源 */
          /* webpackPrefetch: true */
          "echarts"
        );

        this.loaded = true;
        if (!this.chart) {
          this.chart = echarts.init(this.$refs.chartRef);
        }

        this.chart.setOption({
          tooltip: {},
          xAxis: {
            type: "category",
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
          },
          yAxis: { type: "value" },
          series: [
            {
              type: "line",
              smooth: true,
              data: [120, 132, 101, 134, 90, 230, 210]
            }
          ]
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.card-title {
  font-weight: 700;
}

.desc {
  margin: 0 0 16px;
  color: #5f6d84;
}

.status {
  margin-bottom: 16px;
}

.chart {
  height: 360px;
  width: 100%;
}
</style>
