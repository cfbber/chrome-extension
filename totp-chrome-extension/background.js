// background.js
chrome.runtime.onInstalled.addListener(() => {
  console.log("扩展已安装");
});

chrome.action.onClicked.addListener((tab) => {
  console.log("扩展按钮被点击");
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => alert("扩展按钮被点击")
  });
});
