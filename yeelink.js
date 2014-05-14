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
        o[key] = child[key];
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
     * @param callback statusCode body
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
			res.on('data', function(chunk){
				callback(res.statusCode, chunk);
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

var yee = new Yeelink('4d0cd8e2e9cd21714b10696f80645d42');
yee.http({
	path: '/v1.0/device/2714/sensor/3751/datapoints'
}, function(statusCode, body){
	console.log(statusCode);
	console.log(body);
});