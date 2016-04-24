﻿// 注意 发布的时候需要去掉注释
// console.log('content_script loaded');
// var userInfo = $("span.mod_avatar.avt_small");
// chrome.runtime.sendMessage({type:"no_user", error:"没有登录."});
var appId;
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
    chrome.runtime.sendMessage(msg, function(returnAppId) {
        appId = returnAppId;
    });
}

var listItemCallback = function(itemResult){
    console.log(itemResult);
    // displayTree(buildTreeData(app, msg));
};

var getAppCallback = function(app){
    console.log(itemResult);
};

function add_button() {

    var button = $('<a hb_status="close" title="点击开启脑图模式" id="plugin_huobanmind_button" style="width: 30px;text-align: center;background-color: #9CC0FA;position: fixed;bottom: 150px;left: 0;z-index: 2147483639;font-weight: 600;cursor: pointer;">脑图模式</a>');
    $('body').append(button);
    $('body').append($('<style type="text/css">.node {cursor: pointer; } .node circle {fill: #fff; stroke: steelblue; stroke-width: 1.5px; } .node text {font: 10px sans-serif; } svg .link {fill: none; stroke: #ccc; stroke-width: 1.5px; }</style>'));


    button.click(function(){
        if (!check_in_list()) {
            return;
        }

        if (button.attr("hb_status") == "close") {
            showConfirm();
        } else {
            button.attr("hb_status", "close");
            button.attr("title", "点击退出脑图模式");
            $("#root").show();
        }
        return;
    });
}

var confirmIsCreated = false;

function showConfirm() {
    var confirmPopup = $('#plugin_huobanmind_confirm');
    $('div .hb_mask').show();
    if (confirmIsCreated) {
        confirmPopup.show();
        return;
    }

    chrome.runtime.sendMessage({"type":"getApp"}, function(app) {
        confirmPopup = $(
            '<div id="plugin_huobanmind_confirm" '
                + 'style="'
                    + 'width: 400px; text-align: center; position: fixed; bottom: 40%; left: 20%; '
                    + 'z-index: 2147483639; border-style: solid; border-width: thin; border-color: #e2e2d8; '
                    + 'padding: 10px; background: white; '
                + '"'
            + ' >'
                + '<div '
                    + 'style="'
                        + 'font-size: large; padding-bottom: 20px; border-bottom-style: solid; '
                        + 'border-bottom-width: thin; border-bottom-color: #e2e2d8; '
                    + '"'
                + ' >请选择分组字段</div>'
                + '<select style="margin-top: 10px; margin-bottom: 20px; "></select>'
                + '<div>'
                    + '<a id="plugin_huobanmind_confirm_button" '
                        + 'style="padding: 20px; font-size: 14px; border-color: black; cursor: pointer; "'
                    + '>确认</a>'
                    + '<a id="plugin_huobanmind_cancel_button" '
                        + 'style="padding: 20px; font-size: 14px; border-color: black; cursor: pointer; "'
                    + '>取消</a>'
                + '</div>'
            + '</div>');
        var allowedFields = listAllowedNodeField(app);
        var allowedField, option;

        for (var i = allowedFields.length - 1; i >= 0; i--) {
            allowedField = allowedFields[i];
            option = $('<option hb_field_id="'+allowedField.field_id+'">'+allowedField.name+'</option>');
            confirmPopup.children("select").append(option);
        }

        $('body').append(confirmPopup);
        confirmIsCreated = true;

        $('#plugin_huobanmind_cancel_button').click(function() {
            $('div .hb_mask').hide();
            confirmPopup.hide();
        });

        $('#plugin_huobanmind_confirm_button').click(function() {
            var selectedOption = $('#plugin_huobanmind_confirm select').get(0).selectedOptions[0];
            var groupByFieldId = parseInt($(selectedOption).attr('hb_field_id'));
            clickConfirmEvent(app, groupByFieldId);

            $('div .hb_mask').hide();
            confirmPopup.hide();
        })
    });
}

function clickConfirmEvent(app, groupByFieldId) {
    var button = $('#plugin_huobanmind_button');
    button.attr("hb_status", "open");
    button.attr("title", "点击退出脑图模式");

    chrome.runtime.sendMessage({"type":"listItem"}, function(itemResult) {
        treeData = buildTreeData(app, groupByFieldId, itemResult);
        $("#root").hide();
        displayTree(treeData);
    });

}

function check_in_list() {
    // todo
    return true;
}

main();