var buildEmail = function buildEmail(sliceData, psData, psImgs, expectedWidth) {
	'use strict';

	var cheerio = require('cheerio'),
		jade = require('jade'),
		path = require('path'),
		$ = cheerio.load(psData),
		goodRows = [],
		maxWidth = 0,
		jadeLocals = {};

	var spacerImg = function spacerImg($el) { return $el.attr('src') === 'spacer.gif'; };

	var onlySpacers = function onlySpacers($el) {
		var isOnlySpacers = true;

		$el.find('img').each(function(i, el) {
			if (!spacerImg($(el))) {
				isOnlySpacers = false;
				return false;
			}
		});

		return isOnlySpacers;
	};

	/**
	 * will get maxWidth and remove rows of only photoshop's junk spacer images
	 * getting max width now because it's probably safer
	 * if it's really slow, it probably doesn't need to check every row like this
	 * checking just the first row is probably sufficient, but remembering to still 
	 * exclude photoshop's junk spacer images
	 */
	$('tr').each(function(i, thisRow) {
		var $thisRow = $(thisRow),
			rowWidth = 0;

		if (!onlySpacers($thisRow)) {
			goodRows.push($thisRow);
			$thisRow.find('img').each(function(i, thisImg) {
				var $thisImg = $(thisImg);
				
				if (!spacerImg($thisImg)) rowWidth += $thisImg.attr('width');
			});
			maxWidth = Math.max(maxWidth, rowWidth);
		}
	});

	if (expectedWidth && expectedWidth !== maxWidth) alert('Expected email width did not match slices.');

	// $(goodRows).each(function(i, thisRow) {
	// 	var $thisRow = $(thisRow);

	// 	$thisRow.children('td').each(function(i, thisCell) {
	// 		var $thisCell = $(thisCell),
	// 			$thisImg = $thisCell.children('img');

	// 		if ($thisImg && !spacerImg($thisImg)) {

	// 		}
	// 	});
	// });

	jadeLocals.width = maxWidth;


	// WHY THIS THIS BROKEN?
	// try go to absolue path (__dirname, emailtemplates, index.jade)
	// return path.resolve('app/emailTemplates/index.jade');
	return jade.renderFile(path.resolve('app/emailTemplates/index.jade'), jadeLocals);
};

module.exports = buildEmail;