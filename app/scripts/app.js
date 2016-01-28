/*global $ */

'use strict';

$(function () {
  $.getScript('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.5.9/slick.min.js', function (data, textStatus) {
    var sliderMain = $('.slider-body');
    var sliderThumb = $('.slider-thumbs');
    var sliderLen = sliderMain.find('.slider-content').length;
    var sliderBtnTmpl = $('<div />').html($('#slider-btn-tmpl').html()).find('button');

    sliderMain.slick({
      arrows: false,
      asNavFor: sliderThumb,
      fade: true,
      initialSlide: sliderLen - 1,
      slidesToShow: 1
    });

    sliderThumb.slick({
      asNavFor: sliderMain,
      centerMode: true,
      centerPadding: 0,
      focusOnSelect: true,
      initialSlide: sliderLen - 1,
      slidesToShow: 5,
      useTransform: true,
      prevArrow: sliderBtnTmpl[0].outerHTML,
      nextArrow: sliderBtnTmpl[1].outerHTML,
      responsive: [
        {
          breakpoint: 769,
          settings: {
            slidesToShow: 3
          }
        }
      ]
    });
  });
});
