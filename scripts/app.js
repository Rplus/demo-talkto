"use strict";function _typeof(e){return e&&"undefined"!=typeof Symbol&&e.constructor===Symbol?"symbol":typeof e}$(function(){var e={elm:$(".slider")};e.elm.length&&(e.main=e.elm.find(".slider-body"),e.content=e.main.find(".slider-content"),e.len=e.content.length,e.bgiUpdated=[],e.main.css("height",e.main.css("height")),e.updateBgi=function(t,i){if(-1===e.bgiUpdated.indexOf(t)){var n=e.content.eq(t),o=n.css("background-image");o=o.replace("thumb","bg")+", "+o,n.css("background-image",o),e.bgiUpdated.push(t)}i&&(e.updateBgi((t+e.len-1)%e.len),e.updateBgi((t+1)%e.len))},$.ajaxSetup({cache:!0}),$.getScript("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.5.9/slick.min.js",function(t,i){e.thumb=e.elm.find(".slider-thumbs"),e.btnTmpl=$("<div />").html($("#slider-btn-tmpl").html()).find("button"),e.initOrder=e.len-1,e.updateBgi(e.initOrder,!0),e.main.slick({arrows:!1,asNavFor:e.thumb,fade:!0,initialSlide:e.initOrder,slidesToShow:1}),e.main.on("beforeChange",function(t,i,n,o){e.updateBgi(o,!0)}),e.thumb.slick({asNavFor:e.main,centerMode:!0,centerPadding:0,focusOnSelect:!0,initialSlide:e.initOrder,slidesToShow:5,useTransform:!0,prevArrow:e.btnTmpl[0].outerHTML,nextArrow:e.btnTmpl[1].outerHTML,responsive:[{breakpoint:769,settings:{slidesToShow:3}}]})}),$.ajaxSetup({cache:!1}));var t=$(".title, .talk__title, .point-item__title");t.length&&$.each(t,function(e,t){var i=t.textContent;i.length>3&&(t.innerHTML=i.slice(0,-3)+'<span class="ib">'+i.slice(-3)+"</span>")});var i={items:$(".polis")};i.items.length&&(!function(){var e="Webkit Moz O ms Khtml".split(" "),t=document.createElement("div");if(void 0!==t.style.animationName)return void(i.isSupportAnimation=!0);if(!i.isSupportAnimation)for(var n=0;n<e.length;n++)if(void 0!==t.style[e[n]+"AnimationName"]){i.isSupportAnimation=!0;break}}(),i.isSupportAnimation||$(document.documentElement).addClass("no-animation"),i.more=$(".polis-more"),i.step=i.more.data("slice"),i.loadmore=function(){var e=i.items.slice(0,i.step);i.items=i.items.slice(i.step),e.addClass("is-show")},i.more.on("click.loadmore",function(e){e.preventDefault(),i.loadmore(),i.items.length||i.more.off("click.loadmore").hide()}),i.more.click());var n={elm:$(".video")};if(n.elm.length){var o=function(){var e=void 0;return n.iframe=n.elm.find(".video-iframe"),n.iframe.length?(n.elm.find(".video-cover").on("click.loadvideo",function(){var e=n.iframe.data("vid"),t={enablejsapi:1,html5:1,showinfo:0,autoplay:1},i="https://www.youtube.com/embed/"+e+"?"+$.param(t);n.iframe.attr("src",i),n.elm.addClass("video-playing")}),n.onPlayerReady=function(){$(".video-cover__icon-play").on("click.playvideo",function(){e.playVideo()})},n.onPlayerStateChange=function(e){1===e.data&&n.elm.addClass("video-playing")},$.ajaxSetup({cache:!0}),$.getScript("//www.youtube.com/player_api",function(t,i){window.onYouTubePlayerAPIReady=function(){e=new YT.Player("video",{events:{onReady:n.onPlayerReady,onStateChange:n.onPlayerStateChange}})}}),void $.ajaxSetup({cache:!1})):{v:void 0}}();if("object"===("undefined"==typeof o?"undefined":_typeof(o)))return o.v}}),$(window).on("load",function(){var e=+new Date,t=function(){return window.confirm("這是個人練習 jade 的作品，\n圖文資料等皆取自政問原始網站 talkto.tw，\n理解的話請按確定，並繼續瀏覽~")},i=localStorage&&localStorage.getItem("confirmTime");if(i){var n=e-1*i;n>18e5&&localStorage.removeItem("confirmTime")}else t()?localStorage.setItem("confirmTime",e):location.href="https://github.com/Rplus/demo-talkto"});
//# sourceMappingURL=app.js.map
