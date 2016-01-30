/*global $ */

'use strict';

$(function () {
  var slider = $('.slider');

  if (slider.length) {
    var sliderMain = slider.find('.slider-body');
    var sliderContent = sliderMain.find('.slider-content');

    var updateBgi = function (_elm) {
      var bgi = _elm.css('background-image');
      bgi = bgi.replace('thumb', 'bg') + ', ' + bgi;
      _elm.css('background-image', bgi);
    };

    $.ajaxSetup({ cache: true });
    $.getScript('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.5.9/slick.min.js', function (data, textStatus) {
      var sliderThumb = slider.find('.slider-thumbs');
      var sliderLen = sliderContent.length;
      var sliderBtnTmpl = $('<div />').html($('#slider-btn-tmpl').html()).find('button');
      var sliderInitOrder = sliderLen - 1;

      updateBgi(sliderContent.eq(sliderInitOrder));

      sliderMain.slick({
        arrows: false,
        asNavFor: sliderThumb,
        fade: true,
        initialSlide: sliderInitOrder,
        slidesToShow: 1
      });

      sliderMain.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        updateBgi(sliderContent.eq(nextSlide));
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

  // simple macho effect for CJK text wrapping
  var titles = $('.title, .talk__title, .point-item__title');
  if (titles.length) {
    $.each(titles, function (index, val) {
      var txt = val.textContent;
      if (txt.length > 3) {
        val.innerHTML = txt.slice(0, -3) + '<span class="ib">' + txt.slice(-3) + '</span>';
      }
    });
  }

});
