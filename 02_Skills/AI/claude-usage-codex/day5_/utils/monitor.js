/**
 * 前端监控 SDK（真实用户监控）
 * 功能：错误追踪、用户行为监听、性能指标、业务漏斗
 */

(function(window) {
  // 配置项
  const CONFIG = {
    reportUrl: 'https://your-monitor-server.com/api/report', // 上报接口
    appId: 'your-app-id',
    sampleRate: 1.0,                // 采样率 0~1，1表示100%上报
    enablePerformance: true,        // 是否收集性能指标
    enableErrorTracking: true,      // 是否收集错误
    enableClickTracking: true,      // 是否收集点击事件
    enablePageView: true,           // 是否收集页面访问
    batchSize: 5,                   // 批量上报数量
    flushInterval: 5000,            // 定时上报间隔(ms)
  };

  // 事件队列
  let eventQueue = [];
  let timer = null;

  // 生成唯一会话ID
  const sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;

  // 获取用户基础信息
  const getUserInfo = () => ({
    sessionId,
    url: window.location.href,
    referrer: document.referrer,
    userAgent: navigator.userAgent,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    timestamp: Date.now(),
  });

  // 上报数据（使用 sendBeacon 保证页面关闭时也能发送）
  function send(data) {
    const payload = JSON.stringify(data);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(CONFIG.reportUrl, payload);
    } else {
      // 降级使用 fetch
      fetch(CONFIG.reportUrl, {
        method: 'POST',
        body: payload,
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      }).catch(console.warn);
    }
  }

  // 批量上报
  function flush() {
    if (eventQueue.length === 0) return;
    const batch = [...eventQueue];
    eventQueue = [];
    send({ events: batch, appId: CONFIG.appId });
  }

  // 添加事件到队列
  function addEvent(eventType, data) {
    if (Math.random() > CONFIG.sampleRate) return;
    eventQueue.push({
      type: eventType,
      ...getUserInfo(),
      ...data,
    });
    if (eventQueue.length >= CONFIG.batchSize) {
      flush();
    } else if (!timer) {
      timer = setTimeout(() => {
        flush();
        timer = null;
      }, CONFIG.flushInterval);
    }
  }

  // ========== 1. 错误追踪 ==========
  if (CONFIG.enableErrorTracking) {
    // JS 运行时错误
    window.addEventListener('error', (event) => {
      addEvent('error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      });
    });

    // Promise 未捕获的 rejection
    window.addEventListener('unhandledrejection', (event) => {
      addEvent('unhandledrejection', {
        reason: event.reason?.message || event.reason,
        stack: event.reason?.stack,
      });
    });

    // 资源加载错误（img, script 等）
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        addEvent('resource_error', {
          tagName: event.target.tagName,
          src: event.target.src || event.target.href,
        });
      }
    }, true);
  }

  // ========== 2. 用户行为监听 ==========
  if (CONFIG.enableClickTracking) {
    document.addEventListener('click', (event) => {
      let target = event.target;
      let selector = '';
      while (target && target !== document) {
        if (target.id) {
          selector = `#${target.id}`;
          break;
        } else if (target.className && typeof target.className === 'string') {
          selector = `.${target.className.split(' ')[0]}`;
          break;
        }
        target = target.parentElement;
      }
      addEvent('click', {
        tagName: event.target.tagName,
        innerText: event.target.innerText?.substr(0, 50),
        selector: selector || event.target.tagName,
        x: event.clientX,
        y: event.clientY,
      });
    });
  }

  // ========== 3. 页面访问 & 性能指标 ==========
  if (CONFIG.enablePageView) {
    // 页面加载完成上报 PV
    window.addEventListener('load', () => {
      addEvent('pageview', {
        title: document.title,
        loadTime: performance.timing?.loadEventEnd - performance.timing?.navigationStart,
      });

      // 收集 Web Vitals (LCP, FID, CLS)
      if (CONFIG.enablePerformance && window.PerformanceObserver) {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          addEvent('performance', { metric: 'LCP', value: lastEntry.startTime });
        }).observe({ type: 'largest-contentful-paint', buffered: true });

        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
          const firstInput = entryList.getEntries()[0];
          if (firstInput) {
            addEvent('performance', { metric: 'FID', value: firstInput.processingStart - firstInput.startTime });
          }
        }).observe({ type: 'first-input', buffered: true });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) clsValue += entry.value;
          }
          addEvent('performance', { metric: 'CLS', value: clsValue });
        }).observe({ type: 'layout-shift', buffered: true });
      }
    });
  }

  // ========== 4. 业务漏斗分析（自定义埋点） ==========
  window.Monitor = {
    track(eventName, extra = {}) {
      addEvent('custom', { eventName, ...extra });
    },
  };

  // 页面关闭前清空队列
  window.addEventListener('beforeunload', () => {
    if (eventQueue.length > 0) flush();
  });

  console.log('[Monitor] SDK initialized');
})(window);