/*
	forms should be named with a custom DOM ID, in case the DOM structure changes unexpectecly, so we make sure we send the right form.
*/

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

function loadURL(href,callback,method,params) { 
	chrome.extension.sendRequest({user_info: href,method:method,params:params}, callback);
}
 

var loading_link, reply_link;

var LINK={REPLY:2, DISCUSSION:3};
function link_type(t) {
	if (typeof(t)=='object') t=t.innerHTML;

	if (typeof(t)=="string") {
		 //to be found index
		//var l= ((l=t.indexOf(" ")!=-1))?l:0;
 
		if (t.indexOf("comment")!=-1 || t.indexOf("discuss")==0) return LINK.DISCUSSION;		
		else if (t.indexOf("reply")==0) return LINK.REPLY;
		 
	}
	return false;
}

var EVENTS={CLICK:"click"};

function getNewsTableFrom(container) { 
	return container.getElementsByTagName("table")[2].cloneNode(true);
}

function right_panel() {
//change more functionality to dynamic

//alert(BODY.innerHTML.match(new RegExp("<a href=\"([^\r\n\s<>]*)\" rel=\"nofollow\"[^>]*>More</a>")));


// append right column

news_table=getNewsTableFrom(document);

t1=document.createElement("table");
tb1=document.createElement("tbody");
tr1=document.createElement("tr");

td1=document.createElement("td");
td1.id='news';
td1.appendChild(news_table);
td1.vAlign="top";
//td1.width="80%";
tr1.appendChild(td1);

tmp=document.createElement("td");
tmp.width="1%";
tmp.innerHTML="&nbsp;";
tr1.appendChild(tmp);

td2=document.createElement("td");
td2.width='25%';td2.innerHTML='&nbsp';
td2.id='td2';
td2.vAlign="top";
td2.style.borderLeft="1px solid #dfdfdf";
td2.innerHTML="<div id='$content_newest' style='margin-left:6px;color:black'>"+"<img src='"+sIMG_LOADER+"'>"+"</div>";//";//<iframe id='$content_iframe' frameborder=0 style='display:none;width:100%;height:100%'></iframe>
tr1.appendChild(td2);

tb1.appendChild(tr1);
t1.appendChild(tb1);
/*
the problem is that threads are created by changing the width of a transparent image to a set width in pixels, therefore a table with a width% that results in less when calc-ed than the maximum trnsprent image width, the column cannot be minimized to 25%;
*/

document.getElementsByTagName("td")[4].innerHTML="";

t1.style.padding = "0px 0px";
t1.cellPadding = "0";
t1.cellSpacing = "0";

document.getElementsByTagName("td")[4].appendChild(t1);


var _to="/newest";
if ((_url=localStorage['current_page'])==null) {_url="http://"+document.location.host+_to;}; 


try {
	more_news.replace(); //if replacemetn made before t1 appended, make sure there isnt direct call to document.innerhtml because news_table wont exist already
} catch (Ex1) {alert('ex1::'+Ex1.message);}
finally{
window.setTimeout(function() {loadURL(_url,((localStorage['current_page']!=null)?callback_click:response_newest)); }, update_time);
}

} 
var reply_forms=0;

function callback_reply(data) {
	deleteHourglass(reply_link);
	neo=document.createElement("div");
	neo.innerHTML=data.contents.responseText;
	var frm=neo.getElementsByTagName("form");

	var ta=neo.getElementsByTagName("textarea");
	if (ta!=null) {ta[0].cols=null; ta[0].style.width="100%";}

	frm[0].id="reply_form"+(++reply_forms);
	
//replace the functionality of the submit button
	neo.innerHTML=neo.innerHTML.replace(/<input type=\"submit\"[^>]*>/g,"<input id='reply_text_"+reply_forms+"' type=submit value=\"reply\">");				
	neo.innerHTML=frm[0].outerHTML;

	reply_link.parentNode.insertBefore(neo,reply_link.nextSibling)		
	document.getElementById('reply_text_'+reply_forms).onclick=function() {
		function send(form){  
		if(form.elements[1].value.length>0) {
			enableForm(form,false); 
			sendForm(form,function(data) { 
				//callback_click(data,true); //insert the new contents and scroll
				
				if (form.elements[1].value.length==0) enableForm(form);

			}); 
		}
			return false;
		} 

	    	return send(frm[0]);

	};
}

var loaded;
var MANUAL_CLICK=true;
function callback_click(data,user_click) {
				if(loading_link!=null) {
						deleteHourglass(loading_link);
						loaded=loading_link;
					}

				var tmp=document.createElement("div");
				tmp.innerHTML=data.contents.responseText;
				var ta=tmp.getElementsByTagName("textarea");
				if (ta!=null) {ta[0].cols=null; ta[0].style.width="100%";}
				var newest_content=document.getElementById('$content_newest');
				newest_content.innerHTML=tmp.getElementsByTagName("td")[4].innerHTML;
			
				resizeSlide(65);
				newest_content.innerHTML=newest_content.innerHTML.replace(/<input type=\"submit\"[^>]*>/g,"<input id='comment_input' type=submit value=\"add comment\">");				
				document.getElementById('comment_input').onclick= function() {
//comment click	

function send(){ 
if (document.forms[0].elements[1].value.length>0) {
	enableForm(document.forms[0],false); 
	sendForm(document.forms[0],function(data) { 
		callback_click(data,true); //insert the new contents;
			if (document.forms[0].elements[1].value.length==0) enableForm(document.forms[0]);

		}); 
}
return false;
} 

return send();
};
			
				if (user_click) {
					//remove hourglass
					
					var s; t=500;//msec, in how much time to complete the visual
					var interval=30; //update interval of screen
			
					var steps=t/interval;//determines smoothness

					if ((s=parseInt(BODY.scrollTop))>0) {
						v=(s*1000)/t; //velocity per ms, to complete the distance in req. time

					s=(v/1000)*interval;
						
					animate(function () {
	
						if (parseInt(BODY.scrollTop)>0) {
							BODY.scrollTop-=s;	
							return true;
						}
					return false;
					});}
					
				} else {localStorage.removeItem('current_page');}
				
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

function resizeSlide(targetWidth) {
	var news_col=document.getElementById('td2');
	 
		animate(function() {w=parseInt(document.getElementById('td2').width);

				if (w<targetWidth) {//w>37){	
					document.getElementById('td2').width=String(parseInt(w+1))+"%";	
					return true;	
				}
				return false;
			}
		); 
}
function animate(callback) {
	var speed;
	if (callback()) window.setTimeout(function() {animate(callback)},30);
}

function response_newest(data) { 
	data.contents=data.contents.responseText;

	var content_newest =document.getElementById("$content_newest");

	resizeSlide(50);
	 //q='<tr><td><table border=0 cellpadding=0 cellspacing=0><tr><td align=right valign=top class="title">(.*)More</a></td></tr></table></td></tr><tr><td>';
q='<tr><td><table border=0 cellpadding=0 cellspacing=0><tr><td align=right valign=top class="title">([\\w\\s\\D]*?)More</a></td></tr></table></td></tr><tr><td>';

	re=new RegExp(q,"g");
	m = data.contents.match(re);
	if ( m != null) {
		for ( i = 0; i < m.length; i++ ) { 
			content_newest.innerHTML=m[i];//'<table border=0 cellpadding=0 cellspacing=0><tr><td align=right valign=top class="title">'+RegExp.$1+"</table>";
		}
	}

/*tmp_html
content_newest.innerHTML=data.contents;
content_newest.innerHTML=content_newest.innerHTML.getElementsByTagName("table")[2];
 */
	content_newest.innerHTML=content_newest.innerHTML.replace(/id=\"([^\s>]*)\"/g,"id=\"$1_HN\"");
	content_newest.innerHTML=content_newest.innerHTML.replace(/return (vote\(this\))/g,vote_function);
	more_newest.replace();
}

var _; //instance of the dom framework
function startup() {
	_=new DOM(BODY);

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
	right_panel();
	break;
    }
  }

  BODY.onclick= function (e) {    
	if (e.srcElement.tagName=="A") { //not the middle button which opens a new tab
	//	alert('link type: '+ link_type(e.srcElement));

		if (link_type(e.srcElement)==LINK.REPLY) {
			e.preventDefault();

			
			deleteHourglass(reply_link);
						
			reply_link=e.srcElement;
			createHourglass(reply_link);

			loadURL(e.srcElement.href,function(data) {callback_reply(data);});

						
			
			return false;
		} else	if (link_type(e.srcElement)!=LINK.DISCUSSION) {
			if (e.button==0 && e.srcElement.href!=null) if (e.srcElement.href.indexOf(host)==-1) { 
			
				if (loaded!=null) 
					localStorage['current_page']=loaded.href; 
				//top.location.href=e.srcElement.href;		 
			}
		} else {
			if (document.getElementById('td2')!=null) {
				e.preventDefault();
				deleteHourglass(loading_link);

				loading_link=e.srcElement;
				createHourglass(loading_link);

		
				loadURL(e.srcElement.href,function(data) {callback_click(data,true);});
				return false;
			}
			

		} 
			

		
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
var s=document.createElement("script"); s.innerHTML="req=new XMLHttpRequest(); loadURL=function (url,callback,method) {req.onreadystatechange = callback;req.open(((method==null)?'GET':method),url,true);req.send();} ";
document.body.appendChild(s);

var s2=document.createElement("script"); s2.innerHTML=String(sendForm);
document.body.appendChild(s2);

}  //-end-startup()

function enableForm(form,flag){flag=(flag==null)?false:true; for (var el in form.elements){ form.elements[el].disabled=flag;} }

function deleteHourglass(el) {
	if (el!=null) if (el.innerHTML!=null) if (el.innerHTML.indexOf("&")!=-1)
		el.innerHTML=el.innerHTML.substring(0,el.innerHTML.indexOf("&"));				

}
function createHourglass(el) {
	el.innerHTML+="&nbsp;<img src='"+sIMG_LOADER+"'>";
}
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

/* dynamic_more(): replace functionality of anchor "More" with the given callback function;
			
	container: where the anchor <More> lives, should not be BODY because events are replaced.
*/

function dynamic_more(container,dom_id) {
	//create this <input id='btn_more' href='$1' type=button value='More'>

}

var more_news=new MORE('news',"btn_news_more");
var more_newest=new MORE('$content_newest',"btn_newest_more");

function MORE(container, btn_dom_id) {
	this.container=container;
	this.dom_id=btn_dom_id;
}	

MORE.prototype.replace=function() {	
	var res=this.replaceFunction();//,btn1.outerHTML);//container.innerHTML=res.html;
	var aa=this;
	var btn1=createButton({id:this.dom_id,href:res.href,click: function(e) {
				e.srcElement.disabled=true;
				var dom_id=e.srcElement.id, a=aa;
				loadURL("http://"+host+this.href,function(data){a.display(data,dom_id);});		
			 	document.getElementById("container_"+a.dom_id).innerHTML+="<img id='loading_"+dom_id+"' src='"+sIMG_LOADER+"'>";
			}
	});
	document.getElementById("container_"+this.dom_id).appendChild(btn1);
}

/*
	called when loadURL completes loading More page
*/

MORE.prototype.display=function(data) { 
	data=data.contents.responseText;	
	var tmp=document.createElement("div");
	tmp.innerHTML=data;

	tmp=getNewsTableFrom(tmp); //get only the news table;

	removeElement("container_"+this.dom_id);//remove the previous container of the More button	
	
	document.getElementById(this.container).innerHTML+="<table bored=0 cellspacing=0 cellpadding=0>"+tmp.innerHTML+"</table>";

	this.replace();
};

MORE.prototype.container=null;
MORE.prototype.dom_id=null;

function removeElement(id) {
	var a=document.getElementById(id);
	if (a.parentElement!=null)
		a.parentElement.removeChild(a);
	else if (a.removeNode!=null)
		a.removeNode(true);
}
/* creates an HTML input element button
   params.id
*/
createButton=function (params) {
var btn1=document.createElement("input");
	btn1.id=params.id;
	btn1.value="More";
	btn1.type="button";
	btn1.href=params.href;
	btn1.onclick= params.click;	
return btn1;
};

MORE.prototype.replaceFunction=function() { //replaceWith) {
	var container=document.getElementById(this.container);
	
	var replaceWith="<div id='container_"+this.dom_id+"'></div>";//:replaceWith;

	var re=new RegExp("<a href=\"([^.<>]*)\" rel=\"nofollow\"[^>]*>More</a>");
	var m=container.innerHTML.match(re);

	container.innerHTML=container.innerHTML.replace(re,replaceWith);//"<input id='btn_more' href='$1' type=button value='More'>";);

	//MORE.href=RegExp.$1;//res.href;

	return {html: container.innerHTML, href:RegExp.$1,id:this.dom_id};

};

function DOM(dom) {
	this.base=(dom!=null)?dom:document.body;
}

DOM.prototype.get= function(id) {
	return this.base.getElementById(id);
};

function sendForm(form,callback) {
	var params="";

	for (var el in form.elements) {
		params+=form.elements[el].name+"="+encodeURIComponent(form.elements[el].value)+"&";
	}

	if (params!=null) params=params.substring(0,params.length-1);

	chrome.extension.sendRequest({user_info: form.action,method:form.method,params:params}, callback);
}

