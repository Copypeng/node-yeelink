var Yeelink = require('./yeelink');

var yee = new Yeelink('4d0cd8e2e9cd21714b10696f80645d42');

var fs = require('fs');
var path = 'E:\\photosensor\\';

function readAndUpload(){
	fs.readdir(path, function(err, files){
		
		if(files.length > 0){
			var filepath = path + files[0];
			data = fs.readFileSync(filepath);
			yee.addPhoto(8401, 14095, data, function(status, body){
				if(status == 200){
					fs.unlinkSync(filepath);
					setTimeout(function(){
						readAndUpload();
					}, 10000);
				}
			});
		}
	});

}

readAndUpload();