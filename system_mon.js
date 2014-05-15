var Yeelink = require('./yeelink');
var os = require('os');

function getCPUInfo(callback){ 
    var cpus = os.cpus();

    var user = 0;
    var nice = 0;
    var sys = 0;
    var idle = 0;
    var irq = 0;
    var total = 0;

    for(var cpu in cpus){

        user += cpus[cpu].times.user;
        nice += cpus[cpu].times.nice;
        sys += cpus[cpu].times.sys;
        irq += cpus[cpu].times.irq;
        idle += cpus[cpu].times.idle;
    }

    var total = user + nice + sys + idle + irq;

    return {
        'idle': idle, 
        'total': total
    };
}

var cpuStat1 = getCPUInfo();

function getCPUUsage(){

	var cpus = require('os').cpus()
	var total = 0;
	for(var i = 0, len = cpus.length; i < len; i++){
		var times = cpus[i].times;
		var percentage = 100 * (times.user + times.sys + times.irq) / (times.user + times.sys + times.irq + times.idle);
		
		total += percentage;
	}
	return (total /len).toFixed(2);
}


var yee = new Yeelink('4d0cd8e2e9cd21714b10696f80645d42');

var swicher = true;

function uploadData(){
	var cpuStat2 = getCPUInfo();
	
	var idle = cpuStat2.idle - cpuStat1.idle;
	var total = cpuStat2.total - cpuStat1.total;
	
	var percentage = (((total - idle) / total) * 100).toFixed(2);
	
	console.log(new Date);
	yee.http({
		path: '/v1.0/device/9007/sensor/16259/datapoints',
		method: 'post',
		data: JSON.stringify({
			value: percentage
		})
	}, function(statusCode, body){
		if(statusCode !== 200){
			console.log(body);
		}
	});
	
	yee.http({
		path: '/v1.0/device/9007/sensor/16279/datapoints',
		method: 'post',
		data: JSON.stringify({
			value: ((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2)
		})
	}, function(statusCode, body){
		if(statusCode !== 200){
			console.log(body);
		}
	});
	cpuStat1 = cpuStat2;
	//swicher && setTimeout(uploadData, 10000);
}

//uploadData();


setInterval(function(){
	yee.http({
		path: '/v1.0/device/9007/sensor/16262/datapoint'
	}, function(statusCode, body){
		var data = JSON.parse(body);
		
		if(data.value == 1){
			swicher = true;
		}else{
			swicher = false;
		}
	});
	
	swicher && uploadData();
}, 10000);

/*
var os = require("os"),
    cpus = os.cpus();

for(var i = 0, len = cpus.length; i < len; i++) {
    console.log("CPU %s:", i);
    var cpu = cpus[i], total = 0;
    for(type in cpu.times)
        total += cpu.times[type];

    for(type in cpu.times)
        console.log("\t", type, Math.round(100 * cpu.times[type] / total));
}


setInterval(function(){
	console.log(getCPUUsage());
}, 200);
*/