var clean = function clean(psData) {
	var $ = require('cheerio').load(psData);
	
	var emailData = [];

	$('tr').each(function(i, thisRow) {
		var rowData = [];
		var $thisRow = $(thisRow);
		var $thisRowCells = $thisRow.children('td');

		$thisRowCells.each(function(i, thisCell) {
			var $thisCell = $(thisCell);
			var $thisImg = $thisCell.children('img');
			var thisImgHeight, thisImgWidth, img;

			if ($thisImg.length) {
				thisImgHeight = parseInt($thisImg.height);
				thisImgWidth = parseInt($thisImg.width);
		
				if ($thisImg.attr('src').indexOf('spacer.gif') !== -1
				&& thisImgHeight > 0
				&& thisImgWidth > 0) {
					img = {
						type: 'img',
						width: thisImgWidth,
						height: thisImgHeight,
						rowspan: ($thisCell.attr('rowspan')) ? parseInt($thisCell.attr('rowspan')) : 1,
						alt: $thisImg.attr('alt')
					}

					img.src = 'imgs/';
					if ($thisImg.attr('src').indexOf('replace') === -1) img.src += $thisImg.attr('src');
					else img.src += 'spacer.gif';

					rowData.push(img);
				}
			}
		});
		if (rowData.length) emailData.push(rowData);
	});

	return emailData;
};

var parsePSData = function parsePSData(psData) {
	'use strict';
	var lwip = require('lwip');
	var path = require('path');
	var fs = require('fs');

	var email = [];
	var rowspanImgs = [];

	psData = clean(psData);
	// psData is now a 2d array: an array of 'rows' of images
	// and image object is { 
		// type: 'img', 
		// width: `int`,
		// height: `int`, 
		// rowspan: `int`, 
		// alt: `str`, 
		// src: 'imgs/' + `str`
	// }

	psData.forEach(function(row, i) {
		var rowHeight = Math.min.apply(null, row);
		var emailRow = [];
		var leftPos = 0;
		var j = 0;
		var k = 0;

		if (rowspanImgs.length) {
			for (j; j < rowspanImgs.length; j++) {
				if (rowspan[j].left === leftPos) {
					leftPos += rowspan.img.width;
					// crop, make new rowspanImgs according to heights
					emailRow.push(rowspan.img);
				} else {
					leftPos += row[k].width;
					emailRow.push(row[k]);
					k++;
					j--;
				}
			}
			for (k; k < row.length; k++) {
				emailRow.push(row[k]);
			}
		} else {
			row.forEach(function(img, j) {
				if (img.rowspan) {
					lwip.open('./email/' + img.src, function(err, image) {
						var newHeight = image.height() - rowHeight;
						image.crop(0, 0, 0, newHeight, function(err, image) {
							// need to adjust name to stop collisions
							var path = path.resolve('./email/' + img.src);
							image.writeFile(path, null);
						});
						image.crop(0, newHeight, 0, 0, function(err, image) {
							// save to rowspanImgs	
						});
					});
					// crop and add remaining to rowspanImgs, plus left position
				} else {
					emailRow.push(img);
				}
			});
		}

		email.push(emailRow);
	});

	return email;
};

module.exports = parsePSData;