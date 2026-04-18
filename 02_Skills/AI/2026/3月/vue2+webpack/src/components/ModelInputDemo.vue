<template>
  <div class="wrapper">
    <label class="label">{{ label }}</label>
    <input
      class="input"
      :value="value"
      :placeholder="placeholder"
      @input="handleInput"
    />

    <div class="actions">
      <el-button size="mini" @click="emitPreset('Vue2 v-model')">
        发一个预设值
      </el-button>
      <el-button size="mini" type="primary" @click="emitUpperCase">
        发大写值
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModelInputDemo",
  props: {
    value: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: "子组件输入框"
    },
    placeholder: {
      type: String,
      default: "请输入内容"
    }
  },
  methods: {
    handleInput(event) {
      const nextValue = event.target.value;
      this.$emit("append-log", `子组件收到输入事件，准备 $emit('input', '${nextValue}')`);
      this.$emit("input", nextValue);
    },
    emitPreset(value) {
      this.$emit("append-log", `子组件按钮触发 $emit('input', '${value}')`);
      this.$emit("input", value);
    },
    emitUpperCase() {
      const nextValue = String(this.value).toUpperCase();
      this.$emit("append-log", `子组件按钮触发大写回写：$emit('input', '${nextValue}')`);
      this.$emit("input", nextValue);
    }
  }
};
</script>

<style scoped>
.wrapper {
  padding: 16px;
  border: 1px solid #dbe4ee;
  border-radius: 12px;
  background: #f7fbff;
}

.label {
  display: block;
  margin-bottom: 10px;
  font-weight: 700;
  color: #243b53;
}

.input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #bcccdc;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
}

.input:focus {
  border-color: #2684ff;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}
</style>
