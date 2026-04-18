const metrics = [
  { name: "FP", detail: "第一次像素绘制" },
  { name: "FCP", detail: "第一次有内容绘制" },
  { name: "FMP", detail: "历史指标，了解概念即可" },
  { name: "LCP", detail: "最大内容元素出现时间" },
  { name: "TBT", detail: "FCP 后被长任务阻塞的总时间" },
  { name: "TTI", detail: "真正稳定可交互的时间" }
];

const grid = document.querySelector("#metric-grid");

if (grid) {
  metrics.forEach((metric) => {
    const card = document.createElement("article");
    card.className = "metric-card";
    card.innerHTML = `<strong>${metric.name}</strong><span>${metric.detail}</span>`;
    grid.appendChild(card);
  });
}
