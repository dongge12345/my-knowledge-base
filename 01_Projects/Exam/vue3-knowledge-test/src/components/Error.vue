<template>
  <div class="error-container">
    <h1 class="title">Error 404 Not Found</h1>
    <p class="description">The page you are looking for does not exist.</p>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="less">
.error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 200px;
}
.title {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
}
</style>  
