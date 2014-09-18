var buildEmail = function buildEmail(sliceData, psData, expectedWidth) {
	'use strict';
	var jade = require('jade');
	var path = require('path');

	var parsePSData = require('./js/buildEmail/parsePSData.js');
	var addSliceData = require('./js/buildEmail/addSliceData.js');
	var getEmailWidth = require('./js/buildEmail/getEmailWidth.js');
	var getEmailWidth = require('./js/buildEmail/getEmailHeight.js');
	var getEmailWidth = require('./js/buildEmail/getPlainText.js');

	var email = {};
	var emailTable = parsePSData(psData);

	var jadeLocals = {
		pretty: true,
		rows: addSliceData(emailTable, sliceData);
	};

	email.width = getEmailWidth(emailTable);

	if (expectedWidth && expectedWidth !== email.width) {
		throw new Error('Expected email width did not match computed width');
	} else {
		jadeLocals.width = email.width;
	}

	email.contents = jade.renderFile(path.resolve('app/emailTemplates/index.jade'), jadeLocals);
	email.height = getEmailHeight(email.contents);
	email.text = getPlainText(email.contents);

	return email;
};

module.exports = buildEmail;