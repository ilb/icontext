var parseString = require('xml2js').parseString;
var xml = "<root>Hello xml2js!</root>"
var res=null;
parseString(xml, function (err, result) {
    res=result;
    console.dir(result);
});

console.log('ttt', res);
