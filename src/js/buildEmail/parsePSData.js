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
		
				if (($thisImg.attr('src').indexOf('spacer.gif') !== -1) && thisImgHeight > 0 && thisImgWidth > 0) {
					img = {
						type: 'img',
						width: thisImgWidth,
						height: thisImgHeight,
						rowspan: ($thisCell.attr('rowspan')) ? parseInt($thisCell.attr('rowspan')) : 1,
						alt: $thisImg.attr('alt')
					};

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

	var email = [];
	var rowspans = {
		currRow: [],
		nextRow: [],
		leftPos: 0
	};

	psData = clean(psData);
	// psData is now a 2d array: an array of 'rows' of images
	// image = { 
		// type: 'img', 
		// width: `int`,
		// height: `int`, 
		// rowspan: `int`, 
		// alt: `str`, 
		// src: 'imgs/' + `str`
	// }

	var queRowspanImg = function queRowspanImg(img) {
		var que = rowspans.nextRow;
		var i = 0;
		var len = que.length;
		var testImg;

		if (len) {
			for (i; i < len; i++) {
				testImg = que[i];
				if ((img.leftPos > testImg.leftPos && img.leftPos < que[i+1].leftPos) || (i === 0 && img.leftPos < testImg.leftPos)) {
					// if leftPos is greater than leftPos of testImg but less than leftPos of next testImg
					// or if leftPos is less than leftPos of first testImg
					que.splice(i, 0, img);
					break; // exit after inserted element
				} else {
					// at end of que
					que.push(img);
				}
			}
		} else que.push(img);
	};

	var doRowspanImg = function doRowspanImg(img, emailRow) {
		var leftover = img;
		var src = path.join('./email/', img.src);
		var rowHeight = Math.min.apply(null, emailRow);
		var height = image.height() - rowHeight;

		var increment = function increment(name) {
			var counter = name.match(/[0-9]{3}-/g);

			if (counter) {
				counter = parseInt(counter[0].match(/[1-9]\d*/g)) + 1;
				counter = ('000' + counter).slice(-3).concat('-');
				name = name.replace(/[0-9]{3}-/g, counter);
			} else name = path.join(path.dirname(name), '001-'.concat(path.basename(name)));

			return name;
		};

		leftover.rowspan--;
		img.rowspan = 1;
		leftover.src = increment(img.src);

		lwip.open(src, function(err, image) {
			if (err) throw new Error(err);

			image.crop(0, 0, 0, height, function(err, image) {
				if (err) throw new Error(err);
			
				image.writeFile(src, function(err) {
					if (err) throw new Error(err);
				});
			});
			
			image.crop(0, height, 0, 0, function(err, image) {
				if (err) throw new Error(err);

				image.writeFile(path.join('./email/', leftover.src), function(err) {
					if (err) throw new Error(err);
				});
			});
		});

		emailRow.push(img);
		queRowspanImg(leftover);
	};

	var step = function step(img, emailRow) {
		if (img.rowspan > 1) {
			img.leftPos = rowspans.leftPos;
			doRowspanImg(img, emailRow);
		} else emailRow.push(img);

		rowspans.leftPos += img.width;
	};

	psData.forEach(function(row, i) {
		var emailRow = [];
		var j = 0;
		var k = 0;
		var len = rowspans.currRow.length;
		var currImg;

		rowspans.currRow = rowspans.nextRow;
		rowspans.nextRow = [];
		rowspanImgs.leftPos = 0;

		if (len) {
			for (j; j < len; j++) {
				currImg = rowspans.currRow[j];
				if (currImg.leftPos === rowspans.leftPos) {
					if (currImg.rowspan === 1) emailRow.push(currImg);
					else doRowspanImg(currImg, emailRow);
					rowspans.leftPos += currImg.width;
				} else {
					step(row[k], emailRow);
					k++;
					j--;
				}
			}
			for (k, len = row.length; k < len; k++) {
				step(row[k], emailRow);
			}
		} else {
			row.forEach(function(img, j) {
				step(img, emailRow);
			});
		}

		email.push(emailRow);
	});

	return email;
};

module.exports = parsePSData;