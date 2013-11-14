/*
 *
 * Copyright (c) 2010 C. F., Wong (<a href="http://cloudgen.w0ng.hk">Cloudgen Examplet Store</a>)
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
(function($) {
        return $.fn.caret = function(start, length) {
          var caretOffset, el, elRange, position, range, sel, selected;
          if (length == null) {
            length = 0;
          }
          el = this[0];
          if (arguments.length === 0) {
            caretOffset = 0;
            selected = 0;
            range = window.getSelection().getRangeAt(0);
            elRange = range.cloneRange();
            selected = range.toString().length;
            elRange.selectNodeContents(el);
            elRange.setEnd(range.endContainer, range.endOffset);
            position = elRange.toString().length;
            if (selected) {
              position -= selected;
            }
            return {
              start: position,
              length: selected
            };
          } else if (start === 'all') {
            if ($(el).is('[contentEditable]')) {
              range = document.createRange();
              range.selectNodeContents(el);
              sel = window.getSelection();
              sel.removeAllRanges();
              return sel.addRange(range);
            } else {
              return el.select();
            }
          } else {
            if (typeof start !== "number") {
              length = start.length;
              start = start.start;
            }
            if ($(el).is('[contentEditable]')) {
              range = document.createRange();
              range.setStart(el.firstChild, start);
              range.setEnd(el.firstChild, start + length);
              sel = window.getSelection();
              sel.removeAllRanges();
              return sel.addRange(range);
            } else {
              return el.setSelectionRange(start, start + length);
            }
          }
        };
      })(jQuery);