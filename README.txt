#AutoEmail

CHANGELONG:
* No longer have to space out the two text elements at the top of BBB emails

* The only command now is 'grunt'
* For lack of a better place to do this (and time crunch): if you're doing a not 600x BBB email, then you need to temporarily move the commonImgs folder out of the project (or rename it). I haven't had time to fix this... You'll then need to copy the spacer image over by hand.

How to use:
1. Download the folder

2. Open your excel file of links and alt tags
    * The first row will be your slice names
        * Make sure that there are no spaces in the names of the slices you're intending on using
    * Save as web page
        * File > Save as Web Page
        * Save only the sheet
        * Click web options, then encoding (you only have to do this step once)
            * Change the encoding to UTF-8
            * And check the box to do this always
        * Name this page 2excel.htm
            * .htm is the default extension, if this someday changes to .html, it doesn't matter

2. Slice the photoshop file as (mostly) usual
    * It reads your slices in rows, so don't test it's limits with a lot of weird layouts. Just think rows.
        * But because it does do rows perfectly, go nuts with spacer images if you like
    * If you need a spacer image, just slice out the space and title that slice "replace"
        * It will be autoreplaced with a spacer GIF to the correct dimensions
        * Spacer images can have a background color
        * They can also have a link, but why would you do that?
    * If you need a background color on a table cell (defualt is transparent), add that to the slice data as well
        * It's at the bottom of the prompt that comes up when you double-click a slice 
    * If a cell needs a background image with live text on top of it (fancy, ain't it?!)
        * Slice it with the text hidden, put the text in as the alt data on the image and title the slice "background"
        * Also, pick a background color for this cell as well, it will become the fallback color for the picture
            * (The implementation is pretty good but a small handful of browser/email clients revert to the fallback)
    * If a slice is all live text, select "No Image" for the slice type and insert your text.
        * Unfortunately, you will have to add style info yourself, but the cell for it will be the correct dimensions in the correct spot.
            * Remember though, don't cut it too tight for differences in fonts in your family and font-rendering
                * I've found leaving an extra 5px of width is enough for single line content, multi-line content needs a little guess and checking if you cut close
    * You no longer need to slice out the header for BBB emails!
    * Name your slices as they are named in the excel file
        * If you need to slice up a single image into multiple slices, call the most important/largest/most prominent one the exact name on the excel file and append a '--alt' to all the others
            * This will add the link to every image piece but won't duplicate the alt text in the page or the plain text file

3. When you save:
    * Your format should be "HTML and Images"
    * Your settings should be "Custom"
        * Hit "other" to edit
        * Your HTML settings should be:
            * [Checked] Output XHTML
            * Nothing else on this screen matters
        * Your Slice settings should be:
            * [Checked] Generate Table
            * Empty Cells: GIF, IMG, W&H
            * TD W&H: Auto
            * Spacer Cells: Auto (Bottom)
            * Nothing else matters
        * Backround settings: don't matter
        * Saving Files settings: None of this matters either
            * But don't put all of your images in a subfolder
    * Now save everything into a "data" folder in the root folder of this project
        * Rename the generated html file 1photoshop.html
        * Put 2excel.htm in this data folder as well

4. Open index.jade and change the title to something sensible or just leave it blank
    * I've also left the stuff you need to make a BBB email in there because those are the most common
        * If you're not making a BBB email comment out (//- before a line, there's an example on the page) lines 2 and 9 ("include mixins/bbb.jade" and "+addBBBheader-600('')") 
        * If you're making a BBB email
            * As the comment on the page says, the parameter for the add header function is the campain monitoring suffix, don't include the question mark
            * Under and indented in function call, there is a pipe symbol. After it goes the plain text that is in the upper left hand corner of most emails. If there is nothing there, just don't fill out this line. If you did put something there, make sure there is a space at the end because directly following will be your shop now link.
            * Under that at the same indentation level is a function call that puts in a link. This is usually says something like "Shop now!" It should look something like this
                +a('http://bbb.com/baths?campain monitoring thing') Shop now
                * Note: this link needs to be the full one, including the campain monitoring suffix

5. Open the terminal and type "cd " then drag this project folder into the terminal then press enter

6. Install node, xcode and xcode command line tools (you only need to do this step once) (also, only do this if you don't have these installed)
    * For node, go to the Node website and hit install
    * For xcode, go to the mac appstore and download xcode
    * Google it to find the xcode command line tools. Apple keeps changing their location

7. Install this project's dependencies
    * If you reuse this same folder, you only need to do this once
    * Into the terminal, type: npm install <ENTER>

8. Then type "grunt", it's the only command

9. An output folder should appear (or the content of an output folder should be overriden if you're reusing this folder). Inside will be an index.html, plain.txt and imgs folder. 
    * Your plain text file will be all of the live text, alt tags and links that are in your email
        * This does not include the pre-header for BBB emails (yet)
        * BBB emails will get banners put in where appropriate, other emails won't
        * For BBB emails you need to go and move the offer bug on the main feature above the main feature content
    * Remember to go back and add style to any live text
        * Do this directly to the <p> tags
        * Valid styles: font-family, font-size, line-height, color
    * If it's a BBB email, make sure to adjust the second table cell image. It's a spacer for the preheader. When you adjust, make sure to adjust the table size and the image size together. This is dependent on the length of your preheader text (that's why it's not automated).

Just some other notes:
    * Don't worry about special characters or weird spacing anywhere.