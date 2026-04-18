.devtools.panels.create(
    "Network", 
    "icons/icon48.png",
    "panel.html",
    panel => {
      panel.onShown.addListener(initPanel);
    }
  );
  
  function initPanel() {
    const port = chrome.runtime.connect();
    port.onMessage.addListener(msg => {
      if (msg.type === "REQUEST_COMPLETED") {
        console.log("接收了",msg)
        renderRequest(msg.data);
      }
    });
  }
  
  function renderRequest(data) {
    const table = document.getElementById('requests-table');
    const row = table.insertRow(0);
    row.innerHTML = `
      <td>${data.method}</td>
      <td>${data.url}</td>
      <td>${data.statusCode}</td>
      <td>${data.responseTime}ms</td>
    `;
  }
  