/*
===============================================================
Copyright (C) 2012 Sylvain Hamel

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify,
merge, publish, distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is furnished 
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be 
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR
ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
===============================================================


EDITED/UPDATED 24/02/2014 (JOSE FAJARDO): 
- added Multiple support
- added OptGroup support
- added Size support
- added Disabled support


*/
/*global $:false, window:false, navigator:false */
(function () {
    "use strict";

    // set isSafari to true to bypass user agent check when 
    // testing in a browser other than safari mobile 
    function SelectConverter(forceSafariMobileMode) {

        var that = this;

        var styles =
        '<style type="text/css">' +
        '    /* styles for the safarimobile-multiline-select plug-in */ \r\n' +
        '    .multilineselect { display:inline-block; margin:0px; padding:2px; overflow:auto; vertical-align: text-bottom;} \r\n' +
        '    .multilineselect2 { display:inline-block; margin-left:10px;  padding:2px; overflow:auto; vertical-align: text-bottom; width:90%;} \r\n' +
        '    .disabled-ul { color:lightgrey; border: 1px solid lightgrey; overflow-y:hidden; } \r\n' +
        '    .enabled-ul {  border: 1px solid silver;} \r\n' +
        '    .ul-grp-head {  font-weight:bold;} \r\n' +
        '    .multilineselect li {list-style-type: none; list-style-position:inside; margin:0px; padding:0px; cursor:default;}  \r\n' +
        '    .multilineselect li.selected {color: white; background-color: darkgrey;}  \r\n' +
        '</style>';


        that.isSafariMobile = function () {
            return navigator.userAgent.match(/(Android|webOS|BlackBerry)/) || (navigator.userAgent.match(/(iPod|iPhone|iPad|Android|webOS|BlackBerry)/) && navigator.userAgent.match(/AppleWebKit/)) || forceSafariMobileMode;
        };

        that.selectIsMultiline = function (item) {
            var value = item.attr('size');
            return !(value === undefined || value === "1");
        };

        that.selectValue = function (ul, val) {

            var toSelect = ul.find('li[data-value="' + val + '"]');
            toSelect.addClass('selected');
        };

        that.createListFromSelectElement = function (select) {
            var ul = $('<ul class="multilineselect">');

            //does it have MULTIPLE
            var attrMultiple = select.attr('multiple');
            var isMultiple = false;
            if (typeof attrMultiple !== 'undefined' && attrMultiple !== false) {
                isMultiple = true;
            }

            //does it have SIZE
            var attrSize = select.attr('size');
            var sizeInPixels = 18; //need a better way to determine a default line height, 20px = 1 line 
            if (typeof attrSize !== 'undefined' && attrSize !== false) {
                sizeInPixels = 18 * attrSize;
            }

            //does it have DISABLED
            var attrDisabled = select.attr('disabled');
            var isDisabled = false;
            if (typeof attrDisabled !== 'undefined' && attrDisabled !== false) {
                isDisabled = true;
                ul.addClass('disabled-ul', '');
            } else {
                ul.addClass('enabled-ul', '');
            }



            //set dimensions of UL to be same as SELECT
            ul.width(select.width());
            if (select.height() < sizeInPixels) ul.height(sizeInPixels);
            else ul.height(select.height());



            var selectid = select.attr("id");
            if (selectid !== undefined) {
                ul.attr("id", selectid + "_safarimobile");
            }

            //var rebuild = function () {
            //    select.children('option').each(function () {
            //        var option = $(this);

            //        var li = $('<li>');
            //        li.attr('data-value', option.val());
            //        li.html(option.html());

            //        var attrSelected = option.attr('selected');
            //        if (typeof attrSelected !== 'undefined' && attrSelected !== false) {
            //            li.addClass('selected');
            //        }


            //        // when items is clicked, push value to the original <select>
            //        li.click(function () {
            //            var value = $(this).attr('data-value');
            //            var isCurrentlySelected = $(this).hasClass('selected');

            //            //get list of currently selected items in the SELECT shadow
            //            var existingSelects = select.val();


            //            if (existingSelects == null) existingSelects = [];


            //            if (isMultiple) { //MULTIPLE

            //                if (isCurrentlySelected) {
            //                    //unselect it because the ctrl select paradigm is not supported on touch devices
            //                    $(this).removeClass('selected');

            //                    //remove from SELECTS array if its in there
            //                    var indexOfValue = existingSelects.indexOf(value);
            //                    if (indexOfValue > -1) {
            //                        existingSelects.splice(indexOfValue, 1);
            //                    }

            //                } else {
            //                    //add to SELECTS array
            //                    existingSelects.push(value);
            //                }

            //            } else {  //SINGLE SELECT

            //                if (isCurrentlySelected) {
            //                    //unselect it because the ctrl select paradigm is not supported on touch devices
            //                    $(this).removeClass('selected');

            //                } else {
            //                    //select it
            //                    existingSelects = value;
            //                }
            //            }



            //            //update SELECTS with what should be selected (existingSelects)
            //            select.val(existingSelects);
            //            select.change();
            //        });

            //        ul.append(li);
            //    });
            //};

            var rebuild = function () {

                select.children('option').each(function () {
                    var option = $(this);

                    rebuildOptions(option, ul);
                });

                select.children('optgroup').each(function () {
                    var optGroup = $(this);
                    var label = optGroup.attr("label");

                    var newli = $('<li>');

                    //create group name (div)
                    var newGroupNameDiv = $('<div class="ul-grp-head">');
                    newGroupNameDiv.html(label);

                    //create group (ul)
                    var newul = $('<ul class="multilineselect2">');

                    //no need to have a border
                    //if (isDisabled) newul.addClass('disabled-ul', '');
                    //else newul.addClass('enabled-ul', '');

                    optGroup.children('option').each(function () {
                        var option = $(this);

                        rebuildOptions(option, newul);
                    });

                    //append to DOM
                    newli.append(newGroupNameDiv);
                    newli.append(newul);
                    ul.append(newli);
                });
            };

            var rebuildOptions = function (option, ulToAddTo) {

                var li = $('<li>');
                li.attr('data-value', option.val());
                li.html(option.html());

                var attrSelected = option.attr('selected');
                if (typeof attrSelected !== 'undefined' && attrSelected !== false) {
                    li.addClass('selected');
                }


                // when items is clicked, push value to the original <select>
                li.click(function () {
                    if (isDisabled) return;

                    var value = $(this).attr('data-value');
                    var isCurrentlySelected = $(this).hasClass('selected');

                    //get list of currently selected items in the SELECT shadow
                    var existingSelects = select.val();


                    if (existingSelects == null) existingSelects = [];


                    if (isMultiple) { //MULTIPLE

                        if (isCurrentlySelected) {
                            //unselect it because the ctrl select paradigm is not supported on touch devices
                            $(this).removeClass('selected');

                            //remove from SELECTS array if its in there
                            var indexOfValue = existingSelects.indexOf(value);
                            if (indexOfValue > -1) {
                                existingSelects.splice(indexOfValue, 1);
                            }

                        } else {
                            //add to SELECTS array
                            existingSelects.push(value);
                        }

                    } else {  //SINGLE SELECT

                        if (isCurrentlySelected) {
                            //unselect it because the ctrl select paradigm is not supported on touch devices
                            $(this).removeClass('selected');

                        } else {
                            //select it
                            existingSelects = value;
                        }
                    }



                    //update SELECTS with what should be selected (existingSelects)
                    select.val(existingSelects);
                    select.change();
                });

                ulToAddTo.append(li);
            };


            rebuild();

            // when the <select> value change, select the corresponding item in the list
            select.change(function () {

                ul.find('li').removeClass('selected');
                //ul.children('li').removeClass('selected');

                var selected = $(this).find('option:selected');
                //var selected = $(this).children('option:selected');

                for (var i = 0; i < selected.length; i++) {
                    that.selectValue(ul, selected[i].value);
                }
            });

            $(select).on('items-changed', function () {

                ul.empty();
                rebuild();

                var selected = $(this).find('option:selected');
                //var selected = $(this).children('option:selected');

                that.selectValue(ul, selected.val());
            });

            return ul;
        };

        that.fixForSafariMobile = function (selectElements) {
            if (!that.isSafariMobile()) {
                return;
            }

            $("head").prepend(styles);

            selectElements.each(function () {
                var select = $(this);

                if (!that.selectIsMultiline(select)) {
                    return;
                }

                // hide the select element but keep it in the DOM to allow existing code to
                // keep on binding to it 
                //select.hide();
                var newlist = that.createListFromSelectElement(select);

                select.after(newlist);

            });
        };
    }

    // export SelectConverter (to instantiate in unit tests)
    window.SelectConverter = SelectConverter;

    // expose SelectConverter as a jQuery plugin
    $.fn.fixForSafariMobile = function (forceSafariMobileMode) {
        var instance = new SelectConverter(forceSafariMobileMode);
        instance.fixForSafariMobile(this);
        return this;
    };
}());
