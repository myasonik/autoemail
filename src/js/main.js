var fs = require('fs'),
	path = require('path'),
	rimraf = require('rimraf'),
	buildEmail = require('./js/buildEmail.js'),
	getASF = document.querySelector('#getASF'),
	getPSDData = document.querySelector('#getPSDData'),
	makeEmail = document.querySelector('#makeEmail'),
	maxWidth = 0,
	sliceData, psData, psImgs = [];

getASF.addEventListener('change', function() {
	'use strict';
	var excel, extension, sheets, asf;

	excel = this.value;
	extension = path.extname(excel);

	if (extension === '.xls') excel = require('xlsjs').readFile(excel);
	else if (extension === '.xlsx') excel = require('xlsx').readFile(excel);
	else {
		alert('An excel file with slice data goes here.');
		getASF.value = '';
	}

	sheets = excel.Sheets;
	asf = sheets.ASF;
	if (asf) sliceData = asf;
	else {
		asf = sheets['Bed Bath & Beyond'];
		if (asf) sliceData = asf;
		else sliceData = sheets[0];
	}
});

getPSDData.addEventListener('change', function() {
	'use strict';

	var dirname = this.files[0].path;

	fs.readdir(this.value, function(err, files) {
		files.forEach(function(el, i) {
			var imgPath, extension;
			
			if (path.extname(el) === '.html') psData = fs.readFileSync(path.join(dirname, el), 'utf8');
			else {
				extension = path.extname(el);
				if (extension === '.jpg' || extension === '.gif') psImgs.push(path.join(dirname, el));
				else  alert('File ' + el + ' not supported');
			}
		});
	});


});

makeEmail.addEventListener('click', function() {
	'use strict';
	
	var body, email, iFrame, existingIFrame;

	// if (sliceData && psData && psImgs.length > 0) {
	if (true) {
		body = document.body;
		existingIFrame = body.querySelector('iframe');

		rimraf.sync('email');
		if (existingIFrame) body.removeChild(document.querySelector('iframe'));

		// email = { contents: html page, width: int, height: int}
		email = buildEmail(sliceData, psData, document.querySelector('#getEmailWidth').value);
		fs.mkdirSync('email');
		fs.mkdirSync(path.join('email', 'imgs'));
		psImgs.forEach(function(el, i) {
			var file = path.basename(el);
			if (file.indexOf('replace') === -1 || file.indexOf('spacer') === -1) {
				fs.writeFileSync(path.join('email', 'imgs', file), fs.readFileSync(el));
			}
		});
		fs.writeFileSync(path.normalize('email/index.html'), email.contents);
		iFrame = document.createElement('iframe');
		iFrame.nwdisable = true;
		iFrame.src = path.join('../email', 'index.html');
		iFrame.width = email.width + 50;
		iFrame.height = email.height + 50;
		body.appendChild(iFrame);
	}
	else alert('Please add an ASF and exported PS data');
});