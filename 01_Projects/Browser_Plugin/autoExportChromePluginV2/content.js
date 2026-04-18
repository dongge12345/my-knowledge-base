function captureResponse(originalRequest) {
  return fetch(originalRequest.url,{
    credentials: 'include' // ✅ 允许发送Cookie（同源和跨域均有效）
  }).then(async (res) => {
    // //console.log("restext", await res.text())
    return await res.text();
  });
}
//   function captureResponse(originalRequest) {
//     return fetch(originalRequest.url, {
//       method: originalRequest.method,
//     }).then(async res => {
//         //console.log("restext", await res.text())
//         return res;
//     });
//   }
function writeActionDebounce(arrStore){
    const blob = new Blob([JSON.stringify(arrStore)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `狒狒666-${formatTimestamp(Date.now())}.json`;
    a.click(); // 触发下载‌:ml-citation{ref="5,6" data="citationList"}
}
function createFixedButton() {
    const btn = document.createElement('button');
    btn.textContent = 'jijiji鸡';
    btn.title = "记得先刷新页面"
    btn.style.position = 'fixed';
    btn.style.top = '20px';
    btn.style.right = '20px';
    btn.style.padding = '10px 15px';
    btn.style.background = '#4285f4';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.borderRadius = '4px';
    btn.style.cursor = 'pointer';
    btn.style.zIndex = '9999';
  
    // 点击事件：发送API请求
    btn.addEventListener('click', async () => {
        //console.log("下载啦")
        writeActionDebounce(arrStore)
    //   try {
    //     const response = await fetch('https://api.example.com/data', {
    //       method: 'GET',
    //       headers: { 'Content-Type': 'application/json' }
    //     });
    //     const data = await response.json();
    //     //console.log('API响应:', data);
    //     alert(`请求成功，数据量: ${data.length}`);
    //   } catch (error) {
    //     console.error('请求失败:', error);
    //     alert('请求失败，请查看控制台');
    //   }
    });
  
    document.body.appendChild(btn);
  }
  
  //console.log("创建了dong2")
  if(window.location.href.startsWith('https://qn.taobao.com/home.htm')){
    //console.log("创建了dong",window.location.href)
      createFixedButton();
  }
  // 确保DOM加载完成后注入
  if (document.readyState === 'complete') {
  } else {
    window.addEventListener('DOMContentLoaded', createFixedButton);
  }
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}`;
    }
//console.log("注入了666");
let arrStore = [];
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  //console.log("CAPTURE_RESPONSE2", message);
  const reqData = message.action?.data;
  // 这里的逻辑转为直接执行
  if (message.type === "CAPTURE_RESPONSE") {
    let rerequestRes = await captureResponse(reqData);
    rerequestRes = rerequestRes.replace(/mtopjsonp21\(/, "");
    for (let i = 0; i < 100; i++) {
      //console.log("reg", /mtopjsonp${i}\(/);
      const reg = new RegExp(`mtopjsonp${i}\\(`);
      rerequestRes = rerequestRes.replace(reg, "");
    }
    rerequestRes = rerequestRes.replace(/\)$/, "");
    //console.log({ rerequestRes });
    rerequestRes = JSON.parse(rerequestRes);
    //console.log({ rerequestRes });
    //console.log({ model: rerequestRes.data.model });
    const arr = rerequestRes.data.model.result.map((item) => {
      return {
        contentId: item.contentInfo.contentId,
        coverUrl: item.contentInfo.content.coverUrl,
        releaseTime: formatTimestamp(item.contentInfo.content.releaseTime),
        nickName: item.contentInfo.account.nickName
      };
    });
    //console.log({ mapMap: arr });
    arrStore = [...arrStore, ...arr]
    Message.success('下载完成')
  } else {
    // this.execute(message, true)
  }
});


// 消息提醒
// 消息提示容器样式
const style = document.createElement('style');
style.textContent = `
.message-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
}
.message-item {
  padding: 10px 20px;
  margin-bottom: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  animation: fadein 0.3s;
  display: flex;
  align-items: center;
}
@keyframes fadein {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
.message-success { background: #f0f9eb; color: #67c23a; }
.message-error { background: #fef0f0; color: #f56c6c; }
.message-warning { background: #fdf6ec; color: #e6a23c; }
.message-info { background: #f4f4f5; color: #909399; }
`;
document.head.appendChild(style);

// 创建消息容器
const container = document.createElement('div');
container.className = 'message-container';
document.body.appendChild(container);

// 消息提示函数
function Message(options) {
  if (typeof options === 'string') {
    options = { message: options };
  }
  
  const item = document.createElement('div');
  item.className = `message-item message-${options.type || 'info'}`;
  item.textContent = options.message;
  
  container.appendChild(item);
  
  // 自动关闭
  const duration = options.duration || 500;
  setTimeout(() => {
    item.style.animation = 'fadeout 0.3s';
    setTimeout(() => item.remove(), 300);
  }, duration);
}

// 添加动画样式
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
@keyframes fadeout {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-20px); }
}
`;
document.head.appendChild(fadeStyle);

// 快捷方法
Message.success = (msg, duration) => Message({ message: msg, type: 'success', duration });
Message.error = (msg, duration) => Message({ message: msg, type: 'error', duration });
Message.warning = (msg, duration) => Message({ message: msg, type: 'warning', duration });
Message.info = (msg, duration) => Message({ message: msg, type: 'info', duration });

// // 挂载到全局
// window.$message = Message;