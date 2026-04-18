<template>
  <div class="panel">
    <h3>3. 数组类型 Prop</h3>
    <p class="desc">子组件执行 <code>push</code> 改的是同一个数组引用，所以父组件也会立刻看到变化。</p>

    <div class="row">
      <span class="label">子组件看到的 tags：</span>
      <strong>{{ tags.join(" / ") }}</strong>
    </div>

    <div class="row">
      <span class="label">当前长度：</span>
      <strong>{{ tags.length }}</strong>
    </div>

    <div class="actions">
      <el-button size="mini" type="danger" @click="mutateArray">
        子组件 push 一个新标签
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "PropArrayChild",
  props: {
    tags: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      serial: 1
    };
  },
  watch: {
    tags: {
      deep: true,
      handler(newVal) {
        this.$emit("append-log", `子组件[数组] watch 到 tags 变化，当前长度: ${newVal.length}`);
      }
    }
  },
  methods: {
    mutateArray() {
      const nextTag = `child-tag-${this.serial}`;
      this.serial += 1;
      this.$emit("append-log", `子组件[数组] 准备执行 this.tags.push("${nextTag}")`);
      this.tags.push(nextTag);
      this.$emit("append-log", "子组件[数组] 已 push，新元素直接进入父组件数组。");
    }
  }
};
</script>

<style scoped>
.panel {
  padding: 16px;
  border: 1px solid #dbe4ee;
  border-radius: 12px;
  background: #fef5f3;
}

.panel h3 {
  margin: 0 0 10px;
  color: #99351f;
}

.desc {
  margin: 0 0 16px;
  color: #7c5c54;
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
