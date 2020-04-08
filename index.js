!function(n,r){function t(n,r){function t(n){return decodeURIComponent(n)}function e(n){return void 0!==n}function i(n){return"string"==typeof n}function u(n){return i(n)&&""!==n.trim()?'""'===n||"[]"===n||"{}"===n||'"'===n[0]&&'"'===n.slice(-1)||"["===n[0]&&"]"===n.slice(-1)||"{"===n[0]&&"}"===n.slice(-1):!1}function o(n){if(i(n)){if("true"===n)return!0;if("false"===n)return!1;if("null"===n)return null;if("'"===n.slice(0,1)&&"'"===n.slice(-1))return n.slice(1,-1);if(/^-?(\d*\.)?\d+$/.test(n))return+n;if(u(n))try{return JSON.parse(n)}catch(r){}}return n}function f(n,r,t){for(var e,i=r.split("["),u=0,o=i.length;o-1>u;++u)e=i[u].replace(/\]$/,""),n=n[e]||(n[e]={});n[i[u].replace(/\]$/,"")]=t}var c={},l=n.replace(/^.*?\?/,"");return""===l?c:(l.split(/&(?:amp;)?/).forEach(function(n){var i=n.split("="),u=t(i[0]),l=e(i[1])?t(i[1]):!0;l=!e(r)||r?o(l):l,"]"===u.slice(-1)?f(c,u,l):c[u]=l}),c)}n[r]=t}(window,"q2o");

!function(n,r){function t(n,r,t,o){function u(n){return encodeURIComponent(n)}function i(n){return void 0!==n}function e(n){return null!==n&&"object"==typeof n}function f(n){return n===!0?"true":n===!1?"false":null===n?"null":e(n)?JSON.stringify(n):n+""}function c(n,r){r=r||{};for(var t in n)i(r[t])?e(n[t])&&e(r[t])&&(r[t]=c(n[t],r[t])):r[t]=n[t];return r}function l(n,r,t,o){t=t||0;var i,f,a,v=[],d=r?"%5D":"";for(i in n)f=u(i),a=n[i],e(a)&&o>t?v=c(v,l(a,r+f+d+"%5B",t+1,o)):v[r+f+d]=a;return v}t=t||1;var a,v,d=[],p=l(n,"",0,t);for(a in p)v=p[a],(v!==!1||o)&&(v=v!==!0?"="+u(f(v)):"",d.push(a+v));return d.length?"?"+d.join(r||"&"):""}n[r]=t}(window,"o2q");

(function(win, doc, name) {

    var form = doc.forms[0],
        o = form.querySelector('details'),
        accepts = form.dataset.files.split(/\s+/),
        state = {
            form: {}
        },
        sourceBack = form.x,
        sourceDo = form.v,
        sourceFrom = form['source[from]'],
        sourcePicker = doc.createElement('input'),
        sourceTo = form['source[to]'];

    function hide(node) {
        node.style.display = 'none';
    }

    function reset(node) {
        node.style.display = "";
    }

    function show(node) {
        node.style.display = 'block';
    }

    function doFormStateCreate() {
        var elements = form.elements,
            query = "", key, value;
        for (var i = 0, j = elements.length; i < j; ++i) {
            key = elements[i].name;
            value = elements[i].value;
            if (key) {
                if ('checkbox' === elements[i].type && !elements[i].checked) {
                    continue;
                }
                query += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(value);
            }
        }
        state.form = q2o(query);
        if (state.form.state && state.form.state.output && state.form.state.output.comments) {
            // Convert to `RegExp`
            state.form.state.output.comments = new RegExp(state.form.state.output.comments);
        }
    }

    function doSessionRestore() {
        var session = q2o(localStorage.getItem('session') || ""),
            elements = form.elements, element;
        o.open = session.optionsIsOpen;
        // TODO: Automaticize conversion of `session.form.a.b.c.d` to `session.form['a[b][c][d]']`
        form.elements['state[output][comments]'].checked = session.form.state.output.comments;
    }

    function doSessionUpdate() {
        state.optionsIsOpen = o.open;
        state.form && state.form.state && state.form.state.source && state.form.state.source.from && (delete state.form.state.source.from);
        state.form && state.form.state && state.form.state.source && state.form.state.source.to && (delete state.form.state.source.to);
        localStorage.setItem('session', o2q(state));
    }

    function onBack() {
        hide(sourceTo), reset(sourceFrom);
        sourceFrom.focus();
        sourceFrom.select();
        hide(sourceBack), reset(sourceDo);
    }

    function onDo() {
        var result = win[name](sourceFrom.value, state.form.state || {});
        hide(sourceFrom), show(sourceTo);
        sourceTo.value = result.value;
        sourceTo.focus();
        sourceTo.select();
        hide(sourceDo), show(sourceBack);
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
    }

    function onPickerChange() {
        var data = "",
            files = this.files, file, type;
        sourceFrom.value = "";
        for (var i = 0, j = files.length; i < j; ++i) {
            file = files[i];
            if (-1 !== accepts.indexOf(type = file.type)) {
                var r = new FileReader;
                r.readAsText(file);
                r.onload = function() {
                    sourceFrom.value += this.result + "\n\n";
                    sourceFrom.focus();
                    sourceFrom.select();
                };
            } else if (type) {
                alert('MIME type `' + type + '` is not allowed.');
            }
        }
    }

    win.addEventListener('hashchange', onLocationHashChange, false);
    win.addEventListener('beforeunload', doSessionUpdate, false);

    form.addEventListener('reset', onFormReset, false);
    form.addEventListener('submit', onFormSubmit, false);

    sourceFrom.addEventListener('dblclick', onInputDoubleClick, false);
    sourceFrom.addEventListener('keydown', onInputKeyDown, false);
    sourceTo.addEventListener('keydown', onOutputKeyDown, false);

    sourcePicker.type = 'file';
    sourcePicker.multiple = 'multiple';
    sourcePicker.style.cssText = 'display:block;position:fixed;top:-2px;left:-2px;width:1px;height:1px;margin:0;padding:0;border:0;opacity:0;';
    sourcePicker.addEventListener('change', onPickerChange, false);

    doc.body.appendChild(sourcePicker);

    onLocationHashChange(0);

    doSessionRestore();

})(this, this.document, 'minify');
