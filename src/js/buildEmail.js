var buildEmail = function buildEmail(sliceData, psData, expectedWidth) {
	'use strict';

	var cheerio = require('cheerio'),
		jade = require('jade'),
		path = require('path'),
		$ = cheerio.load(psData),
		jadeLocals = {
			pretty: true,
			width: 0,
			rows: []
		};
	var email = {
		height: 0
	};

	var spacerImg = function spacerImg($el) {
		return $el.attr('src').indexOf('spacer.gif') !== -1;
	};

	// Sets jadeLocals.width, email.height and return data without spacer garbage
	var cleanRows = (function() {
		var rows = [];

		$('tr').each(function(i, thisRow) {
			var $thisRow = $(thisRow);
			var row = [];
			var rowWidth = 0;
			var rowHeight = 0;

			$thisRow.children('td').each(function(i, thisCell) {
				var $thisCell = $(thisCell);
				var $thisImg = $thisCell.children('img');

				if ($thisImg.length === 1 && !spacerImg($thisImg)) {
					row.push($thisCell);
					if (rowHeight === 0 && !$thisRow.attr('rowspan')) {
						rowHeight = parseInt($thisImg.attr('height'));
					}
					rowWidth += parseInt($thisImg.attr('width'));
				}
			});

			jadeLocals.width = Math.max(jadeLocals.width, rowWidth);
			email.height += rowHeight;
			if (row.length > 0) rows.push(row);
		});

		return rows;
	}());

	if (expectedWidth && expectedWidth !== jadeLocals.width) alert('Expected email width did not match slices.');

	cleanRows.forEach(function(thisRow, i) {
		var emailRow = [];

		thisRow.forEach(function($thisCell, i) {
			var $thisCellImg = $thisCell.children('img');
			var emailCell = {};
			var imgSrc;

			if ($thisCellImg && !spacerImg($thisCellImg)) {
				if ($thisCellImg.attr('src').indexOf('replace') === -1) {
					imgSrc = 'imgs/' + $thisCellImg.attr('src');
				} else {
					imgSrc = 'imgs/spacer.gif';
				}
				emailCell.type = 'img';
				emailCell.src = imgSrc;
				emailCell.width = parseInt($thisCellImg.attr('width'));
				emailCell.height = parseInt($thisCellImg.attr('height'));

				// this will be roughly the max number of rows that I care about
				// (Object.keys(sliceData).length / 3) 

				emailRow.push(emailCell);
			}
		});

		jadeLocals.rows.push(emailRow);
	});

	email.contents = jade.renderFile(path.resolve('app/emailTemplates/index.jade'), jadeLocals);
	email.width = jadeLocals.width;

	return email;
};

module.exports = buildEmail;