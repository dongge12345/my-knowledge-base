<template>
  <div class="panel">
    <h3>2. 对象类型 Prop</h3>
    <p class="desc">子组件虽然没有给 <code>profile</code> 重新赋值，但改了内部字段，本质上还是改到了父组件那份对象。</p>

    <div class="row">
      <span class="label">子组件看到的 name：</span>
      <strong>{{ profile.name }}</strong>
    </div>

    <div class="row">
      <span class="label">子组件看到的 city：</span>
      <strong>{{ profile.city }}</strong>
    </div>

    <div class="actions">
      <el-button size="mini" type="danger" @click="mutateObjectField">
        子组件改对象内部字段
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "PropObjectChild",
  props: {
    profile: {
      type: Object,
      required: true
    }
  },
  watch: {
    profile: {
      deep: true,
      handler(newVal) {
        this.$emit("append-log", `子组件[对象] watch 到 profile 变化，当前 name: ${newVal.name}`);
      }
    }
  },
  methods: {
    mutateObjectField() {
      const nextName = `${this.profile.name} -> 子组件改名`;
      this.$emit("append-log", `子组件[对象] 准备执行 this.profile.name = "${nextName}"`);
      this.profile.name = nextName;
      this.$emit("append-log", "子组件[对象] 已修改 profile.name，父组件会被同步影响。");
    }
  }
};
</script>

<style scoped>
.panel {
  padding: 16px;
  border: 1px solid #dbe4ee;
  border-radius: 12px;
  background: #fff3f1;
}

.panel h3 {
  margin: 0 0 10px;
  color: #8a2f1e;
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
