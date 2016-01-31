/*global $, YT, localStorage, location */

'use strict';

$(function () {
  let slider = {
    elm: $('.slider')
  };

  if (slider.elm.length) {
    slider.main = slider.elm.find('.slider-body');
    slider.content = slider.main.find('.slider-content');
    slider.len = slider.content.length;
    slider.bgiUpdated = [];

    slider.updateBgi = (_order, getSibling) => {
      if (slider.bgiUpdated.indexOf(_order) === -1) {
        let _target = slider.content.eq(_order);
        let bgi = _target.css('background-image');

        bgi = `${bgi.replace('thumb', 'bg')}, ${bgi}`;
        _target.css('background-image', bgi);
        slider.bgiUpdated.push(_order);
      }

      if (getSibling) {
        slider.updateBgi((_order + slider.len - 1) % slider.len);
        slider.updateBgi((_order + 1) % slider.len);
      }
    };

    $.ajaxSetup({ cache: true });
    $.getScript('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.5.9/slick.min.js', (data, textStatus) => {
      slider.thumb = slider.elm.find('.slider-thumbs');
      slider.btnTmpl = $('<div />').html($('#slider-btn-tmpl').html()).find('button');
      slider.initOrder = slider.len - 1;

      slider.updateBgi(slider.initOrder, true);

      slider.main.slick({
        arrows: false,
        asNavFor: slider.thumb,
        fade: true,
        initialSlide: slider.initOrder,
        slidesToShow: 1
      });

      slider.main.on('beforeChange', (event, slick, currentSlide, nextSlide) => {
        slider.updateBgi(nextSlide, true);
      });

      slider.thumb.slick({
        asNavFor: slider.main,
        centerMode: true,
        centerPadding: 0,
        focusOnSelect: true,
        initialSlide: slider.initOrder,
        slidesToShow: 5,
        useTransform: true,
        prevArrow: slider.btnTmpl[0].outerHTML,
        nextArrow: slider.btnTmpl[1].outerHTML,
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
  let titles = $('.title, .talk__title, .point-item__title');
  if (titles.length) {
    $.each(titles, (index, val) => {
      let txt = val.textContent;
      if (txt.length > 3) {
        val.innerHTML = `${txt.slice(0, -3)}<span class="ib">${txt.slice(-3)}</span>`;
      }
    });
  }

  // polis step show
  let polis = {
    items: $('.polis')
  };

  if (polis.items.length) {
    // detect animation support
    (function () {
      let domPrefixes = 'Webkit Moz O ms Khtml'.split(' ');
      let elm = document.createElement('div');

      if (elm.style.animationName !== undefined) {
        polis.isSupportAnimation = true;
        return;
      }

      if (!polis.isSupportAnimation) {
        for (let i = 0; i < domPrefixes.length; i++) {
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

    polis.loadmore = () => {
      let _top10 = polis.items.slice(0, polis.step);
      polis.items = polis.items.slice(polis.step);
      _top10.addClass('is-show');
    };

    polis.more.on('click.loadmore', (event) => {
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
  let video = {
    elm: $('.video')
  };

  if (video.elm.length) {
    let player;
    video.iframe = video.elm.find('.video-iframe');

    if (!video.iframe.length) { return; }

    video.elm.find('.video-cover').on('click.loadvideo', () => {
      let _vid = video.iframe.data('vid');
      let _config = {
        enablejsapi: 1,
        html5: 1,
        showinfo: 0,
        autoplay: 1
      };
      let _url = `https://www.youtube.com/embed/${_vid}?${$.param(_config)}`;
      video.iframe.attr('src', _url);
      video.elm.addClass('video-playing');
    });

    video.onPlayerReady = () => {
      $('.video-cover__icon-play').on('click.playvideo', () => {
        player.playVideo();
      });
    };

    video.onPlayerStateChange = (event) => {
      if (event.data === 1) {
        video.elm.addClass('video-playing');
      }
    };

    $.ajaxSetup({ cache: true });
    $.getScript('//www.youtube.com/player_api', (data, textStatus) => {
      window.onYouTubePlayerAPIReady = () => {
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

$(window).on('load', () => {
  let now = +new Date();
  let getConfirm = () => {
    return window.confirm('這是個人練習 jade 的作品，\n圖文資料等皆取自政問原始網站 talkto.tw，\n理解的話請按確定，並繼續瀏覽~');
  };
  let confirmTime = localStorage && localStorage.getItem('confirmTime');

  if (!confirmTime) {
    if (getConfirm()) {
      localStorage.setItem('confirmTime', now);
    } else {
      // redirect to github repo
      location.href = 'https://github.com/Rplus/demo-talkto';
    }
  } else {
    // outdated: over 30 mins, remove confirmTime
    let deltaTime = now - confirmTime * 1;
    if (deltaTime > 30 * 60 * 1000) {
      localStorage.removeItem('confirmTime');
    }
  }
});
