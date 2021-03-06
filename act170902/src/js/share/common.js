// 【本函数库唯一需要手工配置的地方】
	var _CONF = {
		TEST_HOST : 'ptsolomo.reader.qq.com', // 测试环境访问地址
		TEST_FRONT : 'https://ptsolomo.reader.qq.com/book_res/event/', // 测试环境前台地址
		TEST_SERVER : 'https://ptwapmusic3.reader.qq.com/activity/', // 测试环境后台服务地址
		FORMAL_HOST : 'yuedu.reader.qq.com', // 正式环境访问地址
		FORMAL_FRONT : 'https://yuedu.reader.qq.com/event/', // 正式环境前台地址
		FORMAL_SERVER : 'https://event.reader.qq.com/activity/', // 正式环境后台服务地址
	};
	function server() {
		if (
			window.location.hostname === _CONF.FORMAL_HOST||
			window.location.hostname === 'iyuedu.qq.com'){
			return _CONF.FORMAL_SERVER;
		}else{
			return _CONF.TEST_SERVER;
		};
	}
	function front() {
		if (window.location.hostname == _CONF.FORMAL_HOST)
			return _CONF.FORMAL_FRONT;
		else
			return _CONF.TEST_FRONT;
	}
	function pageurl(url,fullscreen) {
		if (window.location.hostname == _CONF.FORMAL_HOST){
			if(env.pt == "adr"){
				if(fullscreen){
					return "fullscreen/http://iyuedu.qq.com/event/" + url;
				}
				return "http://iyuedu.qq.com/event/" + url;
			}else if(env.pt == "ios"){
				return _CONF.FORMAL_FRONT + url;
			}
		}else{
			if(env.pt == "adr"){
				if(fullscreen){
					return "fullscreen/http://solomotest4.3g.qq.com/book_res/event/" + url;
				}
				return "http://solomotest4.3g.qq.com/book_res/event/" + url;
			}else if(env.pt == "ios"){
				return _CONF.TEST_FRONT + url;
			}		
		}
	}
// 构造当前页面请求参数表
var _PARAMS = {};// url参数map
var pageName = '';// 页面
var pageLong = '';// 长页面，精确到二级
(function() {
	var i = location.href.indexOf('?', 0);
	var url;
	if (i > 0) {
		var str1 = location.href.substring(i + 1, location.href.length
				- location.hash.length);
		if (str1.length > 0)
			_PARAMS = obj('{"' + str1.replace(/&/g, '","').replace(/=/g, '":"')
					+ '"}');
		url = location.href.substring(0, i + 1);
	} else {
		url = location.href;
	}
	var d = url.split('/');
	pageName = d[d.length - 1].replace(/.html[\?,#,&]*$/, '');
	pageLong = url.match(/[\w]+\/[\w]+\.html/)[0] || pageName;
})();

// JSON字符串转对象
function obj(str) {
	return JSON.parse(str);
}

function json(obj) {
	return JSON.stringify(obj);
}
/**
 * 1注册native方法 2初始化页面js init方法 3阻止拖拽事件
 */
function initAll() {
	init();
	document.ondragstart = function() {
		return false;
	};
}

// 异步请求，回调函数的入参是响应文本。
function reqa(url, callback, errcallback) {
	url += url.indexOf('?') != -1 ? ('&tt=' + ttag()) : ('?tt=' + ttag());
 	var xhr = new XMLHttpRequest();
    xhr.timeout = 5000;
    xhr.ontimeout = function(){
        console.log('timeout');
    };
    xhr.onerror = function(xhr,type){
        console.log(xhr, type);
        if (!nl(errcallback)) {
            callback(errcallback);
        }
    };
    xhr.onreadystatechange = function(){
        if( xhr.readyState===4 ){
            if( xhr.status===200 ){
                var data = xhr.responseText;
                callback(data);
            };
        };
    };
    xhr.open( 'GET',url );
    xhr.send( null );  
}
// 当前毫秒时间末四位字符串
function ttag() {
	return (new Date().getTime()) % 10000;
}

// 获取当前页面请求参数值
function param(name) {
	return _PARAMS[name];
}
// 设置当前页面的请求参数值
function setParam(name, value) {
	_PARAMS[name] = value;
}

//保存
function cks(name, value, minites) {
	var expires = "";
	if (minites) {
		var date = new Date();
		date.setTime(date.getTime() + (minites * 60 * 1000));
		expires = "; expires=" + date.toGMTString();
	}
	document.cookie = name + "=" + value + expires + "; path=/";
};
// 获取cookie
function ckg(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ')
			c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0)
			return c.substring(nameEQ.length, c.length);
	}
	return null;
};
// 获取页面名称
function getPageName() {
	return pageName;
}
// 对象为空判断
function nl(obj) {
	return obj==undefined || obj==null || obj=='';
	// return $.trim(obj) == false;
}

/**
 * @param act_f
 *            pv,uv来源，五位数字
 * @param act_b
 *            点击来源，string页面元素属性，默认当前页面
 */
function forceLog(act_f, act_b) {
	var act_from = act_f || -110;
	var act_by = act_b || pageLong;
	reqa(server() + "sum?act_f=" + act_from + "&act_b=" + act_by,
			function(data) {
			});
}
// pt:平台。adr:android;ios:iphone,默认触屏:ubook
// vw:webView;分为微信（wx）,手q（qq），微博（wb），默认其他（ot）
(function(){
	var UA = navigator.userAgent,reg = /MicroMessenger\/([\d\.]+)/,ua_version = reg.exec(UA),version = 0,env={};
	if (ua_version) {
		var vs = ua_version[0].match(/\d+/g);
		if (vs[2] && vs[2] > 9)//微信小版本问题 如6.3.15
			vs[2] = 9;
		version = vs.join("");
	}
	
	env.pt =  /iPad|iPhone|iPod/.test(UA) && !/Android/.test(UA) ? "ios"
			: /Android/.test(UA) ? "adr" : "ubook";// 平台,同时是 iOS和 Android，那就说明不是 iOS
	env.vw  = !!UA.match(/MicroMessenger\/([\d\.]+)/) ? "wx" : !!UA
					.match(/(?:\bV1_AND_SQI?_|QQ\/)([\d\.]+)/) ? "qq" : !!UA
					.match(/\bWeibo/) ? "wb" : "ot"; // sns环境
	env.sv = env.pt == "ios" ? "iosmain" : env.pt == "adr" ? "andmain"
			: "ubook";// 后台服务
	env.ua = UA;
	env.wv = version;//微信版本
	window.env=env;
})();