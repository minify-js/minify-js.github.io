!function(e,t){window.q2o=function(e,t){function n(e){return decodeURIComponent(e)}function o(e){return void 0!==e}function i(e){return"string"==typeof e}function c(e){if(i(e)){if("true"===e)return!0;if("false"===e)return!1;if("null"===e)return null;if("'"===e.slice(0,1)&&"'"===e.slice(-1))return e.slice(1,-1);if(/^-?(\d*\.)?\d+$/.test(e))return+e;if(function(e){return!(!i(e)||""===e.trim())&&('""'===e||"[]"===e||"{}"===e||'"'===e[0]&&'"'===e.slice(-1)||"["===e[0]&&"]"===e.slice(-1)||"{"===e[0]&&"}"===e.slice(-1))}(e))try{return JSON.parse(e)}catch(e){}}return e}var r={},l=e.replace(/^.*?\?/,"");return""===l?r:(l.split(/&(?:amp;)?/).forEach(function(e){var i=e.split("="),l=n(i[0]),u=!o(i[1])||n(i[1]);u=!o(t)||t?c(u):u,"]"===l.slice(-1)?function(e,t,n){for(var o,i=t.split("["),c=0,r=i.length;r-1>c;++c)e=e[o=i[c].replace(/\]$/,"")]||(e[o]={});e[i[c].replace(/\]$/,"")]=n}(r,l,u):r[l]=u}),r)}}(),function(e,t){window.o2q=function(e,t,n,o){function i(e){return encodeURIComponent(e)}function c(e){return void 0!==e}function r(e){return null!==e&&"object"==typeof e}function l(e){return!0===e?"true":!1===e?"false":null===e?"null":r(e)?JSON.stringify(e):e+""}function u(e,t){for(var n in t=t||{},e)c(t[n])?r(e[n])&&r(t[n])&&(t[n]=u(e[n],t[n])):t[n]=e[n];return t}var a,s,f=[],p=function e(t,n,o,c){o=o||0;var l,a,s,f=[],p=n?"%5D":"";for(l in t)a=i(l),r(s=t[l])&&c>o?f=u(f,e(s,n+a+p+"%5B",o+1,c)):f[n+a+p]=s;return f}(e,"",0,n=n||1);for(a in p)(!1!==(s=p[a])||o)&&(s=!0!==s?"="+i(l(s)):"",f.push(a+s));return f.length?"?"+f.join(t||"&"):""}}(),function(e,t){var n=t.body,o=t.currentScript.src.split("#")[1],i=t.forms[0],c=i.elements,r=i.querySelector("details"),l=c.files.value.split(/\s+/),u={form:{}},a=c.x,s=c.v,f=c["source[from]"],p=t.createElement("input"),d=c["source[to]"],h=localStorage.getItem("session");function v(e,t,n){e.addEventListener(t,n,!1)}function m(e){e.style.display="none"}function y(e){e.removeAttribute("hidden"),e.style.display=""}function k(){for(var e,t,n="",o=0,i=c.length;o<i;++o)if(e=c[o].name,t=c[o].value,e){if(-1!==["source[from]","source[to]"].indexOf(e))continue;if("checkbox"===c[o].type&&!c[o].checked)continue;"radio"===c[o].type&&(t=c[e].value),n+="&"+encodeURIComponent(e)+(t?"="+encodeURIComponent(t):"")}u.form=n?q2o("?"+n.slice(1)):{}}function g(t){var n;"#/result"===e.location.hash?t?(n=e[o](f.value,u.form.state||{}),m(f),d.style.display="block",d.value=n.value,d.focus(),d.select(),m(s),m(r),y(a)):e.location.hash="#/home":(m(d),y(f),f.focus(),f.select(),m(a),y(r),y(s))}v(e,"hashchange",g),v(e,"beforeunload",function(){u.optionsIsOpen=r.open,u.submitIsAuto=c.auto.checked,k(),localStorage.setItem("session",o2q(u))}),v(i,"reset",function(t){e.history.back(),t.preventDefault()}),v(i,"submit",function(t){k(),e.location.hash="#/result",t.preventDefault()}),v(f,"dblclick",function(e){p.click()}),v(f,"keydown",function(e){var t=e.ctrlKey,n=e.key,o=e.keyCode;t&&(n&&"o"===n||o&&79===o)&&(p.click(),e.preventDefault()),t&&(n&&"Enter"===n||o&&13===o)&&(s.click(),e.preventDefault())}),v(f,"paste",function(){c.auto.checked&&s.click()}),v(d,"cut",function(){a.click()}),v(d,"keydown",function(e){var t=e.ctrlKey,n=e.key,o=e.keyCode;(n&&"Backspace"===n||o&&8===o)&&(a.click(),e.preventDefault()),t&&(n&&"s"===n||o&&83===o)&&alert("TODO: Save text area value as a file...")}),p.type="file",p.multiple="multiple",p.style.cssText="display:block;position:fixed;top:-2px;left:-2px;width:1px;height:1px;margin:0;padding:0;border:0;opacity:0;",v(p,"change",function(){for(var e,t,n,o=this.files,i=0,r=o.length;i<r;++i)if(e=o[i],-1!==l.indexOf(t=e.type)){var u,a=new FileReader;a.readAsText(e),a.onload=function(){n=this.result,u=f.value.length,f.value+=n+"\n\n",f.focus(),f.selectionStart=u,f.selectionEnd=u+n.length+2}}else t&&alert("MIME type `"+t+"` is not allowed.");setTimeout(function(){c.auto.checked&&s.click()},300)}),n.appendChild(p),g(0),function(){if(null!==h){var e,t=q2o(h||""),n=o2q(t.form||{},!1,5),o={};for(e in(n?n.slice(1).split("&"):[]).forEach(function(e){e=e.split("="),o[decodeURIComponent(e[0])]=void 0===e[1]||decodeURIComponent(e[1])}),o)c[e]&&("checkbox"===c[e].type?c[e].checked=!!o[e]:"string"==typeof o[e]&&(c[e].value=o[e]));for(var i=0,l=c.length;i<l;++i)o[c[i].name]||"checkbox"!==c[i].type||(c[i].checked=!1);r.open=t.optionsIsOpen,c.auto.checked=t.submitIsAuto}}(),-1!==["http:","https:"].indexOf(e.location.protocol)&&"127.0.0.1"!==e.location.hostname&&v(e,"load",function(){function o(){e.dataLayer.push(arguments)}e.dataLayer=e.dataLayer||[],o("js",new Date),o("config","UA-163395040-1");var i=t.createElement("script");i.src="https://www.googletagmanager.com/gtag/js?id=UA-163395040-1",n.appendChild(i)})}(this,this.document);
