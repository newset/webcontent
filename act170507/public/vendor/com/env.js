var env = (function(){
	
	var env = {};

	// pt:平台。adr:android;ios:iphone,默认触屏:ubook
	// vw:webView;分为微信（wx）,手q（qq），微博（wb），默认其他（ot）
	var UA = navigator.userAgent;
	var reg = /MicroMessenger\/([\d\.]+)/;
	var ua_version = reg.exec(UA);
	var version = 0;
	
	if (ua_version) {
		var vs = ua_version[0].match(/\d+/g);
		if (vs[2] && vs[2] > 9)//微信小版本问题 如6.3.15
			vs[2] = 9;
		version = vs.slice(0,3).join("");
	}

	env.pt =  /iPad|iPhone|iPod/.test(UA) && !/Android/.test(UA) ? "ios"
			: /Android/.test(UA) ? "adr" : "ubook";// 平台,同时是 iOS和 Android，那就说明不是 iOS
	env.vw  = !!UA.match(/MicroMessenger\/([\d\.]+)/) ? "wx" : !!UA
					.match(/(?:\bV1_AND_SQI?_|QQ\/)([\d\.]+)/) ? "qq" : !!UA
					.match(/\bWeibo/) ? "wb" : "ot"; // sns环境
	env.sv = env.pt == "ios" ? "iosmain" : env.pt == "adr" ? "andmain"
			: "ubook";// 后台服务
	env.ua = UA;
	env.wv = version;
	return env;

})();