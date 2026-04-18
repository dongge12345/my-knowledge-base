<template>
  <div class="panel">
    <h3>1. 基本类型 Prop</h3>
    <p class="desc">子组件直接执行 <code>this.title = ...</code>，父组件不会同步被改。</p>

    <div class="row">
      <span class="label">子组件看到的 title：</span>
      <strong>{{ title }}</strong>
    </div>

    <div class="row">
      <span class="label">子组件本地操作次数：</span>
      <strong>{{ localActionCount }}</strong>
    </div>

    <div class="actions">
      <el-button size="mini" type="warning" @click="mutatePrimitive">
        子组件直接改基本类型 prop
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "PropPrimitiveChild",
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      localActionCount: 0
    };
  },
  watch: {
    title(newVal, oldVal) {
      this.$emit("append-log", `子组件[基本类型] watch 到 title: ${oldVal} -> ${newVal}`);
    }
  },
  methods: {
    mutatePrimitive() {
      this.localActionCount += 1;
      this.$emit("append-log", "子组件[基本类型] 准备执行 this.title = '子组件直接改过的标题'");
      this.title = "子组件直接改过的标题";
      this.$emit("append-log", "子组件[基本类型] 已执行赋值。父组件原始值不会因此同步改变。");
    }
  }
};
</script>

<style scoped>
.panel {
  padding: 16px;
  border: 1px solid #dbe4ee;
  border-radius: 12px;
  background: #fff9ef;
}

.panel h3 {
  margin: 0 0 10px;
  color: #7c4f00;
}

.desc {
  margin: 0 0 16px;
  color: #7a6c52;
  line-height: 1.6;
}

.row {
  margin-bottom: 10px;
}

.label {
  color: #5a6b7b;
}

.actions {
  margin-top: 14px;
}
</style>
