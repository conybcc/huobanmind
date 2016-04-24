// 获取当前url以及用户信息
// 当前环境是后端, 所以 popup可以通过chrome.extension.getBackgroundPage()得到当前环境变量

function getDomainFromUrl(url){
	var host = "null";
	if(typeof url == "undefined" || null == url)
		url = window.location.href;
	var regex = /.*\:\/\/([^\/]*).*/;
	var match = url.match(regex);
	if(typeof match != "undefined" && null != match)
		host = match[1];
	return host;
}

function isItemListUrl(url) {
	return /http[s]?:\/\/.*\/apps\/(\d+)$/.test(url)
}

function setAppId(url) {
	var result = /http[s]?:\/\/.*\/apps\/(\d+)$/.exec(url);
	if (result[1]) {
		huobanData.appId = parseInt(result[1]);
	}
}

function clearAppId() {
	huobanData.appId = null;
}

function checkForValidUrl(tabId, changeInfo, tab) {
	if(getDomainFromUrl(tab.url).toLowerCase()=="app.huoban.com"){
		chrome.pageAction.show(tabId);
	}
};

// 是否高亮
chrome.tabs.onUpdated.addListener(checkForValidUrl);


var huobanData = {};
// console.log ('chrome.runtime.onMessage.addListener');

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){

	console.log(request);
	// console.log(request);
	if (request.type == 'init') {
		if (isItemListUrl(request.url)) {
			setAppId(request.url)
		} else {
			clearAppId();
		}

		huobanData.access_token = request.access_token;
		sendResponse(huobanData.appId);
	}

	if (request.type == 'getApp') {
		getApp(sendResponse);
	}

	if (request.type == 'listItem') {
		listItem(request.viewId, sendResponse);
	}

	if (request.type == 'listPublicView') {
		listPublicView(sendResponse);
	}

	if (request.type == 'listPrivateView') {
		listPrivateView(sendResponse);
	}

	return true;
});

var listItem = function(viewId, sendResponse) {
	$.ajax({
	    url: "https://api.huoban.com/v1/item/app/"+huobanData.appId+"/view/" + viewId+"/filter",
	    type: "POST",
	    headers: {
	        "Authorization":"Bearer " + huobanData.access_token,
	    },
	    data: JSON.stringify({limit:100}),
	    dataType: "json"
	}).done(function(itemResult) {
    	// chrome.runtime.sendMessage(itemResult);
    	sendResponse(itemResult);
	}).fail(function(jqXHR, textStatus) {
	    console.log(jqXHR);
	    console.log(textStatus);
	});
}

var getApp = function (sendResponse) {
	$.ajax({
	    url: "https://api.huoban.com/v1/app/"+huobanData.appId,
	    type: "GET",
	    headers: {
	        "Authorization":"Bearer " + huobanData.access_token,
	    },
	    // data: JSON.stringify({url:articleData.url}),
	    dataType: "json"
	}).done(function(app) {
    	// chrome.runtime.sendMessage(app);
    	sendResponse(app);
	}).fail(function(jqXHR, textStatus) {
	    console.log(jqXHR);
	    console.log(textStatus);
	});
}

var listPublicView = function(sendResponse) {
	$.ajax({
	    url: "https://api.huoban.com/v1/view/app/"+huobanData.appId+"/public/?limit=100&offset=0",
	    type: "GET",
	    headers: {
	        "Authorization":"Bearer " + huobanData.access_token,
	    },
	    // data: JSON.stringify({url:articleData.url}),
	    dataType: "json"
	}).done(function(views) {
    	sendResponse(views);
	}).fail(function(jqXHR, textStatus) {
	    console.log(jqXHR);
	    console.log(textStatus);
	});
}

var listPrivateView = function(sendResponse) {
	$.ajax({
	    url: "https://api.huoban.com/v1/view/app/"+huobanData.appId+"/private/?limit=100&offset=0",
	    type: "GET",
	    headers: {
	        "Authorization":"Bearer " + huobanData.access_token,
	    },
	    // data: JSON.stringify({url:articleData.url}),
	    dataType: "json"
	}).done(function(views) {
    	sendResponse(views);
	}).fail(function(jqXHR, textStatus) {
	    console.log(jqXHR);
	    console.log(textStatus);
	});
}
