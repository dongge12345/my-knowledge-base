<template>
  <div>
    5vue内容
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
function getRomaticPoetry(poetry1: string, poetry2: string): string {
    return poetry1 + '-' + poetry2;
}
const feature = ref();
console.log('5Vue script')
</script>
