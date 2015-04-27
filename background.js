 
/*

"background": {
    "scripts": ["background.js"],
    "persistent": false
  },
  
chrome.extension.onConnect.addListener(function(port) {
	var tab=request.sender.tab;

});*/

/*
sendResponse is the callback
*/

function onRequest(request, sender, sendResponse) {
alert(11)
    if (request.user_info !=null) {
    	//alert('13' + sendResponse)
//log.console('onReqeuest '+request.user_info)
var sR=sendResponse;
	QUEUE({url:request.user_info,callback:function () {  
		 if (req.readyState == 4) {
	            if (req.status == 200) {

alert('openXml callback'+sendResponse)
			sR({contents: req})

		    }
		    executeQueue(true);
	  	 }
		},params:request.params,method:request.method
	});
 	
    } else {
    	log.console('28 something missing')
    }
}

chrome.extension.onMessage.addListener(onRequest);

var XHR=[];
var xhr_cursor=0;
var xhr_loading=0;
var req=new XMLHttpRequest();

function openXML(url,callback,method,params) {
	alert('openXml ');
	req.onreadystatechange = callback;
//alert(url+"\n"+method+"\n"+params+"\n"+callback);

	req.open(((method==null)?"GET":"POST"),url,true);
if (params!=null) {
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	 req.send(params);
} else req.send();

}

function QUEUE(params) {
	alert(53);
	XHR[XHR.length]=params;
	if (xhr_loading==0) executeQueue();
}

function executeQueue(wait) {
	alert(59);
	if (XHR.length>0 && xhr_cursor+1<=XHR.length) {
		xhr_loading=1;
	 	if (wait) { //to get outside of the recursive, if called within onreadystatechange
			window.setTimeout(function() {execute();},100);
		} else {
			execute();
		}
	} else { xhr_loading=0; XHR=[]; xhr_cursor=0;}
}
function execute() {
	alert(70);
	var request=XHR[xhr_cursor++];
	if (request!=undefined) openXML(request.url, request.callback,request.method,request.params);
	
}
 