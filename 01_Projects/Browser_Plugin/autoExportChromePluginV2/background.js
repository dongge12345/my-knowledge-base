const requestData = new Map();
function captureResponse(originalRequest) {
    return fetch(originalRequest.url, {
      method: originalRequest.method,
      headers: originalRequest.headers,
      body: originalRequest.body
    }).then(res => res.json());
  }
  let count1 = 0;
  let count2 = 0;
let urlMap = new Map();
chrome.webRequest.onBeforeRequest.addListener(
  async details => {
    const requestId = details.requestId;
    requestData.set(requestId, {
      url: details.url,
      method: details.method,
      startTime: Date.now(),
      requestHeaders: details.requestHeaders
    });
    //console.log("details", details)
    //console.log("count1",count1)
    //console.log("count2",count2)
    const urlCount = urlMap.get(details.url)
    //console.log("urlCount",urlCount)
    if(details.url.startsWith('https://h5api.m.taobao.com/h5/mtop.taobao.guangguang.creator.gateway.oneservice.kind.pagelist') && (!urlCount)){
        //console.log("details3", details,count1)
        // if(!urlCount){
        //     urlMap.set(details.url, 1)
        //     chrome.tabs.create({ url: details.url });
        // }else if(urlCount === 1){
        //     urlMap.set(details.url, 2)
        urlMap.set(details.url, 1)
            setTimeout(()=>{
                chrome.tabs.sendMessage(details.tabId, { type: 'CAPTURE_RESPONSE', action: {
                    type: 'CAPTURE_RESPONSE',
                    data: details
                  }
                })
            },1000)
        // }
    }
    // else if(details.url.startsWith('https://gm.mmstat.com/aes.1.1') && (count2 === 0)){
    //     //console.log("detail4", details)
    //     count2 += 1
        
    //     setTimeout(()=>{
    //         chrome.tabs.sendMessage(details.tabId, { type: 'CAPTURE_RESPONSE', action: {
    //             type: 'CAPTURE_RESPONSE',
    //             data: details
    //           }
    //         })
    //     },5000)
    // }
  },
  { urls: ["<all_urls>"] }
);


chrome.webRequest.onCompleted.addListener(
  details => {
    const requestId = details.requestId;
    if (requestData.has(requestId)) {
      const data = requestData.get(requestId);
      data.statusCode = details.statusCode;
      data.responseTime = Date.now() - data.startTime;
      data.responseHeaders = details.responseHeaders;
      
      //console.log("data",data,details)
    }
  },
  { urls: ["<all_urls>"] }
);
