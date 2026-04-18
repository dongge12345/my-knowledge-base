<template>
  <div class="page">
    <el-card>
      <div slot="header" class="card-title">组件版 v-model 演示</div>

      <el-alert
        type="success"
        :closable="false"
        title="目标：把“父传 value，子发 input”这条链，在当前项目里直接跑出来。"
      />

      <el-divider />

      <div class="intro">
        <p><strong>一句话：</strong>组件版 v-model 本质上就是“父传 value，子发 input”。</p>
        <p><strong>等价展开：</strong><code>&lt;ModelInputDemo v-model="keyword" /&gt;</code> 等价于 <code>&lt;ModelInputDemo :value="keyword" @input="keyword = $event" /&gt;</code></p>
      </div>

      <div class="grid">
        <div class="panel">
          <h3>写法 1：直接用 v-model</h3>
          <model-input-demo
            v-model="keyword"
            label="v-model 写法"
            placeholder="输入内容会直接同步到父组件 keyword"
            @append-log="appendLog"
          />
          <p class="state"><strong>父组件 keyword：</strong>{{ keyword }}</p>
        </div>

        <div class="panel">
          <h3>写法 2：手动展开语法糖</h3>
          <model-input-demo
            :value="manualKeyword"
            label="展开写法"
            placeholder="这里等价于手写 :value + @input"
            @input="handleManualInput"
            @append-log="appendLog"
          />
          <p class="state"><strong>父组件 manualKeyword：</strong>{{ manualKeyword }}</p>
        </div>
      </div>

      <el-divider />

      <div class="explain">
        <div class="block">
          <div class="block-title">你可以观察什么</div>
          <p>1. 在子组件输入框里输入时，子不会直接改父数据，而是发出 <code>input</code> 事件。</p>
          <p>2. 父组件收到 <code>input</code> 后，才真正把值写回自己的状态。</p>
          <p>3. 父状态一变，又会把新的 <code>value</code> 传回子组件，于是输入框显示最新内容。</p>
        </div>

        <div class="block">
          <div class="block-title">当前父组件状态</div>
          <p><strong>keyword：</strong>{{ keyword }}</p>
          <p><strong>manualKeyword：</strong>{{ manualKeyword }}</p>
          <p><strong>大写派生：</strong>{{ keywordUpperCase }}</p>
        </div>
      </div>

      <el-divider />

      <div class="log-section">
        <div class="block-title">运行日志</div>
        <ul class="log-list">
          <li v-for="(item, index) in logs" :key="index">{{ item }}</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script>
import ModelInputDemo from "@/components/ModelInputDemo.vue";

export default {
  name: "VModelDemoView",
  components: {
    ModelInputDemo
  },
  data() {
    return {
      keyword: "hello vue2",
      manualKeyword: "manual input",
      logs: ["初始化完成：现在可以输入内容，观察 value -> input -> 父状态更新 这条链。"]
    };
  },
  computed: {
    keywordUpperCase() {
      return this.keyword.toUpperCase();
    }
  },
  watch: {
    keyword(newVal, oldVal) {
      this.appendLog(`父组件 watch 到 keyword 变化：${oldVal} -> ${newVal}`);
    },
    manualKeyword(newVal, oldVal) {
      this.appendLog(`父组件 watch 到 manualKeyword 变化：${oldVal} -> ${newVal}`);
    }
  },
  methods: {
    appendLog(message) {
      const time = new Date().toLocaleTimeString("zh-CN", { hour12: false });
      this.logs.unshift(`${time} - ${message}`);
    },
    handleManualInput(value) {
      this.appendLog(`父组件手写 @input 回调，执行 manualKeyword = '${value}'`);
      this.manualKeyword = value;
    }
  }
};
</script>

<style lang="less" scoped>
.card-title {
  font-weight: 700;
}

.intro {
  margin-bottom: 18px;
  color: #334e68;
  line-height: 1.8;
}

.intro code,
.explain code {
  padding: 2px 6px;
  border-radius: 6px;
  background: #eef2f7;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.panel,
.block,
.log-section {
  padding: 16px;
  border-radius: 12px;
  background: #f7f9fc;
}

.panel h3 {
  margin-top: 0;
  color: #243b53;
}

.state {
  margin-top: 14px;
  color: #486581;
}

.explain {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.block-title {
  margin-bottom: 12px;
  font-weight: 700;
  color: #243b53;
}

.block p {
  margin: 8px 0;
  color: #486581;
}

.log-list {
  margin: 0;
  padding-left: 20px;
}

.log-list li {
  margin-bottom: 10px;
  color: #334e68;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .grid,
  .explain {
    grid-template-columns: 1fr;
  }
}
</style>
