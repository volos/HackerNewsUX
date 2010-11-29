var AVAILABLE=true;
var host=document.location.host;
var NEWS_PAGE=[host+"/news",host+"/",host]; //this changes to /x
var update_time=1400;
var sIMG_LOADER = chrome.extension.getURL("images/ajax-loader.gif");
var t;


function calc_text (html) {
	text_calc.innerHTML=html;
	var height = (text_calc.clientHeight) + "px";
	var width = (text_calc.clientWidth) + "px";
return {height:height,width:width};
}
var timers=[];
function PopupMessage(id) {
	 
}
PopupMessage.prototype.start=function(callback, time) {
	this.timer=window.setTimeout(callback,(time==null)?200:time);
};
PopupMessage.prototype.destroy=function() {
	if (this.timer!=null) {
		window.clearTimeout(this.timer);
		this.timer=null;
	}
//	alert(this.timer);
};
PopupMessage.prototype.timer=null;

var prev, username_hover, username_hover_out, BODY,obj1,text_calc;

BODY=document.getElementsByTagName("body")[0];




var port;

window.onload=startup;

function response_userinfo(data) {
   data.contents=data.contents.responseText;
	
   var info=['karma','about','avg','created'];
   var q,re,m,res='',i,results={};
   for (var k in info) {

    q=info[k]+":</td><td>([\\w\\s\\D]*?)</td>";

      re = new RegExp(q, "g");
      m = data.contents.match(re);

	if ( m != null) {
		for ( i = 0; i < m.length; i++ ) {
			//res += m[i];
			results[info[k]]=RegExp.$1;
		}
	}
   }
if (results.about!=null) {
	results.about=results.about.replace(/(http:[^\r\n\s<>]*)/g,"<a class=lnk_out target=_blank href='$1'>$1</a>");	
}

var msg="karma: "+ results.karma+" | avg: "+results.avg+" | created: "+results.created+"<hr size=1>"+
	"<div style='margin-bottom:4px'>about </div>"+ ((results.about!=undefined)?results.about:"");

var tooltip_txtcolor="black";
var tooltip_bgcolor="#FFFFCC";//#FFFFCC
var dim=calc_text(msg);

   obj1.innerHTML=""+
		"<div style='width:400px;position:relative'>"+
			"<div style='width:100%;-webkit-opacity:0.9;height:"+dim.height+";position:absolute;border: 1px solid #eeeebb; background-color: "+tooltip_bgcolor+"'></div>"+
			"<div style='font-size:12px;color:"+tooltip_txtcolor+";width:100%;position:absolute;z-index:2;padding:4px 4px;'>"+
				msg+
			"</div>"+
		  "</div>"+
		"";
   obj1.onmouseover=function(e) {	
		username_hover_out.destroy(); //the timer that hides obj1
	
	};	
   obj1.onmouseout=function(e) {
		username_hover_out.start(function(e) {
			obj1.style.display='none';						
		});
	};
   obj1.onclick=function(e) {
		obj1.style.display='none';
	};
}

function loadURL(href,callback,method) { 
	chrome.extension.sendRequest({user_info: href,method:method}, callback);
}
 

var loading_link;
function dynamic_link(t) {
	if (typeof(t)=='object') t=t.innerHTML;
	
if (typeof(t)=="string")
	if (t.indexOf("comment")!=-1 || t.indexOf("discuss")!=-1) 
		return true;
return false;
}
//String.prototype.dynamic_link=dynamic_link;

function alter_content() {
news_table=document.getElementsByTagName("table")[2].cloneNode(true)


t1=document.createElement("table");
tb1=document.createElement("tbody");
tr1=document.createElement("tr");

td1=document.createElement("td");
td1.appendChild(news_table);
td1.vAlign="top";
td1.id='news';
tr1.appendChild(td1);

tmp=document.createElement("td");
tmp.pixelWidth="10";
tmp.innerHTML="&nbsp;";
tr1.appendChild(tmp);

td2=document.createElement("td");
td2.vAlign="top";
td2.style.borderLeft="1px solid #dfdfdf";
td2.innerHTML="<div id='$content_newest' style='margin-left:6px;color:black'>"+"<img src='"+sIMG_LOADER+"'>"+"</div>";//";//<iframe id='$content_iframe' frameborder=0 style='display:none;width:100%;height:100%'></iframe>
tr1.appendChild(td2);

tb1.appendChild(tr1);
t1.appendChild(tb1);


document.getElementsByTagName("td")[4].innerHTML="";
t1.style.padding = "0px 0px";
t1.cellPadding = "0";
t1.cellSpacing = "0";

document.getElementsByTagName("td")[4].appendChild(t1);

_url="http://"+document.location.host+"/newest"; //alert(_url);
window.setTimeout(function() {loadURL(_url,response_newest);}, update_time);

var a=document.getElementsByTagName("a");
var callback_click;

for (var l in a) {
if (dynamic_link(a[l])) 
	a[l].onclick=function(e) { 
try {

		e.preventDefault();
	if (loading_link!=null) if (loading_link.innerHTML!=null) if (loading_link.innerHTML.indexOf("&")!=-1)
		loading_link.innerHTML=loading_link.innerHTML.substring(0,loading_link.innerHTML.indexOf("&"));				

		loading_link=this;
		loading_link.innerHTML+="&nbsp;<img src='"+sIMG_LOADER+"'>";

			
			callback_click=function(data) {
				//remove hourglass
				loading_link.innerHTML=loading_link.innerHTML.substring(0,loading_link.innerHTML.indexOf("&"));				
				var tmp=document.createElement("div");
				tmp.innerHTML=data.contents.responseText;
				var newest_content=document.getElementById('$content_newest');
				newest_content.innerHTML=tmp.getElementsByTagName("td")[4].innerHTML;
				resizeSlide();
				newest_content.innerHTML=newest_content.innerHTML.replace(/<input type=\"submit\"[^>]*>/g,"<input type=submit onclick=\"function enableForm(form,flag){flag=(flag==null)?false:true; for (var el in document.forms[0].elements){ document.forms[0].elements[el].disabled=flag;} } function send(){ try { enableForm(document.forms[0],false); } catch (ex) {alert('ex4::'+ex.message);} loadURL(document.forms[0].action+'?fnid='+document.forms[0].elements[0].value+'&text='+document.forms[0].elements[1].value,function() { if (document.forms[0].elements[1].value.length==0) enableForm(document.forms[0]);/*document.forms[0].elements[1].innerHTML='';*/},document.forms[0].method); return false;} return send();\" value=\"add comment\">");
				newest_content.innerHTML+="<div id='inj' onclick=\"req=new XMLHttpRequest(); loadURL=function (url,callback,method) {req.onreadystatechange = callback;req.open(((method==null)?'GET':method),url,true);req.send();} \">";	
				window.setTimeout(function() {var ev=document.createEvent("UIEvent");
				ev.initUIEvent('click',true,true);
				document.getElementById("inj").dispatchEvent(ev);},1000);
			

			};

		loadURL(this.href,callback_click);

} catch (e) {alert('1::'+e.message);}		
		return false;
	};
}//prepare content for latest news


} 

var vote_function="function vote2(node) {GLO='1';"+//"var node=this;"+
""+
"  var v = node.id.split(/_/);var item = v[1];"+
 
"  var score = byId('score_' + item);"+
"  if (score!=null) {var newscore = parseInt(score.innerHTML) + (v[0] == 'up' ? 1 : -1);"+
"  score.innerHTML = newscore + (newscore == 1 ? ' point' : ' points');}"+

"  score = byId('score_' + item+'_HN');"+
"  if (score!=null){newscore = parseInt(score.innerHTML) + (v[0] == 'up' ? 1 : -1);"+
"  score.innerHTML = newscore + (newscore == 1 ? ' point' : ' points');}"+
 
"  /* hide arrows*/ var arrow;"+
" arrow=byId('up_'   + item); if (arrow!=null) arrow.style.visibility = 'hidden';"+
"  arrow=byId('up_'   + item+'_HN'); if (arrow!=null) arrow.style.visibility = 'hidden';"+
 
"  arrow=byId('down_' + item); if (arrow!=null) arrow.style.visibility = 'hidden';"+
"  arrow=byId('down_' + item+'_HN');if (arrow!=null) arrow.style.visibility = 'hidden';"+
 

"  var ping = new Image();ping.src = node.href; return false;} return vote2(this); ";

function resizeSlide() {
	var news_col=document.getElementById('news');
	if (!isNaN(news_col.width)) {
		news_col.width="50%";
		window.setTimeout(function() {animate()},30);
	}
}
function animate() {
	w=parseInt(document.getElementById('news').width);

	if (w>37){	
		document.getElementById('news').width=String(parseInt(w-1))+"%";	
		window.setTimeout(function() {animate()},25);	
	}
}

function response_newest(data) {
data.contents=data.contents.responseText;
var content_newest =document.getElementById("$content_newest");

 q='<tr><td><table border=0 cellpadding=0 cellspacing=0><tr><td align=right valign=top class="title">(.*)More</a></td></tr></table></td></tr><tr><td>';

re=new RegExp(q,"g");
m = data.contents.match(re);
	if ( m != null) {
		for ( i = 0; i < m.length; i++ ) { 
			content_newest.innerHTML=m[i];//'<table border=0 cellpadding=0 cellspacing=0><tr><td align=right valign=top class="title">'+RegExp.$1+"</table>";
		}
	}
 
content_newest.innerHTML=content_newest.innerHTML.replace(/id=\"([^\s>]*)\"/g,"id=\"$1_HN\"");
content_newest.innerHTML=content_newest.innerHTML.replace(/return (vote\(this\))/g,vote_function);
 
}




function startup() {
	username_hover=new PopupMessage();
	username_hover_out=new PopupMessage();

	obj1=document.createElement("div");
		obj1.style.position="absolute";
		obj1.innerHTML="$user";
		obj1.style.display='none';
	BODY.appendChild(obj1);

	text_calc=document.createElement("div");
		text_calc.className="test";
		text_calc.style.pixelWidth="400";
		text_calc.style.position="absolute";
		text_calc.style.pixelLeft="-4000";
	BODY.appendChild(text_calc);

if (AVAILABLE)  {

  for (var j in NEWS_PAGE) {
    if (document.location.href=="http://"+NEWS_PAGE[j]) { 
	alter_content();
    }
  }

  BODY.onclick= function (e) {
	if (e.srcElement.tagName=="a") {
		e.cancelBubble();
		 
	}
  };



  BODY.onmouseover= function(e) { 
   if ((t=e.srcElement.href)!=null) if (t.indexOf("user?")!=-1) {

	var a=e;
	username_hover_out.destroy(); //remove the timer that hides the tooltip

	username_hover.start(function() {hover(a)}, 350);

	if (e.srcElement.onmouseout==null)
		e.srcElement.onmouseout=function(e) {	
			username_hover.destroy();
			prev=''; var o=e;	
			username_hover_out.start(function(e) {
				obj1.style.display='none';						
				//o.srcElement.onmouseout=null;
			},200);
		};
    }
  };
}


//loadurl script
var s=document.createElement("script"); s.innerHTML="req=new XMLHttpRequest(); loadURL=function (url,callback,method) {req.onreadystatechange = callback;req.open(((method==null)?'GET':method),url,true);req.send();}";
document.body.appendChild(s);

}  //-end-startup()

function hover(e) {
   var t;

     username_hover.destroy(); //the timer that showed hover
	
     if (prev!=e.srcElement.href) {
  	
	prev=e.srcElement.href;
	obj1.style.display='';

	obj1.style.pixelLeft=BODY.scrollLeft+e.clientX;
	obj1.style.pixelTop=BODY.scrollTop+e.clientY-30;
	loadURL(e.srcElement.href,response_userinfo); 

	obj1.innerHTML="<img src='"+sIMG_LOADER+"'>";

	
     } 
  
}