# AutoEmail

***

AutoEmail is a tool designed to speed up the development of HTML email. It takes a sliced Photoshop document, checks it against an Excel document and generates nicely formatted HTML and plain text that will work well with most HTML email systems.

* [Installation][]
* [Settings][]
	* [Excel Document][]
	* [Photoshop Document][]
	* [Jade File][]
* [Generating an Email][]
* [Notes & Miscellany][]

***

## Installation

### Clone the project to your development environment: 

    git clone git@bitbucket.org:mindstreaminteractive/autoemail.git

### Install the project's depencies (if not already installed)

1. [Node.js](http://nodejs.org/)
2. [Xcode](https://developer.apple.com/xcode/downloads/)
3. Xcode Command Line Tools
    * [Yosemite & Mavericks](http://railsapps.github.io/xcode-command-line-tools.html)
    * _Search Google for older versions OS X._

### Install Node.js dependencies
 
1. Navigate to installation location: 
    ```
    cd /path/to/autoemail/
    ```

2. Install depencies: 
    ```
    npm install
    ```  

***


## Settings


### Excel Document 

#### Column Information

AutoEmail requires that the email data be stored in an Excel document, formatted into three columns as follows:

* **Column 1: Slice Names** 
    The first column is for slice names. 
    **Note:** _Spaces, dashes/hyphens and underscores are not permitted in slice names._

* **Column 2: ALT Text** The second column is for ALT Text (if applicable).

* **Column 3: Links** The third column is for links (if applicable). Leaving this field blank or using the text "no link" will prevent AutoEmail from wrapping the slice in a link.


#### Excel Export Settings if older than 2013

1. From the **File** menu, select **Save as Web Page**
    * Select **Sheet** radio button
    
2. Click **Web Options...**

3. Select the **Encoding** tab
    * Select **Unicode (UTF-8)**
    * Check **Always save Web pages in the default encoding.** 
    (This will allow you to skip this step in the future.)
        
4. Name this document **2excel.htm**
5. Save everything into a **data** folder in the root folder of this project

#### Excel Export Settings if newer than 2013

1. From the **File** menu, select **Export** then **Change File Type** then **Save as Another File Type**.

2. The click **Tools** and select **Web Options**.

3. Select the **Encoding** tab
    * In the "Save this document as:" dropdown, select **Unicode (UTF-8)**.
    * Check **Always save Web pages in the default encoding.** 
    (This will allow you to skip this step in the future.)

4. Select **Web Page** from the "Save as type" dropdown.
    * Select **Republish: Sheet** radio button

5. Name this document **2excel.htm**, hit save then publish.

***

### Photoshop Document

#### Slicing the Photoshop document 

AutoEmail reads your slices in rows, so its best to avoid non-traditional layouts.

To help in creating slices, a good practice is to approximate your slices using Photoshop’s guides. Once the guides have been drawn, choose the **Slice Tool** then click the **Slices From Guides** button. Then, delete all unwanted slices.

##### Slice names 
Slice names should match the names in the slices column of the Excel document. To set a slice name:

1. Create the slice
2. Open the Slice Options
3. Set the value of the Name field to match coresponding row in the Excel document.


##### Spacer Images

Because it does rows perfectly, the use of spacer images is completely acceptable. To use a spacer image, create a slice and set the title to "replace". It will then be automatically be replaced with a spacer GIF sized to the correct dimensions. Spacer images can also have a link.

##### Background image / color
If a slice requires a background image with live text on top of it, do the following:

1. Create the slice with the text layer hidden 
2. Open the Slice Options
3. Paste the text into the Alt Tag field 
4. Set the Name field to "background"
5. Select a background color for the slice (It will become the fallback color for the image).
    **Note:** _This technique works well on most clients, but a small handful may revert to the fallback_



##### Slices with all live text
If a slice is all live text:

1. Create the slice
2. Open Slice Options
3. Set the Slice Type property to "No Image" 
4. Insert the live text into the "Text Displayed in Cell" field.

Note: _Unfortunately, you will have to add style info yourself, but the cell for it will be the correct dimensions in the correct spot._

* Don't cut the slice too tight, as different fonts will render at different sizes
* 5px of extra width is typically enough for single line content. Multi-line content may need more and should be adjusted on a case-by-case basis.
* Slides should be named as they appear in the Excel document


##### Breaking large slices into smaller slices
* If large slice needs to be divided into multiple slices, name the most important/largest/most prominent one the exact name on the Excel file and append a '--alt' to all the others. Doing this will add the link to every image piece but won't duplicate the alt text in the page or the plain text file.
    **Example:** If the main slice is named "myslice", the other associated slices would be named "myslice--alt"


#### Photoshop Export Settings

1. From the **File** menu, select **Save for Web...**
2. Select the image format and compression settings for each slice (GIF, JPG, etc.).
    A general rule of thumb, if the slice contains a photos, save a JPG, everything else should be a GIF.
3. Click **Save** (the "Save Optimized As" dialog should open)
4. Set **Format** to **HTML and Images**
5. Set **Settings** to **Other** (will change to "Custom" after set)
    * HTML Settings:
        * **Output XHTML:** Check 
        * Nothing else on this screen matters
    * Slices Settings:
        * **Generate Table:** Check
        * **Empty Cells:** GIF, IMG, W&H
        * **TD W&H:** Auto
        * **Spacer Cells:** Auto (Bottom)
        * Nothing else matters
    * Background settings: don't matter
    * Saving Files Settings:
        * **Put Images in Folder:** Uncheck.
6. Set **Slices** to **All User Slices**
7. Name the generated html file **1photoshop.html**
8. Save everything into a **data** folder in the root folder of this project


### Jade File
* Open index.jade and change the title to something sensible (or just leave it blank)
* There is some base Bed Bath & Beyond information in here as these emails are most common
    * To disable this, just comment it out (//- before a line, there's an example on the page) lines 2 and 9 ("include mixins/bbb.jade" and "+addBBBheader-550('')") 
    * If you are making a BBB email
        * As the comment on the page says, the parameter for the add header function is the campaign monitoring suffix, don't include the question mark
        * Under and indented in function call, there is a pipe symbol. After it goes the plain text that is in the upper left hand corner of most emails. If there is nothing there, just don't fill out this line. If you did put something there, make sure there is a space at the end because directly following will be your shop now link.
        * Under that at the same indentation level is a function call that puts in a link. This is usually says something like "Shop now!" It should look something like this:
            ```
            +a('http://bbb.com/baths?campain-monitoring-code') Shop now
            
            ```
            * Note: this link needs to be fully-qualified, including the campaign monitoring suffix.


### Misc. Editting Notes

* Don't worry about special characters or weird spacing anywhere.

***

## Generating an Email

1. Save the Excel document data _(see [Excel Export Settings][])_
2. Save the Photoshop document data and assets _(see [Photoshop Export Settings])_
3. Save the Jade file _(see [Jade File][])_
4. Run Grunt the task
	* Navigate to the AutoEmail installation location and run the following command:
	
		```
		grunt
		```

An output folder should appear (or the content of an output folder will be overriden if you're reusing this folder). Inside will be an index.html, plain.txt and imgs folder. 

* Your plain text file will be all of the live text, alt tags and links that are in your email
       * This does not include the pre-header for BBB emails (yet)
       *  BBB emails will get banners put in where appropriate, other emails won't
       * For BBB emails you need to go and move the offer bug on the main feature above the main feature content

* Remember to go back and add style to any live text
	* Do this directly within the ```<p>``` tags
	* Valid styles: ```font-family, font-size, line-height, color```


### Notes & Miscellany

* If a BBB email, be sure to remove text from the title tag. ```<title></title>```

[1]: 
