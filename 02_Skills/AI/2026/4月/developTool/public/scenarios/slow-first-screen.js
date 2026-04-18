const params = new URLSearchParams(window.location.search);
const mode = params.get("mode") === "good" ? "good" : "bad";
const modeLabel = document.querySelector("#mode-label");
const modeHint = document.querySelector("#mode-hint");
const heroStage = document.querySelector("#hero-stage");
const feedGrid = document.querySelector("#feed-grid");
const timelineList = document.querySelector("#timeline-list");
const metricBody = document.querySelector("#metric-body");

const metricState = {
  FP: "等待中",
  FCP: "等待中",
  LCP: "等待中",
  "Long Task": "等待中"
};

function addLog(title, detail) {
  const item = document.createElement("li");
  item.innerHTML = `<strong>${title}</strong><br />${detail}`;
  timelineList.prepend(item);
}

function updateMetric() {
  metricBody.innerHTML = Object.entries(metricState)
    .map(([key, value]) => `<tr><td>${key}</td><td>${value}</td></tr>`)
    .join("");
}

function blockMainThread(ms) {
  const end = performance.now() + ms;
  while (performance.now() < end) {
    Math.sqrt(Math.random() * 99999);
  }
}

function createFeedCard(index) {
  const card = document.createElement("article");
  card.className = "feed-card";
  card.innerHTML = `
    <strong>内容卡片 #${index + 1}</strong>
    <p>这块内容本来不是首屏核心区域，但问题版会在页面刚加载时一次性同步渲染，导致主线程更忙。</p>
  `;
  return card;
}

function renderHero() {
  heroStage.innerHTML = `
    <section class="hero-visual">
      <span class="pill">首屏核心区域</span>
      <h2>如果这块大内容很晚才出现，LCP 往往就会明显变差。</h2>
      <p>你可以在 Performance 里结合 Screenshots 和 LCP marker 看它到底是网络慢、脚本慢，还是渲染被阻塞。</p>
    </section>
  `;
}

function renderFeedSync(count) {
  for (let index = 0; index < count; index += 1) {
    feedGrid.appendChild(createFeedCard(index));
  }
}

function renderFeedChunked(total, chunkSize) {
  let cursor = 0;

  function renderChunk() {
    const fragment = document.createDocumentFragment();
    const end = Math.min(cursor + chunkSize, total);

    for (let index = cursor; index < end; index += 1) {
      fragment.appendChild(createFeedCard(index));
    }

    feedGrid.appendChild(fragment);
    cursor = end;

    if (cursor < total) {
      window.setTimeout(renderChunk, 16);
      return;
    }

    addLog("非关键内容完成", "优化版把次要卡片拆成多个小任务渲染，避免页面一上来就被长任务堵住。");
  }

  renderChunk();
}

function initObservers() {
  if (!("PerformanceObserver" in window)) {
    return;
  }

  try {
    const paintObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name === "first-paint") {
          metricState.FP = `${entry.startTime.toFixed(0)} ms`;
        }
        if (entry.name === "first-contentful-paint") {
          metricState.FCP = `${entry.startTime.toFixed(0)} ms`;
        }
      });
      updateMetric();
    });
    paintObserver.observe({ type: "paint", buffered: true });
  } catch (error) {
    addLog("Paint Observer 不可用", "当前环境不支持 paint observer。");
  }

  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      metricState.LCP = `${lastEntry.startTime.toFixed(0)} ms`;
      updateMetric();
    });
    lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
  } catch (error) {
    addLog("LCP Observer 不可用", "当前环境不支持 largest-contentful-paint observer。");
  }

  try {
    const longTaskObserver = new PerformanceObserver((list) => {
      const total = list.getEntries().reduce((sum, entry) => sum + entry.duration, 0);
      metricState["Long Task"] = `${total.toFixed(0)} ms`;
      updateMetric();
    });
    longTaskObserver.observe({ type: "longtask", buffered: true });
  } catch (error) {
    addLog("Long Task Observer 不可用", "当前环境不支持 longtask observer。");
  }
}

function runBadMode() {
  modeLabel.textContent = "问题版";
  modeHint.innerHTML = `
    <strong>问题版提示</strong>
    <p>页面会先做一段同步阻塞，再一次性渲染大量次要内容。你应该能在 Performance 里看到明显的长任务和更晚的 FCP / LCP。</p>
  `;

  addLog("开始加载", "问题版会优先执行耗时脚本，而不是先把首屏关键内容交给浏览器渲染。");
  blockMainThread(2200);
  addLog("同步脚本结束", "主线程被阻塞约 2200ms，这会直接拖慢首屏绘制。");
  renderHero();
  addLog("首屏核心内容开始出现", "Hero 区域在阻塞结束后才渲染。");
  renderFeedSync(48);
  addLog("大量次要内容同步渲染", "48 张卡片一次性进入 DOM，继续加重布局和绘制压力。");
}

function runGoodMode() {
  modeLabel.textContent = "优化版";
  modeHint.className = "callout-success";
  modeHint.innerHTML = `
    <strong>优化版提示</strong>
    <p>页面会先渲染首屏 Hero，再把次要工作拆散到后续小任务里。你应该能看到更早的 FCP / LCP 和更少的长任务。</p>
  `;

  addLog("开始加载", "优化版优先给浏览器可见内容，让首屏更快出现。");
  renderHero();
  addLog("首屏核心内容已渲染", "Hero 先出现，用户更早看到核心内容。");
  window.setTimeout(() => {
    addLog("开始分片渲染次要内容", "次要卡片延后到首屏之后，并拆成多个小批次。");
    renderFeedChunked(48, 6);
  }, 80);
}

updateMetric();
initObservers();
window.addEventListener("load", () => addLog("load 事件触发", "你可以对比问题版和优化版在 load 前后都发生了什么。"));

if (mode === "bad") {
  runBadMode();
} else {
  runGoodMode();
}
