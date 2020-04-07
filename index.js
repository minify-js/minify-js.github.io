(function(win, doc) {

    var form = document.forms[0],
        accepts = form.dataset.files.split(/\s+/),
        state = {},
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

    function onBack() {
        hide(sourceTo), reset(sourceFrom);
        sourceFrom.focus();
        sourceFrom.select();
        hide(sourceBack), reset(sourceDo);
    }

    function onDo() {
        var result = win.minify(sourceFrom.value, state);
        hide(sourceFrom), show(sourceTo);
        sourceTo.value = result.error ? result.error.message : result.code;
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
                r._file = file;
                r.readAsText(file);
                r.onload = function() {
                    sourceFrom.value += '// ' + this._file.name + "\n" + this.result + "\n\n";
                    sourceFrom.focus();
                    sourceFrom.select();
                };
            } else if (type) {
                alert('MIME type `' + type + '` is not allowed.');
            }
        }
    }

    win.addEventListener('hashchange', onLocationHashChange, false);

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

})(this, this.document);
