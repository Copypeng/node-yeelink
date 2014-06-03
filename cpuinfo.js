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
	var cpuStat2 = getCPUInfo();
	var idle = cpuStat2.idle - cpuStat1.idle;
	var total = cpuStat2.total - cpuStat1.total;
	var percentage = (((total - idle) / total) * 100).toFixed(2);
	cpuStat1 = cpuStat2;
	return percentage;
}

exports.getUsage = getCPUUsage;