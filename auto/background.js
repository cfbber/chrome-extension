// background.js (for service worker)

function reloadExtension() {
  console.log("重新加载插件...");
//  chrome.runtime.reload();  // 每3秒重载插件
}

// 设置每3秒重新加载一次插件
setInterval(reloadExtension, 3000);  // 3000 毫秒 = 3 秒

chrome.runtime.onInstalled.addListener(() => {
  console.log("插件已安装或更新");
});
