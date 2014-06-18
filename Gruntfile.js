module.exports = function(grunt) {
	'use strict';

	var imgJSON = {
		"imgsList": {
			"rows": []
		}
	};

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		copy: {
			defualt: {
				files: [{
					expand: true,
					flatten: true,
					src: ['data/*.{png,jpg,gif}', '!data/replace*.gif'],
					dest: 'output/imgs/',
					rename: function(dest, src) {
						return dest + src.substring(src.indexOf('/')+1).replace(/\s/g, ''); // remove spaces in file name
					}
				}]
			},
			BBB: {
				files: [{
					expand: true,
					flatten: true,
					src: ['commonImgs/BBB/*.{png,jpg,gif}', 'data/*.{png,jpg,gif}', '!data/replace*.gif', '!data/spacer.gif'],
					dest: 'output/imgs/',
					rename: function(dest, src) {
						return dest + src.substring(src.indexOf('/')+1).replace(/\s/g, ''); // remove spaces in file name
					}
				}]
			}
		},

		dom_munger: {
			defualtBuild: {
				options: {
					callback: function($) {
						function clean(str) {
							return str.replace(/^("|(&quot;))/gm, '') // remove start quote
									.replace(/("|(&quot;))$/gm, '') // remove end quote
									.replace(/[\u2018\u2019]/gm, "'") // replace all single smart quotes with dumb ones
									.replace(/[\u201C\u201D]/gm, '"') // replace all double smart quotes with dumb ones
									.replace(/\u00AE/gm, '(R)') // replace (R) symbol with (R)
									.replace(/\u00A9/gm, '(c)') // replace (c) symbol with (c)
									.replace(/\u2122/gm, '(TM)'); // replace (TM) symbol with (TM)
						} 

						(function makeIndexFile() {
							var imgJSON = {
								"imgsList": {
									"rows": []
								}
							};

							function imgIsSpacer(img) {
								if (img.attr('src') === 'spacer.gif') {
									return true;
								} else {
									return false;
								}
							}

							function everyEementInRowIsSpacerImg(tr) {
								var bool = true;
								tr.children('td').each(function() {
									if($(this).find('img') !== []) {
										if (!imgIsSpacer($(this))) {
											bool = false;
											return;
										}
									} else {
										return;
									}
								});
								tr.find('img').each(function() {
									if (!imgIsSpacer($(this))) {
										bool = false;
										return;
									}
								});
								return bool;
							} // end everyEementInRowIsSpacerImg(tr)

							$('tr').each(function() {
								var row = [];
								if (!everyEementInRowIsSpacerImg($(this))) {
									$(this).children('td').each(function() {
										if($(this).find('img').length !== 0) { // it's an image
											var img = $(this).find('img');
											if (!imgIsSpacer(img)) {
												var imgObj = {};
												imgObj.width = img.attr('width');
												imgObj.height = img.attr('height');

												imgObj.src = 'imgs/' + img.attr('src').replace(/\s/g, '');
												if (img.attr('src').indexOf('replace') > -1) { // a img being replaced with a spacer
													imgObj.src = 'imgs/spacer.gif';
												}

												if (img.parent('td').attr('bgcolor')) { // cell has a background color
													imgObj.bgcolor = img.parent('td').attr('bgcolor');
												}

												if (img.parent('a')) { // the img has a link
													imgObj.link = img.parent().attr('href');
												}

												if (img.attr('id').indexOf('background') > -1) { // it's meant to be a background img
													imgObj.type = 'background';
													imgObj.text = clean(img.attr('alt'));
												} else {
													imgObj.type = 'img';
													imgObj.alt = clean(img.attr('alt'));
												}

												row.push(imgObj);
											}
										} else { // it's a p tag
											var text = $(this).find('img');
											var textObj = {};
											textObj.type = 'text';
											textObj.width = $(this).attr('width');
											textObj.height = $(this).attr('height');
											textObj.text = clean($(this).text());
											
											if ($(this).attr('bgcolor')) { // cell has a background color
												textObj.bgcolor = $(this).attr('bgcolor');
											}

											row.push(textObj);
										}
									}); // end for each 'td'
								}
								if (row.length > 0) imgJSON.imgsList.rows.push(row);
							}); // end for each 'tr'
							grunt.file.write('build/slices.json', JSON.stringify(imgJSON, null, '	'));
						})(); // end makeIndexFile
					} // end callback
				}, // end options
				src: 'data/photoshop.html'
			},
			defualtText: {
				options: {
					callback: function($) {
						function clean(str) {
							return str.replace(/^("|(&quot;))/gm, '') // remove start quote
									.replace(/("|(&quot;))$/gm, '') // remove end quote
									.replace(/[\u2018\u2019]/gm, "'") // replace all single smart quotes with dumb ones
									.replace(/[\u201C\u201D]/gm, '"') // replace all double smart quotes with dumb ones
									.replace(/\u00AE/gm, '(R)') // replace (R) symbol with (R)
									.replace(/\u00A9/gm, '(c)') // replace (c) symbol with (c)
									.replace(/\u2122/gm, '(TM)'); // replace (TM) symbol with (TM)
						}

						(function makeTextFile() {
							var textFile = '';
							$('td').each(function() {
								$(this).find('img').each(function() {
									if ($(this).attr('alt') !== '') {
										textFile += clean($(this).attr('alt')) + '\n';
										if ($(this).parent().attr('href') !== undefined) {
											textFile += $(this).parent('a').attr('href') + '\n\n';
										} else {
											textFile += '\n';
										}
									}
								});
							}); // end for each 'td'
							grunt.file.write('output/plain.txt', textFile.trim());
						})(); // end makeTextFile
					}
				}, // end options
				src: 'data/photoshop.html'
			},
			BBB: {
				options: {
					callback: function($, file) {
						function clean(str) {
							return str.replace(/^("|(&quot;))/gm, '') // remove start quote
									.replace(/("|(&quot;))$/gm, '') // remove end quote
									.replace(/[\u2018\u2019]/gm, "'") // replace all single smart quotes with dumb ones
									.replace(/[\u201C\u201D]/gm, '"') // replace all double smart quotes with dumb ones
									.replace(/\u00AE/gm, '(R)') // replace (R) symbol with (R)
									.replace(/\u00A9/gm, '(c)') // replace (c) symbol with (c)
									.replace(/\u2122/gm, '(TM)') // replace (TM) symbol with (TM)
									.replace(/\s{2,}/gm, ' ') // replace all space characters and with 1 space
									.trim();
						}

						function imgIsSpacer(img) {
							return (img.attr('src') === 'spacer.gif');
						}

						function everyEementInRowIsSpacerImg(tr) {
							var bool = true;
							tr.find('img').each(function() {
								if (!imgIsSpacer($(this))) {
									bool = false;
									return;
								}
							});
							return bool;
						}

						function islink(str) {
							return !(/\s*?(no|NO)\s+(LINK|link)\s*?/.test(str));
						}

						function createImgObj(img) {
							var imgId = img.attr('id'),
								imgSrc = img.attr('src'),
								imgObj = {
									id: imgId,
									width: img.attr('width'),
									height: img.attr('height'),
									src: 'imgs/' + imgSrc.replace(/\s/g, ''),
									type: 'img'
								};

							if (imgSrc.indexOf('replace') > -1) { // img being replaced with a spacer
								imgObj.src = 'imgs/spacer.gif';
							}

							if (img.parent('td').attr('bgcolor')) { // cell has a background color
								imgObj.bgcolor = img.parent('td').attr('bgcolor');
							}

							if (imgId.indexOf('background') > -1) { // it's meant to be a background img														
								imgObj.type = 'background';
							}

							return imgObj;
						}

						(function buildJSON() {
							if (file.indexOf('1') > -1) { // process photoshop file
								$('tr').each(function() { // for each row
									var row = [];
									if (!everyEementInRowIsSpacerImg($(this))) { // ignore the row if it's all spacer imgs
										$(this).children('td').each(function() { // go through every cell
											var img = $(this).find('img')[0];
											if(img !== undefined) { // there's an img in the cell
												if (!imgIsSpacer($(img))) { // ignore it if it's a spacer
													row.push(createImgObj($(img)));
												}
											} else { // there's live text in the cell
												var textObj = {
													type: 'text',
													width: $(this).attr('width'),
													height: (this).attr('height'),
													text: clean($(this).text())
												};
												if ($(this).attr('bgcolor')) { // the cell has a background color
													textObj.bgcolor = $(this).attr('bgcolor');
												}
												row.push(textObj);
											}
										}); // end for each 'td'
									}
									if (row.length > 0) imgJSON.imgsList.rows.push(row);
								}); // end for each 'tr'
							} else { // process excel file
								imgJSON.imgsList.rows.forEach(function(row) { // for every photoshop row
									row.forEach(function(obj) { // for every obj in that row
										if (obj.type !== 'text') {
											$('tr').each(function() { // for every row in the excel sheet
												var tds = $(this).children(); // cache its children
												var objId = obj.id.replace(/_/g, '-'); // the replace is there because photoshop replaces slashes with underscores and that's dumb.
												var isAlt = objId.indexOf('--alt');
												if (isAlt > -1) {
													objId = objId.slice(0, isAlt);
												}
												if (objId === $(tds[0]).text().trim().toLowerCase()) { // if the id matches the name
													if (obj.type === 'background') {
														obj.text = clean($(tds[1]).text());
													} else if (obj.type === 'img' && isAlt === -1) { // if it's a normal image and if it's not a secondary one
														obj.alt = clean($(tds[1]).text());
													}
													if (islink($(tds[2]).text())) {
														obj.link = $(tds[2]).text();
													}
												}
											});
										}
									});
								});
								grunt.file.write('build/slices.json', JSON.stringify(imgJSON, null, '	'));
							}
						})(); // end buildJSON()
						(function buildText() {
							var textFile = '', banner = '', disclaimer = 'All products are available online and may be available in select Bed Bath & Beyond(R) stores. Products may be ordered in any of our stores; shipping fees apply. Prices only apply in contiguous United States.';
							for (var i = 59; i >= 0; i--) banner += '=';
							textFile += banner + '\n\n' + 'Bed Bath & Beyond(R)' + '\n\n' + banner +  '\n';
							imgJSON.imgsList.rows.forEach(function(row) { // for every row in my master list
								row.forEach(function(obj) { // for every obj in that row
									if (obj.alt) {
										if (obj.alt === 'Like Us on Facebook' || obj.alt === disclaimer) {
											textFile += '\n' + banner;
										}
										textFile += '\n' + obj.alt + '\n';
										if (obj.alt === 'CONNECT WITH US' || obj.alt === disclaimer) {
											textFile += banner + '\n';
										}
									} else  if (obj.text) {
										textFile += '\n' + obj.text + '\n';
									}
									if (obj.link && obj.id.indexOf('__alt') === -1) { // if it has a link and if that link isn't on a supporting object. It's underscores because photoshop is dumb and replaces dashes with underscores
										textFile += obj.link + '\n';
									}
								});
							});
							grunt.file.write('output/plain.txt', textFile.trim());
						})(); // end build text
					} // end callback
				}, // end options
				src: 'data/*.htm*'
			}
		},

		jade: {
			defualt: {
				options: { 
					data: function() { return require('./build/slices.json'); }
				},
				files: [{
					expand: true,
					cwd: 'jade/',
					src: ['*.jade'],
					dest: 'build',
					ext: '.html'
				}]
			}
		},

		inlinecss: {
			defualt: {
				options: {
					removeStyleTags: false
				},
				files: {
					'build/index.inline.html': 'build/index.html' 
				}
			}
		},

		processhtml: { // to fix the bug with inlinecss where juice deletes the doctype
			defualt: {
				options: {
					data : {
						doctype: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">'
					}
				},
				files: {
					'build/index.fixed.html': 'build/index.inline.html'
				}
			}
		},

		prettify: {
			defualt: {
				files: {
					'output/index.html': 'build/index.fixed.html'
				}
			} 
		}
	});
	
	require('load-grunt-tasks')(grunt); // register all tasks

	// grunt.registerTask('default', ['copy:defualt', 'dom_munger:defualtBuild', 'dom_munger:defualtText', 'jade', 'inlinecss', 'processhtml', 'prettify']);
	grunt.registerTask('default', 'BBB');
	grunt.registerTask('BBB', ['copy:BBB', 'dom_munger:BBB', 'jade', 'inlinecss', 'processhtml', 'prettify']);
	grunt.registerTask('bbb', 'BBB');
};