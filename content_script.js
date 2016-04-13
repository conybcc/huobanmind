// 注意 发布的时候需要去掉注释
// console.log('content_script loaded');
// var userInfo = $("span.mod_avatar.avt_small");
// chrome.runtime.sendMessage({type:"no_user", error:"没有登录."});

// 初始化, 传递消息给后端
var token = localStorage.getItem("_token");
var access_token = JSON.parse(token).access_token;
var msg = {"type": "init", "url": document.URL, "access_token":access_token};

console.log(access_token);
chrome.runtime.sendMessage(msg);
