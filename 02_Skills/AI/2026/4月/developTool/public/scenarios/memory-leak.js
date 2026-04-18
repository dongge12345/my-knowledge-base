const params = new URLSearchParams(window.location.search);
const mode = params.get("mode") === "good" ? "good" : "bad";
const mountButton = document.querySelector("#mount-btn");
const unmountButton = document.querySelector("#unmount-btn");
const cycleButton = document.querySelector("#cycle-btn");
const memoryStage = document.querySelector("#memory-stage");
const statusGrid = document.querySelector("#status-grid");
const logList = document.querySelector("#log-list");
const modeLabel = document.querySelector("#mode-label");
const modeHint = document.querySelector("#mode-hint");

const state = {
  activeWidget: null,
  mountCount: 0,
  unmountCount: 0,
  leakBucket: []
};

function addLog(title, detail) {
  const item = document.createElement("li");
  item.innerHTML = `<strong>${title}</strong><br />${detail}`;
  logList.prepend(item);
}

function makeLargePayload(recordCount = 1600) {
  return Array.from({ length: recordCount }, (_, index) => ({
    id: index,
    title: `record-${index}`,
    content: "memory-leak-demo-".repeat(60),
    nested: {
      score: index * 7,
      flag: index % 2 === 0
    }
  }));
}

function estimateLeakMB() {
  return (state.leakBucket.length * 1.6).toFixed(1);
}

function renderStatus() {
  const items = [
    { name: "当前模式", value: mode === "bad" ? "问题版" : "修复版" },
    { name: "挂载次数", value: String(state.mountCount) },
    { name: "卸载次数", value: String(state.unmountCount) },
    { name: "保留会话数", value: String(state.leakBucket.length) },
    { name: "估算滞留内存", value: `${estimateLeakMB()} MB` }
  ];

  statusGrid.innerHTML = items
    .map(
      (item) => `
        <article class="status-card">
          <strong>${item.value}</strong>
          <span>${item.name}</span>
        </article>
      `
    )
    .join("");
}

function buildWidgetMarkup(payload) {
  const root = document.createElement("section");
  root.className = "memory-widget";
  root.innerHTML = `
    <span class="pill">模拟详情组件</span>
    <h3>组件已挂载</h3>
    <p>当前持有 ${payload.length} 条记录，并注册了一个 resize 监听和一个 interval。</p>
  `;
  return root;
}

function mountWidget() {
  if (state.activeWidget) {
    addLog("跳过挂载", "当前已经有一个组件处于挂载状态。");
    return;
  }

  const payload = makeLargePayload();
  const root = buildWidgetMarkup(payload);
  const resizeHandler = () => {
    root.dataset.lastResize = `${payload[0].title}-${Date.now()}`;
  };
  const intervalId = window.setInterval(() => {
    root.dataset.tick = String(Date.now());
  }, 1000);

  window.addEventListener("resize", resizeHandler);
  memoryStage.appendChild(root);

  state.activeWidget = { payload, root, resizeHandler, intervalId };
  state.mountCount += 1;
  renderStatus();
  addLog("组件挂载", "创建了大数组、事件监听和定时器。");
}

function unmountWidget() {
  if (!state.activeWidget) {
    addLog("跳过卸载", "当前没有已挂载的组件。");
    return;
  }

  const widget = state.activeWidget;
  widget.root.remove();
  state.unmountCount += 1;

  if (mode === "bad") {
    state.leakBucket.push(widget);
    addLog("组件卸载但未释放", "问题版保留了对组件、数组、监听器和定时器的引用，内存会持续上涨。");
  } else {
    window.removeEventListener("resize", widget.resizeHandler);
    window.clearInterval(widget.intervalId);
    addLog("组件卸载并完成清理", "修复版移除了事件监听、清掉定时器，并断开大对象引用。");
  }

  state.activeWidget = null;
  renderStatus();
}

function runCycles(total) {
  let count = 0;

  function next() {
    if (count >= total) {
      addLog("自动循环结束", "现在可以去 Memory 面板做快照对比。");
      return;
    }

    mountWidget();
    window.setTimeout(() => {
      unmountWidget();
      count += 1;
      window.setTimeout(next, 140);
    }, 140);
  }

  next();
}

if (mode === "bad") {
  modeLabel.textContent = "问题版";
  modeHint.innerHTML = `
    <strong>问题版提示</strong>
    <p>卸载时没有清理监听器、定时器，也没有断开对大数组和 DOM 节点的引用。反复操作后，Heap Snapshot 中对象会越来越多。</p>
  `;
} else {
  modeLabel.textContent = "修复版";
  modeHint.className = "callout-success";
  modeHint.innerHTML = `
    <strong>修复版提示</strong>
    <p>卸载时会清理监听器、定时器，并丢掉大对象引用。重复操作后，再做快照时对象不应该无限增长。</p>
  `;
}

mountButton.addEventListener("click", mountWidget);
unmountButton.addEventListener("click", unmountWidget);
cycleButton.addEventListener("click", () => runCycles(6));

renderStatus();
addLog("准备完成", "建议先做一张基线快照，再开始重复操作。");
