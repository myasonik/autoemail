var buildEmail = function buildEmail() {
	'use strict';

	var docFrag = document.createDocumentFragment(),
		email = document.createElement('iframe'),
		$ = psData,
		goodRows = [];

	var spacerImg = function spacerImg($el) { return $el.attr('src') === 'spacer.gif'; };

	var onlySpacers = function onlySpacers($el) {
		var isOnlySpacers = true;

		$el.find('img').each(function(i, el) {
			if (spacerImg($(el))) {
				isOnlySpacers = false;
				return false;
			}
		});

		return isOnlySpacers;
	};

	// fs.writeFile(__dirname + '\\', jade stuff)

	// will get maxWidth and remove rows of only photoshop's junk spacer images
	// getting max width now because it's probably safer
	// if it's really slow, it probably doesn't need to check every row like this
	// checking just the first row is probably sufficient, but remembering to still exclude photoshop's junk spacer images
	$('tr').each(function(i, thisRow) {
		var $thisRow = $(thisRow),
			rowWidth = 0;

		if (!onlySpacers($thisRow)) {
			goodRows.push($thisRow);
			$thisRow.find('img').each(function(i, thisImg) {
				var $thisImg = $(thisImg);
				
				if (!spacer($thisImg)) rowWidth += $thisImg.attr('width');
			});
			maxWidth = Math.max(maxWidth, rowWidth);
		}
	});

	if (expectedWidth && expectedWidth !== maxWidth) alert('Expected email width did not match slices.');

	$(goodRows).each(function(i, thisRow) {
		var $thisRow = $(thisRow);

		$thisRow.children('td').each(function(i, thisCell) {
			var $thisCell = $(thisCell),
				$thisImg = $thisCell.children('img');

			if ($thisImg && !spacerImg($thisImg)) {

			}
		});
	});

	email.classList.add('email');
	email.src = __dirname + '\\email\\email.html';
	docFrag.appendChild(email);
	document.body.appendChild(docFrag);
};

module.exports = buildEmail;