/*global $ */

'use strict';

$(function () {
  var slider = $('.slider');

  if (slider.length) {
    var sliderMain = slider.find('.slider-body');
    var sliderContent = sliderMain.find('.slider-content');
    $.ajaxSetup({ cache: true });
    $.getScript('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.5.9/slick.min.js', function (data, textStatus) {
      var sliderThumb = slider.find('.slider-thumbs');
      var sliderLen = sliderContent.length;
      var sliderBtnTmpl = $('<div />').html($('#slider-btn-tmpl').html()).find('button');
      var sliderInitOrder = sliderLen - 1;

      sliderMain.slick({
        arrows: false,
        asNavFor: sliderThumb,
        fade: true,
        initialSlide: sliderInitOrder,
        slidesToShow: 1
      });

      sliderThumb.slick({
        asNavFor: sliderMain,
        centerMode: true,
        centerPadding: 0,
        focusOnSelect: true,
        initialSlide: sliderInitOrder,
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
    $.ajaxSetup({ cache: false });
  }
});
