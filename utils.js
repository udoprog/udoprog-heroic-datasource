System.register([], function(exports_1) {
    function quoteString(s) {
        var quoted = false;
        var result = [];
        for (var i = 0, l = s.length; i < l; i++) {
            var c = s[i];
            if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')
                || (c >= '0' && c <= '9') || c === '/' || c === ':' || c === '-') {
                result.push(c);
                continue;
            }
            switch (c) {
                case "\b":
                    result.push("\\b");
                    break;
                case "\t":
                    result.push("\\t");
                    break;
                case "\n":
                    result.push("\\n");
                    break;
                case "\f":
                    result.push("\\f");
                    break;
                case "\r":
                    result.push("\\r");
                    break;
                case "'":
                    result.push("\\'");
                    break;
                case "\\":
                    result.push("\\\\");
                    break;
                case "\"":
                    result.push("\\\"");
                    break;
                default:
                    result.push(c);
                    break;
            }
            quoted = true;
        }
        if (quoted) {
            return "\"" + result.join("") + "\"";
        }
        return result.join("");
    }
    exports_1("quoteString", quoteString);
    return {
        setters:[],
        execute: function() {
        }
    }
});
//# sourceMappingURL=utils.js.map