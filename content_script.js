// 注意 发布的时候需要去掉注释
// console.log('content_script loaded');
// var userInfo = $("span.mod_avatar.avt_small");
// chrome.runtime.sendMessage({type:"no_user", error:"没有登录."});
function main() {
    init_token();
    add_button();
}


// 初始化, 传递消息给后端
function init_token() {
    var token = localStorage.getItem("_token");
    var access_token = JSON.parse(token).access_token;
    var msg = {"type": "init", "url": document.URL, "access_token":access_token};

    console.log(access_token);
    chrome.runtime.sendMessage(msg);
}

var listItemCallback = function(itemResult){
    console.log(itemResult);
    // displayTree(buildTreeData(app, msg));
};

var getAppCallback = function(app){
    console.log(itemResult);
};

function add_button() {

    var button = $('<a id="plugin_huobanmind_button" style="position: fixed; bottom: 150px; left: 0; z-index: 2147483639; width: auto; background-color: transparent;">脑图模式</a>');
    $('body').append(button);

    button.click(function(){
        if (!check_in_list()) {
            return;
        }

        chrome.runtime.sendMessage({"type":"getApp"}, function(app) {
            chrome.runtime.sendMessage({"type":"listItem"}, function(itemResult) {
                treeData = buildTreeData(app, itemResult);
                $("#root").hide();
                displayTree(treeData);
            });
        });
        return;
    });
}


function check_in_list() {
    // todo
    return true;
}

main();