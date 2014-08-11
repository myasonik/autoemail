var fs = require('fs'),
	path = require('path'),
	cheerio = require('cheerio'),
	buildEmail = require('buildEmail.js'),
	getASF = document.querySelector('#getASF'),
	getPSDData = document.querySelector('#getPSDData'),
	makeEmail = document.querySelector('#makeEmail'),
	expectedWidth = document.querySelector('#getEmailWidth').value,
	maxWidth = 0,
	sliceData, psData, psImgs = [];

var getFileExtension = function getFileExtension(filename) { return filename.split('.').pop(); };

getASF.addEventListener('change', function() {
	'use strict';
	var excel, extension, sheets, asf;

	excel = this.value;
	extension = getFileExtension(excel);

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

	var path = this.files[0].path;

	fs.readdir(this.value, function(err, files) {
		files.forEach(function(el, i) {
			var extension; 
			
			if (getFileExtension(el) === 'html') psData = cheerio.load(fs.readFileSync(path + '\\' + el, 'utf8'));
			else {
				extension = getFileExtension(el);
				if (extension === 'jpg' || extension === 'gif') psImgs.push(path + '\\' + el);
				else  alert('File ' + el + ' not supported');
			}
		});
	});
});

makeEmail.addEventListener('click', function() {
	if (sliceData && psData && psImgs.length > 0) {
		buildEmail();
		// buildPlainText();
	} else alert('Please add an ASF and exported PS data');
});