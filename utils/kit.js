function parseQueryString(url)
{
    var obj = {};
    var keyvalue = [];
    var key = "",value = "";
    var paraString = url.split("&");
    for(var i in paraString) {
        keyvalue = paraString[i].split("=");
        key = keyvalue[0];
        value = keyvalue[1];
        value = decodeURIComponent(value);
        obj[key] = value;
    }
    return obj;
}

module.exports.parseQueryString = parseQueryString;