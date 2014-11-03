$(document).ready(function(){
  FastClick.attach(document.body);

  if ($('body').is('.homepage')) {

    var pageHeight = $(window).height();
    var pageWidth = $(window).width();
    var navigationHeight = $("#navigation").outerHeight();

    $(window).resize(function () {
      pageWidth = $(window).width();
      pageHeight = $(window).height();
    });

    /* Initialize scroll so if user droped to other part of page then home page. */
    $(window).trigger('scroll');

    /* Fix navigation. */
    $('#navigation').fixedonlater({
      speedDown: 250,
      speedUp: 100
    });

    /* Centralize elements on page. */
    $('.centralized').centralized({
      delay: 500,
      fadeSpeed: 500
    });

    /* Carousel "Quote slider" initialization. */
    $('#quote-slider').each(function(){
      if($('.item', this).length) {
        $(this).carousel({
          interval: 20000
        });
      }
    });

    /* Scroll spy and scroll filter */
    $('#main-menu').onePageNav({
      currentClass: "active",
      changeHash: false,
      scrollOffset: navigationHeight - 10,
      scrollThreshold: 0.5,
      scrollSpeed: 750,
      filter: "",
      easing: "swing"
     });

    /*
    *  Paralax initialization.
    *  Exclude for mobile.
    */
    if(pageWidth > 980){
      /* Dont user paralax for tablet and mobile devices. */
      $('#page-welcome').parallax("0%", 0.2);
      $('#page-features').parallax("0%", 0.07);
    }

    /* Emulate touch on table/mobile touchstart. */
    if(typeof(window.ontouchstart) != 'undefined') {
      var touchElements = [".social-icons a", ".portfolio-items li", ".about-items .item"];

      $.each(touchElements, function (i, val) {
        $(val).each(function(i, obj) {
          $(obj).bind('click', function(e){

            if($(this).hasClass('clickInNext')){
              $(this).removeClass('clickInNext');
            } else {
              e.preventDefault();
              e.stopPropagation();

              $(this).mouseover();
              $(this).addClass('clickInNext');
            }
          });
        });
      });
    }

    /**
    *   BLOCK | Navigation
    *
    *   Smooth scroll
    *   Main menu links
    *   Logo click on Welcome page
    */
    $('#page-welcome .logo a').click(function(){
      $('html, body').animate({
        scrollTop: $( $.attr(this, 'href') ).offset().top - navigationHeight + 4
      }, 800);

      /* Fix jumping of navigation. */
      setTimeout(function() {
        $(window).trigger('scroll');
      }, 900);

      return false;
    });

    /**
    *   PAGE | Welcome
    *
    *   Initialize slider for welcome page H1 message.
    */
     $('#welcome-messages ul').bxSlider({
      mode: 'horizontal',
      auto: true,
      minSlides: 1,
      responsive: true,
      touchEnabled: true,
      pager: false,
      controls: false,
      useCSS: false,
      pause: 4000
    });

    /**
    *   PAGE | WORK
    *
    *   .plugin-filter - Defines action links.
    *   .plugin-filter-elements - Defines items with li.
    */
    $('.plugin-filter').click(function(){
      return false;
    });
    $('.plugin-filter-elements').mixitup({
      targetSelector: '.mix',
      filterSelector: '.plugin-filter',
      sortSelector: '.sort',
      buttonEvent: 'click',
      effects: ['fade','rotateY'],
      listEffects: null,
      easing: 'smooth',
      layoutMode: 'grid',
      targetDisplayGrid: 'inline-block',
      targetDisplayList: 'block',
      gridClass: '',
      listClass: '',
      transitionSpeed: 600,
      showOnLoad: 'all',
      sortOnLoad: false,
      multiFilter: false,
      filterLogic: 'or',
      resizeContainer: true,
      minHeight: 0,
      failClass: 'fail',
      perspectiveDistance: '3000',
      perspectiveOrigin: '50% 50%',
      animateGridList: true,
      onMixLoad: null,
      onMixStart: null,
      onMixEnd: null
    });

    /* Initialize Slider */
    var swiper = jQuery('#swiper').swiper({
      loop:true,
      grabCursor: true,
      autoPlay: 4000
    });

    /* On Load swiper height should adjust to img size */
    jQuery('.swiper-slide img').load(function() {
      jQuery('#swiper').height(jQuery('.swiper-slide img').height());
      jQuery('.swiper-wrapper').height(jQuery('.swiper-slide img').height());
    });

    /* On Resize swiper height should adjust to img size */
    jQuery(window).resize(function() {
      jQuery('#swiper').height(jQuery('.swiper-slide img').height());
      jQuery('.swiper-wrapper').height(jQuery('.swiper-slide img').height());
    });

  }

  /* Make embeded videos responsive. */
  $.fn.responsivevideos();

});


/**
*   Ajax request.
*   Start loading.
*   Append loading notification.
*/
$( document ).ajaxSend( function() {
  /* Show loader. */
  if($(".loading").length == 0) {
    $("body").append('<div class="loading"><div class="progress progress-striped active"><div class="bar"></div></div></div>');
    $(".loading").slideDown();
    $(".loading .progress .bar").delay(300).css("width", "100%");
  }
});

/**
*   Reinitialize Scrollspy after ajax request is completed.
*   Refreshing will recalculate positions of each page in document.
*   Time delay is added to allow ajax loaded content to expand and change height of page.
*/
$( document ).ajaxComplete(function() {
  /* Remove loading section. */
  $(".loading").delay(1000).slideUp(500, function(){
    $(this).remove();
  });

  /* Portfolio details - close. */
  $(".close-portfolio span").click(function(e) {
    $(".portfolio-item-details").delay(500).slideUp(500, function(){
      $(this).remove();
    });

    window.location.hash = '!';
    return false;
  });
});
