<template>
  <div id="app">
    <div class="app-shell">
      <header class="header">
        <p>分包、按需加载、工程化拆分</p>
      </header>
      <main class="main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style lang="less" scoped>
.app-shell {
  min-height: 100vh;
  background: linear-gradient(135deg, #f6fbff 0%, #eef4ff 100%);
  background-image: url("./assets/image.png");
}

.header {
  padding: 20px 24px;
  border-bottom: 1px solid #e6ecf5;
  background: #ffffff;

  h1 {
    margin: 0 0 8px;
    font-size: 22px;
  }

  p {
    margin: 0;
    color: #5f6d84;
  }
}

.main {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}
</style>

