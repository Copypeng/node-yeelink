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

var Yeelink = function(accessKey, keyType){
	this.accessKey = accessKey;
	this.keyType = keyType === undefined ? 'U-ApiKey' : keyType
	this._initYeelink();
};

Yeelink.U_KEY = 'U-ApiKey';
Yeelink.P_KEY = 'P-ApiKey';

Yeelink.prototype = {
	_initYeelink: function(){
		
	},
    /**
     * common http
     * @param options {hostname, path, method, headers, encoding, data}
     * @param callback [statusCode, body, response]
     */
	http: function(options, callback){
		var self = this;
		var defalutOptions = {
            hostname: 'api.yeelink.net',
            path: '/v1.0/',
            method: 'get',
            headers: (function(){var headers = {};headers[self.keyType] = self.accessKey;return headers;})(),
            encoding: 'utf8',
            data: ''
        };
        var mixedOptions = mix(defalutOptions, options);
        if(mixedOptions.method.toLowerCase() == 'post' mixedOptions.method.toLowerCase() == 'put'){
            mixedOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            mixedOptions.headers['Content-Length'] = Buffer.byteLength(mixedOptions.data);
        }
		var req = http.request({
			hostname: mixedOptions.hostname,
			path: mixedOptions.path,
			method: mixedOptions.method,
			headers: mixedOptions.headers
		}, function(res){
			res.setEncoding(mixedOptions.encoding);
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
		if(mixedOptions.data !== ''){
            req.write(mixedOptions.data);
        }

		req.end();
	},
	/**
	 * 根据设备ID获取信息
	 */
	deviceInfo: function(deviceId, callback){
		this.http({
			path: '/v1.0/device/' + deviceId
		}, callback);
	},
	
	sensorList: function(deviceId, callback){
		this.http({
			path: '/v1.0/device/' + deviceId + '/sensors'
		}, callback);
	},
	
	addDataPoint: function(deviceId, sensorId, value, callback){
		this.http({
			path: '/v1.0/device/' + deviceId + '/sensor/' + sensorId + '/datapoints',
			method: 'post',
			data: JSON.stringify({
				value: value
			})
		}, callback);
	},
	getLastDataPoint: function(deviceId, sensorId, callback){
		this.http({
			path: '/v1.0/device/' + deviceId + '/sensor/' + sensorId + '/datapoint'
		}, callback);
	},
	/**
	 * 绑定一个设备
	 */
	bindProduct: function(productSN, userLogin, callback){
		this.http({
			path: '/v1.0/product/bind/' + productSN,
			method: 'post',
			data: JSON.stringify({
				user_login: userLogin
			})
		}, callback);
	},
	/**
	 * 获取产品设备信息
	 */
	productDeviceInfo: function(productSN, callback){
		this.http({
			path: '/v1.0/product/' + productSN
		}, callback);
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
var yee = new Yeelink('4d0cd8e2e9cd21714b10696f80645d42');
yee.http({
    
}, function(status, body){
   console.log(status);
   console.log(body);
});
yee.addDataPoint(9007, 16259, 40, function(stat, body){
    console.log(stat);
    console.log(body);
});

*/