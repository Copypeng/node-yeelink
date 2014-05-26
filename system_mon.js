var Yeelink = require('./yeelink');
var os = require('os');
var fs = require("fs");
var swicher = true;



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
	var cpuStat2 = getCPUInfo();
	var idle = cpuStat2.idle - cpuStat1.idle;
	var total = cpuStat2.total - cpuStat1.total;
	var percentage = (((total - idle) / total) * 100).toFixed(2);
	cpuStat1 = cpuStat2;
	return percentage;
}
var pdata = {}, yee = null;
fs.readFile("config.txt", function(err, data){
	if(err) throw err;
	var data = JSON.parse(data);
	pdata = data;
	yee = new Yeelink(data.key, Yeelink.P_KEY);
	uploadData();
	setInterval(function(){
		yee.getLastDataPoint(pdata.device_id, pdata.sensorIds[1], function(statusCode, body){
			var data = JSON.parse(body);
			
			if(!data.value == 1){
				var exec = require('child_process').exec;
				exec("halt");
			}
		});
		
	}, 10000);
});

function uploadData(){
	var percentage = getCPUUsage();
	var memoryUsage = ((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2);
	console.log(percentage);
	$("#cpu_percentage").html(percentage);
	$("#memory_usage").html(memoryUsage);
	var now = new Date();
	$('#cpu_update').html(now);
	$('#mem_update').html(now);
	
	yee.addDataPoint(pdata.device_id, pdata.sensorIds[0], percentage, function(){});
	yee.addDataPoint(pdata.device_id, pdata.sensorIds[2], memoryUsage, function(){});
	yee.addDataPoint(pdata.device_id, pdata.sensorIds[1], 1, function(){});
	
	setTimeout(function(){
		uploadData();
	}, 10000);
}



