var getASF = document.querySelector('#getASF'),
	getPSDData = document.querySelector('#getPSDData'),
	sliceData;

var getFileExtension = function getFileExtension(filename) {
	return filename.split('.').pop();
};

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
	console.log(this.value);
	console.log(this.files);
});