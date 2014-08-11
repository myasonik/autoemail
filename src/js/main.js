var fs = require('fs'),
	path = require('path'),
	buildEmail = require('./js/buildEmail.js'),
	getASF = document.querySelector('#getASF'),
	getPSDData = document.querySelector('#getPSDData'),
	makeEmail = document.querySelector('#makeEmail'),
	expectedWidth = document.querySelector('#getEmailWidth').value,
	maxWidth = 0,
	sliceData, psData, psImgs = [];

getASF.addEventListener('change', function() {
	'use strict';
	var excel, extension, sheets, asf;

	excel = this.value;
	extension = path.extname(excel);

	if (extension === 'xls') excel = require('xlsjs').readFile(excel);
	else if (extension === 'xlsx') excel = require('xlsx').readFile(excel);
	else {
		alert('An excel file with slice data goes here.');
		getASF.value = '';
	}

	sheets = excel.Sheets;
	asf = sheets.ASF;
	sliceData = asf ? asf : excel.Sheets[0];
});

getPSDData.addEventListener('change', function() {
	'use strict';

	var dirname = this.files[0].path;

	fs.readdir(this.value, function(err, files) {
		files.forEach(function(el, i) {
			var extension; 
			
			if (path.extname(el) === 'html') psData = fs.readFileSync(path.join(dirname, el), 'utf8');
			else {
				extension = path.extname(el);
				if (extension === 'jpg' || extension === 'gif') psImgs.push(path.join(dirname, el));
				else  alert('File ' + el + ' not supported');
			}
		});
	});
});

makeEmail.addEventListener('click', function() {
	if (sliceData && psData && psImgs.length > 0) buildEmail(sliceData, psData, psImgs);
	else alert('Please add an ASF and exported PS data');
});