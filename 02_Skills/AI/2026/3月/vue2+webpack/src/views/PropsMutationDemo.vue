<template>
  <div class="page">
    <el-card>
      <div slot="header" class="card-title">子组件修改 Props 演示</div>

      <el-alert
        type="warning"
        :closable="false"
        title="目标：把“改基本类型 prop / 改对象内部 / 改数组内部”三种情况并排展示出来，直观看父组件是否被影响。"
      />

      <el-divider />

      <div class="summary">
        <div class="summary-card">
          <div class="summary-title">父组件当前值</div>
          <p><strong>primitiveTitle：</strong>{{ primitiveTitle }}</p>
          <p><strong>profile.name：</strong>{{ profile.name }}</p>
          <p><strong>profile.city：</strong>{{ profile.city }}</p>
          <p><strong>tags：</strong>{{ tags.join(" / ") }}</p>
          <p><strong>父组件刷新计数：</strong>{{ refreshTick }}</p>
        </div>

        <div class="summary-card">
          <div class="summary-title">预期现象</div>
          <p>1. 直接改基本类型 prop：父组件不变。</p>
          <p>2. 改对象内部字段：父组件同步变化。</p>
          <p>3. 改数组内容：父组件同步变化。</p>
        </div>
      </div>

      <div class="toolbar">
        <el-button size="mini" @click="rerenderParent">让父组件重新 render 一次</el-button>
        <el-button size="mini" type="primary" @click="resetDemo">重置演示数据</el-button>
      </div>

      <div class="grid">
        <prop-primitive-child :title="primitiveTitle" @append-log="appendLog" />
        <prop-object-child :profile="profile" @append-log="appendLog" />
        <prop-array-child :tags="tags" @append-log="appendLog" />
      </div>

      <el-divider />

      <div class="tips">
        <div class="summary-title">怎么观察</div>
        <p>1. 先点“子组件直接改基本类型 prop”，看父组件区域是否变化。</p>
        <p>2. 再点“让父组件重新 render 一次”，观察基本类型 prop 会不会被父值覆盖回去。</p>
        <p>3. 再测试对象和数组，注意父组件展示区会立刻联动更新。</p>
      </div>

      <el-divider />

      <div class="logs">
        <div class="summary-title">运行日志</div>
        <ul>
          <li v-for="(item, index) in logs" :key="index">{{ item }}</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script>
import PropPrimitiveChild from "@/components/PropPrimitiveChild.vue";
import PropObjectChild from "@/components/PropObjectChild.vue";
import PropArrayChild from "@/components/PropArrayChild.vue";

function createInitialState() {
  return {
    primitiveTitle: "父组件原始标题",
    profile: {
      name: "Alice",
      city: "Shanghai"
    },
    tags: ["vue2", "webpack", "props-demo"]
  };
}

export default {
  name: "PropsMutationDemoView",
  components: {
    PropPrimitiveChild,
    PropObjectChild,
    PropArrayChild
  },
  data() {
    return {
      primitiveTitle: "",
      profile: {
        name: "",
        city: ""
      },
      tags: [],
      refreshTick: 0,
      logs: []
    };
  },
  created() {
    this.resetDemo();
  },
  watch: {
    primitiveTitle(newVal, oldVal) {
      if (typeof oldVal === "undefined") {
        return;
      }
      this.appendLog(`父组件 watch 到 primitiveTitle: ${oldVal} -> ${newVal}`);
    },
    profile: {
      deep: true,
      handler(newVal) {
        this.appendLog(`父组件 watch 到 profile 变化，当前 name: ${newVal.name}`);
      }
    },
    tags: {
      deep: true,
      handler(newVal) {
        this.appendLog(`父组件 watch 到 tags 变化，当前长度: ${newVal.length}`);
      }
    }
  },
  methods: {
    appendLog(message) {
      const time = new Date().toLocaleTimeString("zh-CN", { hour12: false });
      this.logs.unshift(`${time} - ${message}`);
    },
    rerenderParent() {
      this.refreshTick += 1;
      this.appendLog(`父组件手动触发一次重新 render，refreshTick = ${this.refreshTick}`);
    },
    resetDemo() {
      const initialState = createInitialState();
      this.primitiveTitle = initialState.primitiveTitle;
      this.profile = initialState.profile;
      this.tags = initialState.tags;
      this.refreshTick = 0;
      this.logs = ["重置完成：现在可以依次测试基本类型、对象、数组三种 props 变更。"];
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

.summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.summary-card,
.tips,
.logs {
  padding: 16px;
  border-radius: 12px;
  background: #f7f9fc;
}

.summary-title {
  margin-bottom: 12px;
  font-weight: 700;
  color: #243b53;
}

.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.summary-card p,
.tips p {
  margin: 8px 0;
  color: #334e68;
}

.logs ul {
  margin: 0;
  padding-left: 20px;
}

.logs li {
  margin-bottom: 10px;
  color: #334e68;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .summary {
    grid-template-columns: 1fr;
  }

  .toolbar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
