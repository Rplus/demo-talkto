/*global $, YT */

'use strict';

$(function () {
  var slider = $('.slider');

  if (slider.length) {
    var sliderMain = slider.find('.slider-body');
    var sliderContent = sliderMain.find('.slider-content');
    var sliderLen = sliderContent.length;
    var sliderBgiUpdated = [];

    var updateBgi = function (_order, getSibling) {
      if (sliderBgiUpdated.indexOf(_order) !== -1) { return; }

      var _target = sliderContent.eq(_order);
      var bgi = _target.css('background-image');

      bgi = bgi.replace('thumb', 'bg') + ', ' + bgi;
      _target.css('background-image', bgi);

      sliderBgiUpdated.push(_order);

      if (getSibling) {
        updateBgi((_order - 1) % sliderLen);
        updateBgi((_order + 1) % sliderLen);
      }
    };

    $.ajaxSetup({ cache: true });
    $.getScript('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.5.9/slick.min.js', function (data, textStatus) {
      var sliderThumb = slider.find('.slider-thumbs');
      var sliderBtnTmpl = $('<div />').html($('#slider-btn-tmpl').html()).find('button');
      var sliderInitOrder = sliderLen - 1;

      updateBgi(sliderInitOrder, true);

      sliderMain.slick({
        arrows: false,
        asNavFor: sliderThumb,
        fade: true,
        initialSlide: sliderInitOrder,
        slidesToShow: 1
      });

      sliderMain.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        updateBgi(nextSlide, true);
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

  // polis step show
  var polis = {
    items: $('.polis')
  };

  if (polis.items.length) {
    // detect animation support
    (function () {
      var domPrefixes = 'Webkit Moz O ms Khtml'.split(' ');
      var elm = document.createElement('div');

      if (elm.style.animationName !== undefined) {
        polis.isSupportAnimation = true;
        return;
      }

      if (!polis.isSupportAnimation) {
        for (var i = 0; i < domPrefixes.length; i++) {
          if (elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined) {
            polis.isSupportAnimation = true;
            break;
          }
        }
      }
    })();

    if (!polis.isSupportAnimation) {
      $(document.documentElement).addClass('no-animation');
    }

    polis.more = $('.polis-more');
    polis.step = polis.more.data('slice');

    polis.loadmore = function () {
      var _top10 = polis.items.slice(0, polis.step);
      polis.items = polis.items.slice(polis.step);
      _top10.addClass('is-show');
    };

    polis.more.on('click.loadmore', function (event) {
      event.preventDefault();
      polis.loadmore();

      // remove click event & loadmore
      if (!polis.items.length) {
        polis.more.off('click.loadmore').hide();
      }
    });

    polis.more.click();
  }

  // video
  var video = {
    elm: $('.video')
  };

  if (video.elm.length) {
    var player;
    video.iframe = video.elm.find('.video-iframe');

    if (!video.iframe.length) { return; }

    video.elm.find('.video-cover').on('click.loadvideo', function () {
      var _vid = video.iframe.data('vid');
      var _config = {
        enablejsapi: 1,
        html5: 1,
        showinfo: 0,
        autoplay: 1
      };
      var _url = 'https://www.youtube.com/embed/' + _vid + '?' + $.param(_config);
      video.iframe.attr('src', _url);
      video.elm.addClass('video-playing');
    });

    video.onPlayerReady = function (event) {
      $('.video-cover__icon-play').on('click.playvideo', function (event) {
        player.playVideo();
      });
    };

    video.onPlayerStateChange = function (event) {
      if (event.data === 1) {
        video.elm.addClass('video-playing');
      }
    };

    $.ajaxSetup({ cache: true });
    $.getScript('//www.youtube.com/player_api', function (data, textStatus) {
      window.onYouTubePlayerAPIReady = function () {
        player = new YT.Player('video', {
          events: {
            'onReady': video.onPlayerReady,
            'onStateChange': video.onPlayerStateChange
          }
        });
      };
    });
    $.ajaxSetup({ cache: false });
  }
});
