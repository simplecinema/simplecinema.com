/** *  fixedonlater.js v0.2
 *  Fix element after scrolling one page height.
 *  Usage in combination with css, class .fixed-top
 *     $('#navigation').fixedonlater({
 *       speedDown: 250,
 *       speedUp: 100
 *     });
 *  by Rewea: http://www.rewea.com
 *
 *  Copyright 2013 Rewea.com - Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0).
 *  http://creativecommons.org/licenses/by-sa/3.0/deed.en_US
 */
(function ($) {
  var $window = $(window);
  var windowHeight = $window.height();
  $window.resize(function () {
    windowHeight = $window.height();
  });
  $.fn.fixedonlater = function (options) {
    var defaults = {
      speedDown: 250,
      speedUp: 100
    };
    var options = $.extend(defaults, options);
    var o = options;
    var $obj = $(this);

    function update() {
      windowScrollTop = $window.scrollTop();
      $obj.each(function () {
        var $this = $(this);
        var $thisHeight = $this.outerHeight();
        if (windowScrollTop > (windowHeight - $thisHeight)) {
          if ($this.css('opacity') == 0) {
            $this.animate({
              top: "0",
              opacity: '1'
            }, {
              queue: false,
              duration: o.speedDown
            });
          }
        } else {
          $this.animate({
            top: -$thisHeight,
            opacity: '0'
          }, {
            queue: false,
            duration: o.speedUp
          });
        }
      });
    };
    $window.bind('scroll', update).resize(update);
    update();
  }
})(jQuery);
