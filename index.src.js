!function(n,r){function t(n,r){function t(n){return decodeURIComponent(n)}function e(n){return void 0!==n}function i(n){return"string"==typeof n}function u(n){return i(n)&&""!==n.trim()?'""'===n||"[]"===n||"{}"===n||'"'===n[0]&&'"'===n.slice(-1)||"["===n[0]&&"]"===n.slice(-1)||"{"===n[0]&&"}"===n.slice(-1):!1}function o(n){if(i(n)){if("true"===n)return!0;if("false"===n)return!1;if("null"===n)return null;if("'"===n.slice(0,1)&&"'"===n.slice(-1))return n.slice(1,-1);if(/^-?(\d*\.)?\d+$/.test(n))return+n;if(u(n))try{return JSON.parse(n)}catch(r){}}return n}function f(n,r,t){for(var e,i=r.split("["),u=0,o=i.length;o-1>u;++u)e=i[u].replace(/\]$/,""),n=n[e]||(n[e]={});n[i[u].replace(/\]$/,"")]=t}var c={},l=n.replace(/^.*?\?/,"");return""===l?c:(l.split(/&(?:amp;)?/).forEach(function(n){var i=n.split("="),u=t(i[0]),l=e(i[1])?t(i[1]):!0;l=!e(r)||r?o(l):l,"]"===u.slice(-1)?f(c,u,l):c[u]=l}),c)}n[r]=t}(window,"q2o");

!function(n,r){function t(n,r,t,o){function u(n){return encodeURIComponent(n)}function i(n){return void 0!==n}function e(n){return null!==n&&"object"==typeof n}function f(n){return n===!0?"true":n===!1?"false":null===n?"null":e(n)?JSON.stringify(n):n+""}function c(n,r){r=r||{};for(var t in n)i(r[t])?e(n[t])&&e(r[t])&&(r[t]=c(n[t],r[t])):r[t]=n[t];return r}function l(n,r,t,o){t=t||0;var i,f,a,v=[],d=r?"%5D":"";for(i in n)f=u(i),a=n[i],e(a)&&o>t?v=c(v,l(a,r+f+d+"%5B",t+1,o)):v[r+f+d]=a;return v}t=t||1;var a,v,d=[],p=l(n,"",0,t);for(a in p)v=p[a],(v!==!1||o)&&(v=v!==!0?"="+u(f(v)):"",d.push(a+v));return d.length?"?"+d.join(r||"&"):""}n[r]=t}(window,"o2q");

(function(win, doc) {

    var name = doc.currentScript.src.split('#')[1],
        form = doc.forms[0],
        elements = form.elements,
        o = form.querySelector('details'),
        accepts = elements.files.value.split(/\s+/),
        state = {
            form: {}
        },
        sourceBack = elements.x,
        sourceDo = elements.v,
        sourceFrom = elements['source[from]'],
        sourcePicker = doc.createElement('input'),
        sourceTo = elements['source[to]'];

    function addEventTo(node, name, fn) {
        node.addEventListener(name, fn, false);
    }

    function hide(node) {
        node.style.display = 'none';
    }

    function reset(node) {
        node.removeAttribute('hidden');
        node.style.display = "";
    }

    function show(node) {
        node.style.display = 'block';
    }

    function doFormStateCreate() {
        var query = "", key, value;
        for (var i = 0, j = elements.length; i < j; ++i) {
            key = elements[i].name;
            value = elements[i].value;
            if (key) {
                if (-1 !== ['source[from]', 'source[to]'].indexOf(key)) {
                    continue; // Do not store text area value to session
                }
                if ('checkbox' === elements[i].type && !elements[i].checked) {
                    continue;
                }
                if ('radio' === elements[i].type) {
                    value = elements[key].value; // Take current value from `RadioNodeList`
                }
                query += '&' + encodeURIComponent(key) + (value ? '=' + encodeURIComponent(value) : "");
            }
        }
        state.form = query ? q2o('?' + query.slice(1)) : {};
    }

    function doSessionRestore() {
        var session = q2o(localStorage.getItem('session') || ""),
            names = o2q(session.form || {}, false, 5),
            namesData = {}, key;
        (names ? names.slice(1).split('&') : []).forEach(function(data) {
            data = data.split('=');
            namesData[decodeURIComponent(data[0])] = 'undefined' !== typeof data[1] ? decodeURIComponent(data[1]) : true;
        });
        for (key in namesData) {
            if (!elements[key]) {
                continue;
            }
            if ('checkbox' === elements[key].type) {
                elements[key].checked = !!namesData[key];
            } else if ('string' === typeof namesData[key]) {
                elements[key].value = namesData[key];
            }
        }
        // Unchecking check-boxes…
        for (var i = 0, j = elements.length; i < j; ++i) {
            if (!namesData[elements[i].name] && 'checkbox' === elements[i].type) {
                elements[i].checked = false;
            }
        }
        o.open = session.optionsIsOpen;
        elements.auto.checked = session.submitIsAuto;
    }

    function doSessionUpdate() {
        state.optionsIsOpen = o.open;
        state.submitIsAuto = elements.auto.checked;
        doFormStateCreate();
        localStorage.setItem('session', o2q(state));
    }

    function onBack() {
        hide(sourceTo), reset(sourceFrom);
        sourceFrom.focus();
        sourceFrom.select();
        hide(sourceBack), reset(o), reset(sourceDo);
    }

    function onDo() {
        var result = win[name](sourceFrom.value, state.form.state || {});
        hide(sourceFrom), show(sourceTo);
        sourceTo.value = result.value;
        sourceTo.focus();
        sourceTo.select();
        hide(sourceDo), hide(o), reset(sourceBack);
    }

    function onLocationHashChange(e) {
        '#/result' === win.location.hash ? (e ? onDo() : (win.location.hash = '#/home')) : onBack();
    }

    function onFormReset(e) {
        win.history.back();
        e.preventDefault();
    }

    function onFormSubmit(e) {
        doFormStateCreate();
        win.location.hash = '#/result';
        e.preventDefault();
    }

    // Double-click to open files… (should works on mobile)
    function onInputDoubleClick(e) {
        sourcePicker.click();
    }

    function onInputKeyDown(e) {
        var ctrlKey = e.ctrlKey,
            key = e.key,
            keyCode = e.keyCode;
        // Open files…
        if (
            ctrlKey && (
                key && 'o' === key ||
                keyCode && 79 === keyCode
            )
        ) {
            sourcePicker.click();
            e.preventDefault();
        }
        // Submit with “Ctrl + Enter”
        if (
            ctrlKey && (
                key && 'Enter' === key ||
                keyCode && 13 === keyCode
            )
        ) {
            sourceDo.click();
            e.preventDefault();
        }
    }

    function onInputPaste() {
        if (elements.auto.checked) {
            sourceDo.click();
        }
    }

    function onOutputCut() {
        sourceBack.click();
    }

    function onOutputKeyDown(e) {
        var ctrlKey = e.ctrlKey,
            key = e.key,
            keyCode = e.keyCode;
        if (
            (
                key && 'Backspace' === key ||
                keyCode && 8 === keyCode
            )
        ) {
            sourceBack.click();
            e.preventDefault();
        }
        if (
            ctrlKey && (
                key && 's' === key ||
                keyCode && 83 === keyCode
            )
        ) {
            alert('TODO: Save text area value as a file...');
        }
    }

    function onPickerChange() {
        var data = "",
            files = this.files, file, type, value;
        for (var i = 0, j = files.length; i < j; ++i) {
            file = files[i];
            if (-1 !== accepts.indexOf(type = file.type)) {
                var r = new FileReader, v;
                r.readAsText(file);
                r.onload = function() {
                    value = this.result;
                    v = sourceFrom.value.length;
                    sourceFrom.value += value + "\n\n";
                    sourceFrom.focus();
                    sourceFrom.selectionStart = v;
                    sourceFrom.selectionEnd = v + value.length;
                };
            } else if (type) {
                alert('MIME type `' + type + '` is not allowed.');
            }
        }
        setTimeout(function() {
            if (elements.auto.checked) {
                sourceDo.click();
            }
        }, 1000);
    }

    addEventTo(win, 'hashchange', onLocationHashChange);
    addEventTo(win, 'beforeunload', doSessionUpdate);

    addEventTo(form, 'reset', onFormReset);
    addEventTo(form, 'submit', onFormSubmit);

    addEventTo(sourceFrom, 'dblclick', onInputDoubleClick);
    addEventTo(sourceFrom, 'keydown', onInputKeyDown);
    addEventTo(sourceFrom, 'paste', onInputPaste);

    addEventTo(sourceTo, 'cut', onOutputCut);
    addEventTo(sourceTo, 'keydown', onOutputKeyDown);

    sourcePicker.type = 'file';
    sourcePicker.multiple = 'multiple';
    sourcePicker.style.cssText = 'display:block;position:fixed;top:-2px;left:-2px;width:1px;height:1px;margin:0;padding:0;border:0;opacity:0;';

    addEventTo(sourcePicker, 'change', onPickerChange);

    doc.body.appendChild(sourcePicker);

    onLocationHashChange(0);

    doSessionRestore();

    // Google Analytic
    if (-1 !== ['http:', 'https:'].indexOf(win.location.protocol) && '127.0.0.1' !== win.location.hostname) {
        addEventTo(win, 'load', function() {
            !function(e){function t(){e.dataLayer.push(arguments)}e.dataLayer=e.dataLayer||[],t("js",new Date),t("config","UA-132078233-1")}(win);
            var script = doc.createElement('script');
            // script.async = true;
            script.src = 'https://www.googletagmanager.com/gtag/js?id=UA-132078233-1';
            doc.body.appendChild(script);
        });
    }

})(this, this.document);
