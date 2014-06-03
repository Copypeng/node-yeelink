var Yeelink = require('yeelink');
var os = require('os');
var fs = require("fs");
var cpuinfo = require("./cpuinfo");
var swicher = true;
var pdata = {}, yee = null;
fs.readFile("config.txt", function(err, data){
	if(err) throw err;
	var data = JSON.parse(data);
	pdata = data;
	yee = new Yeelink(data.key, Yeelink.P_KEY);
	uploadData();
	yee.addDataPoint(pdata.device_id, pdata.sensorIds[2], 1, function(){});
	setInterval(function(){
		yee.getLastDataPoint(pdata.device_id, pdata.sensorIds[2], function(statusCode, body){
			if(statusCode != 200){
				return;
			}
			var data = JSON.parse(body);
			if(!data.value == 1){
				var exec = require('child_process').exec;
				exec("shutdown -h now");
			}
		});
		
	}, 10000);
	
	
	$("header.page .btn").click(function(){
		var gui = require('nw.gui');
        gui.Shell.openExternal("http://developer.yeelink.net/en_US/client-device/details?client_id=" + pdata.device_id);
	});
	
});

function uploadData(){
	var percentage = cpuinfo.getUsage();
	var memoryUsage = ((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2);
	console.log(percentage);
	$("#cpu_percentage").html(percentage);
	$("#memory_usage").html(memoryUsage);
	var now = new Date();
	$('#cpu_update').html(now);
	$('#mem_update').html(now);
	
	yee.addDataPoint(pdata.device_id, pdata.sensorIds[0], percentage, function(){});
	yee.addDataPoint(pdata.device_id, pdata.sensorIds[1], memoryUsage, function(){});
	
	setTimeout(function(){
		uploadData();
	}, 10000);
}



