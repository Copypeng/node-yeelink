var http = require("http");
var isPlainObject = function(obj){
	if(!obj.hasOwnProperty('constructor') && typeof obj == 'object' && obj.constructor == Object){
		return true;
	}
	
	return false;
}
var mix = function(base, child, deep){
    var o = new Object();
    for(var key in base){
        o[key] = base[key];
    }
    for(var key in child){
		if(deep && isPlainObject(o[key])){
			o[key] = mix(o[key], child[key]);
		}else{
			o[key] = child[key];
		}
    }
    return o;
};

var Yeelink = function(accessKey){
	this.accessKey = accessKey;
	
	this._initYeelink();
};

Yeelink.prototype = {
	_initYeelink: function(){
		
	},
    /**
     * common http
     * @param options {hostname, path, method, headers, encoding, data}
     * @param callback [statusCode, body, response]
     */
	http: function(options, callback){

        var options = mix({
            hostname: 'api.yeelink.net',
            path: '/v1.0/',
            method: 'get',
            headers: {'U-ApiKey': this.accessKey},
            encoding: 'utf8',
            data: ''
        }, options);

		var req = http.request({
			hostname: options.hostname,
			path: options.path,
			method: options.method,
			headers: options.headers
		}, function(res){
			res.setEncoding(options.encoding);
			var body = '';
			res.on('data', function(chunk){
				body += chunk;
			});
			res.on('end', function(){
				callback(res.statusCode, body, res);
			});
		});
		
		req.on('error', function(e){
			console.log('problem');
		});
		if(options.data !== ''){
            req.write(options.data);
        }

		req.end();
	}
}
module.exports = Yeelink;

/*
var options = mix({
	hostname: 'api.yeelink.net',
	path: '/v1.0/',
	method: 'get',
	headers: {'U-ApiKey': this.accessKey},
	encoding: 'utf8',
	data: ''
}, {
	headers: {'P-ApiKey': 'adfasdfsadf'}
}, true);

console.log(options);
*/
