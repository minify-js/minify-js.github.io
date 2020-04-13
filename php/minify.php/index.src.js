!function(r,t){var c,i=t.body,n=t.currentScript.src.split("/");n.pop(),c=n.join("/"),["parse"].forEach(function(r){var n=t.createElement("script");n.src=c+"/"+r+".js",i.appendChild(n)})}(0,this.document);

// Based on <https://github.com/mecha-cms/x.minify/blob/v2.5.1/minify/engine/plug/minify.php#L450&L568>
function minify_php(text, comment) {
    var out = "";
    // White-space(s) around these token(s) can be ignored
    var t = {
        T_AND_EQUAL: 1,                // &=
        T_ARRAY_CAST: 1,               // (array)
        T_BOOL_CAST: 1,                // (bool) and (boolean)
        T_BOOLEAN_AND: 1,              // &&
        T_BOOLEAN_OR: 1,               // ||
        T_COALESCE: 1,                 // ??
        T_CONCAT_EQUAL: 1,             // .=
        T_DEC: 1,                      // --
        T_DIV_EQUAL: 1,                // /=
        T_DOLLAR_OPEN_CURLY_BRACES: 1, // ${
        T_DOUBLE_ARROW: 1,             // =>
        T_DOUBLE_CAST: 1,              // (double) or (float) or (real)
        T_DOUBLE_COLON: 1,             // ::
        T_INC: 1,                      // ++
        T_INT_CAST: 1,                 // (int) or (integer)
        T_IS_EQUAL: 1,                 // ==
        T_IS_GREATER_OR_EQUAL: 1,      // >=
        T_IS_IDENTICAL: 1,             // ===
        T_IS_NOT_EQUAL: 1,             // != or <>
        T_IS_NOT_IDENTICAL: 1,         // !==
        T_IS_SMALLER_OR_EQUAL: 1,      // <=
        T_MINUS_EQUAL: 1,              // -=
        T_MOD_EQUAL: 1,                // %=
        T_MUL_EQUAL: 1,                // *=
        T_OBJECT_OPERATOR: 1,          // ->
        T_OR_EQUAL: 1,                 // |=
        T_PAAMAYIM_NEKUDOTAYIM: 1,     // ::
        T_PLUS_EQUAL: 1,               // +=
        T_POW: 1,                      // **
        T_POW_EQUAL: 1,                // **=
        T_SL: 1,                       // <<
        T_SL_EQUAL: 1,                 // <<=
        T_SPACESHIP: 1,                // <=>
        T_SR: 1,                       // >>
        T_SR_EQUAL: 1,                 // >>=
        T_STRING_CAST: 1,              // (string)
        T_XOR_EQUAL: 1                 // ^=
    };
    var toks = PhpParser.tokenGetAll(text), tok,
        c = toks.length,
        doc = false,
        skip = false,
        begin = null,
        end = null;
    for (var i = 0; i < c; ++i) {
        tok = toks[i];
        if (tok instanceof Array) {
            var id = tok[0],
                value = tok[1];
            if ('T_INLINE_HTML' === id) {
                out += value;
                skip = false;
            } else {
                if ('T_OPEN_TAG' === id) {
                    if (
                        -1 !== value.indexOf(' ') ||
                        -1 !== value.indexOf('\n') ||
                        -1 !== value.indexOf('\t') ||
                        -1 !== value.indexOf('\r')
                    ) {
                        value = value.trimEnd();
                    }
                    out += value + ' ';
                    begin = 'T_OPEN_TAG';
                    skip = true;
                } else if ('T_OPEN_TAG_WITH_ECHO' === id) {
                    out += value;
                    begin = 'T_OPEN_TAG_WITH_ECHO';
                    skip = true;
                } else if ('T_CLOSE_TAG' === id) {
                    if ('T_OPEN_TAG_WITH_ECHO' === begin) {
                        out = out.trimEnd('; ');
                    } else {
                        value = ' ' + value;
                    }
                    out += value;
                    begin = null;
                    skip = false;
                } else if (t[id]) {
                    out += value;
                    skip = true;
                } else if ('T_ENCAPSED_AND_WHITESPACE' === id || 'T_CONSTANT_ENCAPSED_STRING' === id) {
                    if ('"' === value[0]) {
                        value = value.replace(/\\[nrt]/g, '\\$&');
                    }
                    out += value;
                    skip = true;
                } else if ('T_WHITESPACE' === id) {
                    var n = toks[i + 1] || null;
                    if(!skip && ('string' !== typeof n || '$' === n) && !t[n[0]]) {
                        out += ' ';
                    }
                    skip = false;
                } else if ('T_START_HEREDOC' === id) {
                    out += '<<<S\n';
                    skip = false;
                    doc = true; // Enter HEREDOC
                } else if ('T_END_HEREDOC' === id) {
                    out += 'S;';
                    skip = true;
                    doc = false; // Exit HEREDOC
                    for (var j = i + 1; j < c; ++j) {
                        if ('string' === typeof toks[j] && ';' === toks[j]) {
                            i = j;
                            break;
                        } else if ('T_CLOSE_TAG' === toks[j][0]) {
                            break;
                        }
                    }
                } else if ('T_COMMENT' === id || 'T_DOC_COMMENT' === id) {
                    if (
                        1 === comment || (
                            2 === comment && (
                                // Detect special comment(s) from the third character
                                // It should be a `!` or `*` → `/*! keep */` or `/** keep */`
                                -1 !== '!*'.indexOf(value[2]) ||
                                // Detect license comment(s) from the content
                                // It should contains character(s) like `@license`
                                -1 !== value.search('@licence') || // noun
                                -1 !== value.search('@license') || // verb
                                -1 !== value.search('@preserve')
                            )
                        )
                    ) {
                        out += value;
                    }
                    skip = true;
                } else {
                    out += value;
                    skip = false;
                }
            }
            end = "";
        } else {
            if (-1 === ';:'.indexOf(tok) || end !== tok) {
                out += tok;
                end = tok;
            }
            skip = true;
        }
    }
    return out;
}
