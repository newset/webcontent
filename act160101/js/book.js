// 【本函数库主要进行一些书籍相关操作，注意支持Android和IOS】
var ABook = {};

/**
 * 跳转书籍详情页5.7以后
 */
ABook.gotoDetail57 = function(bid) {
	window.location.href = "uniteqqreader://nativepage/book/detail?bid=" + bid;
}
/**
 * 跳转书籍详情页
 */
ABook.gotoDetail = function(bid) {
	var dataObj = {
		pagecode : 1001,
		bid : bid
	};
	Local.openDetailByCode(dataObj);
}
/**
 * 跳转阅读页
 */
ABook.gotoRead = function(bid) {
	var dataObj = {
			pagecode : 1015,
			bid : bid
	};
	Local.openDetailByCode(dataObj);
}