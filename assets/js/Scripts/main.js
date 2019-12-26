$(function () {

  var baseurl = $('#baseurl').val();

const swiperRelArticlesHtml = $('.swiper-articles-holder').html();
var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

_toggler();
InitSwiperRelatedReport();
InitSwiperPartnerCompanies();
customFilterSelect();
closeAllPopups();

const mainObj = $("main");

if(mainObj.hasClass('home')){
  InitSwiperBlog();
  InitSwiperVideo();
  InitSwiperLeader();
  InitSwiperOpinion();
  appendSectionBlog();
  InitSwiperInquiry();
  _holderBox();
} else if(mainObj.hasClass('details-article')){
  InitSwiperRelatedArticles(swiperRelArticlesHtml);
  openPopupDetails();
} else if(mainObj.hasClass('details-malafat')){
  InitSwiperRelatedArticles(swiperRelArticlesHtml);
}

$(window).on('resize', function(){
  appendSectionBlog();
  // headerSearchBtn();
  headerMenuDropdown();
  if(mainObj.hasClass('details-article')){
    InitSwiperRelatedArticles(swiperRelArticlesHtml);
  } else if(mainObj.hasClass('details-malafat')){
    InitSwiperRelatedArticles(swiperRelArticlesHtml);
  } 
});

$(window).on('load', function(){
  //InitSwiperBlog();
  //appendSectionBlog();
  //InitSwiperRelatedReport();
  //headerSearchBtn();
  //headerMenuDropdown();
  //openPopupDetails();
  //openPopupNewsletter();
  //_forPreviewOnly();
  //submenuHover();
  //InitHtmlInclude();
});

});

//Global functions
function InitGlobalFunction(){

}

function InitHtmlInclude() {
//w3.includeHTML();
_chartTab();
headerScroll();
InitSwiperPopup();
headerSearchBtn();
headerMenuDropdown();
fixedScrolling();
homeActivePopup();
}
//End Global functions

function homeActivePopup() {
setTimeout(function(){
  if ($('main').hasClass('home-dropdown')) {
    $('header .nav-item')[0].classList.add('open-menu');
    $('header .nav-link')[0].classList.add('nav-link-active');
  } else if ($('main').hasClass('home-search')) {
    $('header .holder-nav-search').addClass('holder-nav-search-active');
  } else if($('main').hasClass('home-scroll')) {
    $(window).scrollTop(200);
  }
}, 200);
}

function toggleFixed() {
var body = $('body');
var html = $('html')

body.toggleClass('overflow-hide');
html.toggleClass('overflow-hide');
}

function removeFixed() {
var body = $('body');
var html = $('html');

body.removeClass('overflow-hide');
html.removeClass('overflow-hide');
}

function fixedScrolling() {
setTimeout(function(){
  var navbarToggler = $('.navbar-toggler');
  var btnNewsLetter = $('.btn-news-letter');
  var newsLetterClose = $('.icon-close')

  navbarToggler.on('click', function() {
    toggleFixed();
  })
  
  btnNewsLetter.on('click', function() {
    toggleFixed();
  })

  newsLetterClose.on('click', function() {
    removeFixed();
  })
}, 200);
}

function submenuHover() {
var link = $('.link');

link.on('mouseenter', function() {
  var holderImage = $(this).parent().parent().parent().siblings('.holder-image-content').find('.holder-image');
  var linkID = this.id;

  holderImage.removeClass('holder-image-active');
  link.removeClass('link-active')
  $(this).addClass('link-active')
  
  holderImage.each(function(index, value) {
    if ($(this).data('image') === linkID) {
      $(this).addClass('holder-image-active');
    }
  })
})
}

function headerMenuDropdown() {
// setTimeout( function(){
  headerClickMenu();
  // if(isChrome) {
  //   headerClickMenu();
  // } else {
  //   setTimeout(function(){
  //     headerClickMenu();
  //   }, 500);
  // }
  
  function headerClickMenu() {
    var width = $(window).width(); 
    $(window).on('scroll', function() {
      $('header .nav-item .nav-link').parent().removeClass('open-menu');
      $('header .nav-item .nav-link').removeClass('nav-link-active')
    })
  
    if (width > 767) { 
      $('header .nav-item .nav-link').on('click', function (e) {

          if ($(this).attr('href') == "#") {
              e.preventDefault();
          }
        $(this).parent().addClass('open-menu');
        $(this).parent().siblings().removeClass('open-menu');
        $('header .nav-item .nav-link').removeClass('nav-link-active')
        $(this).addClass('nav-link-active');
      });
    } else {
        $('header .burger-menu').on('click', function(e) {
        e.preventDefault();
        $('body').toggleClass('is-lock');
  
        if ($('.burger-menu').attr( 'aria-expanded') === 'false') {
          $(window).unbind('scroll');
          $('.header-logo-menu').removeClass('fixed-header')
        } else {
          $(window).scroll(function(){
            if ($(window).scrollTop() >= 100) {
                $('.header-logo-menu').addClass('fixed-header');
                $('.holder-menu').append().insertBefore('.navbar-brand');
                $('nav').removeClass('fixed-header');
            }
            else {
              $('.header-logo-menu').removeClass('fixed-header');
            }
          });
        }
      });
  
      $('header .nav-link').on('click', function() {
        console.log(1)
        $(this).parent('.nav-item').toggleClass('open-menu');
        // $(this).parent('.nav-item').children('.menu-dropdown').show("slide", { direction: "up" }, 800);
      });
  
      $('header .back-mainmenu').on('click', function() {
        $(this).parents('.nav-item').removeClass('open-menu');
        // $(this).parents('.nav-item').children('.menu-dropdown').hide("slide", { direction: "up" }, 800);
      });
    }
  }
// }, 100)
}

function headerSearchBtn() {
// var width = $(window).width(); 
var searchBtn = $('body header .icon-search');
var searchBar = $('body header .field-search');
var logoMenu = $('body .header-logo-menu');
var searchBtnMobile = $('body .search-btn-mobile');
var holderNavSearch = $('body .holder-nav-search')
// var isOpen = false;

searchBtn.on('click', function (e) {
    //e.preventDefault();
  console.log(1)
    holderNavSearch.toggleClass('holder-nav-search-active');
    logoMenu.toggleClass('open-search');
  // if (searchBar.val().length > 0 && isOpen === true) {
  //   window.location.replace('12_search.html');
  // } else {
  //   if (width < 768) {
  //     logoMenu.toggleClass('open-search');
  //     searchBar.toggle("slide", { direction: "up" }, 200);
  //     searchBtnMobile.toggle("slide", { direction: "up" }, 200);
  //   } else {
  //     if (isOpen === false) {
  //       isOpen = true;
  //     } else {
  //       isOpen = false;
  //     }
  //     searchBar.fadeToggle();
  //   }
  // }
})

searchBtnMobile.on('click', function() {
  var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

  if (isChrome) {
    if (searchBar.val().length > 0) {
      //window.location.replace('12_search.html');
    } else {
      holderNavSearch.toggleClass('holder-nav-search-active');
      logoMenu.toggleClass('open-search');
    }
  } else {
    // setTimeout(function(){
      if (searchBar.val().length > 0) {
        //window.location.replace('12_search.html');
      } else {
        holderNavSearch.toggleClass('holder-nav-search-active');
        logoMenu.toggleClass('open-search');
      }
    // }, 200);
  }
})
}

function headerScroll() {
var isClone = false;
scroll();

function scroll() {
  var windowWidth = $(window).width();

  if (windowWidth > 767) {
    if ($(window).scrollTop() >= 100) {
      $('body nav').addClass('fixed-header');
      if (isClone === false) {
        $('body .holder-menu').clone().append().insertAfter('body .navbar-nav');
        isClone = true;
      }
    } else {
      $('body nav').removeClass('fixed-header');
      $('body .navbar .holder-menu').remove();
      isClone = false;
    }
  } else {
    if ($(window).scrollTop() >= 100) {
      $('body nav').removeClass('fixed-header');
      $('body .header-logo-menu').addClass('fixed-header');
    } else {
      $('body .header-logo-menu').removeClass('fixed-header');
    }
  }
}

$(window).on('scroll', function(){
  scroll()
});

$(window).on('resize', function() {
  scroll()
})
}

var isSectionBlogAppend = false;
function appendSectionBlog() {
var width = $(window).width();

//if ($(window).width() <= 991) {
//  if (isSectionBlogAppend === false) {
//    $('.item-blog').eq(0).clone().insertBefore('.single-blog .holder-right .holder-description');
//    $('.item-blog').eq(1).clone().insertBefore('.single-blog .holder-right .holder-description');

//    isSectionBlogAppend = true;
//  }
//} 

// if($(window).width() >= 992){
//   $('.single-blog .item-blog').eq(0).insertBefore('.multiple-blog .holder-list-blog  .item-blog').eq(0);
//   $('.single-blog .item-blog').eq(1).insertBefore('.multiple-blog .holder-list-blog .item-blog').eq(1);
// }

//if ($(window).width() <= 991 && $(window).width() >= 768) {
//  $('.section-chart').insertAfter('.single-blog .holder-left .holder-ads');
//  $('.section-microscope').insertAfter('.single-blog .holder-left .section-chart');
//} else {
//  $('.section-chart').appendTo('.multiple-blog .holder-left');
//  $('.section-microscope').appendTo('.multiple-blog .holder-left');
//}

if ($(window).width() < 768) {
  $(".multiple-blog .holder-left").append().insertBefore(".multiple-blog .holder-inline-blog");
  $(".single-blog .item-blog").each(function() {
    $(this).children(".time").insertBefore($(this).find(".desc"));
  });

  $(".multiple-blog .item-blog").each(function() {
    $(this).children(".time").insertAfter($(this).find(".desc"));
  });

  //$(".section-market .holder-box").each(function() {
  //  $(this).find(".holder-actions").insertBefore($(this).find(".link-categ").first());
  //});

} 

if ($(window).width() > 767) {
  $(".multiple-blog .holder-left").insertAfter(".multiple-blog .holder-right");
  $(".multiple-blog .item-blog").each(function() {
    $(this).children(".time").insertAfter($(this).find(".heading"));
  });

  $(".single-blog .item-blog").each(function() {
    $(this).children(".time").insertAfter($(this).find(".heading"));
  });

  //$(".section-market .holder-box").each(function() {
  //  $(this).find(".holder-actions").insertAfter($(this).find(".desc"));
  //});
}
}

function _holderBox() {
if($(window).width() < 768) {
  $('.section-market .holder-box:lt(4)').each(function (index, elt){
  }).show();
}
}

function InitSwiperPopup() {
  $('body .js-video-btn').on('click', function (event) {
      event.stopPropagation();
      swiper.slideToLoop(parseInt($('#videoIndex').val()), 200, false);
      $('body .popup-image-wrapper').addClass('open-popup');
      $('body').addClass('no-scroll');
  });

  $('body .js-img-btn,body .gallery-thumb-wide:not(.article-has-video)').on('click', function (e) {
      e.stopPropagation();
      swiper.slideToLoop(parseInt($('#picIndex').val()), 200, false);
      $('body .popup-image-wrapper').addClass('open-popup');
      $('body').addClass('no-scroll');
});


$('body .video-thumb').click(function () {
    swiper.slideToLoop(parseInt($('#videoIndex').val()), 200, false);
});

$('body .image-thumb').click(function () {
    swiper.slideToLoop(parseInt($('#picIndex').val()), 200, false);
});

var swiper = new Swiper('.popup-image-wrapper .swiper-container', {
  loop: true,
  navigation: {
    nextEl: '.popup-wrapper .swiper-button-next',
    prevEl: '.popup-wrapper .swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  keyboard: {
    enabled: true,
    onlyInViewport: false,
  },
});

var videoSwiper = new Swiper('.popup-video-wrapper .swiper-container', {
    navigation: {
        nextEl: '.popup-wrapper .swiper-button-next',
        prevEl: '.popup-wrapper .swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    keyboard: {
        enabled: true,
        onlyInViewport: false,
    },
});
}

function InitSwiperInquiry() {
var swiper = new Swiper('.section-inquiry .swiper-container', {
  observer: true,
  observeParents: true,
  slidesPerView: 3,
  spaceBetween: 15,
  loop: false,
  noSwiping: false,
  allowSlidePrev: false,
  allowSlideNext: false,
  navigation: {
    nextEl: '.section-inquiry .swiper-button-next',
    prevEl: '.section-inquiry .swiper-button-prev',
  },
  keyboard: {
    enabled: true,
    onlyInViewport: false,
  },
  breakpoints: {
    991: {
      slidesPerView: 2,
      loop: true,
      noSwiping: true,
      allowSlidePrev: true,
      allowSlideNext: true,
    },
    767: {
      slidesPerView: 1,
      loop: true,
      noSwiping: true,
      allowSlidePrev: true,
      allowSlideNext: true,
    },
  }
});
}

function InitSwiperBlog() {
var swiper = new Swiper('.home-blog-container', {
  observer: true,
  observeParents: true,
  slidesPerView: 4,
  loop: false,
  noSwiping: false,
  allowSlidePrev: false,
  allowSlideNext: false,
  navigation: {
    nextEl: '.home-blog-container .swiper-button-next',
    prevEl: '.home-blog-container .swiper-button-prev',
  },
  keyboard: {
    enabled: true,
    onlyInViewport: false,
  },
  breakpoints: {
    1199: {
      slidesPerView: 3,
      spaceBetween: 5,
      loop: false,
      noSwiping: true,
      allowSlidePrev: true,
      allowSlideNext: true,
    },
    991: {
      slidesPerView: 2,
      spaceBetween: 5,
      loop: false,
      noSwiping: true,
      allowSlidePrev: true,
      allowSlideNext: true,
    },
    767: {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: false,
      noSwiping: true,
      allowSlidePrev: true,
      allowSlideNext: true,
    },
  }
});
}

function InitSwiperVideo() {
var galleryThumbs = new Swiper('.section-video .gallery-thumbs', {
  // slidesPerColumn: 2,
  slidesPerView: 3,
  spaceBetween: 0,
  noSwiping: false,
  allowSlidePrev: false,
  allowSlideNext: false,
  // freeMode: true,
  watchSlidesVisibility: true,
  watchSlidesProgress: true,
  breakpoints: {
    991: {
      spaceBetween: 15,
    },
    991: {
      slidesPerView: 2,
      spaceBetween: 5,
      noSwiping: true,
      allowSlidePrev: true,
      allowSlideNext: true,
    },
  }
});

var galleryTop = new Swiper('.section-video .gallery-top', {
    spaceBetween: 10,
    allowSlidePrev: false,
    allowSlideNext: false,
  //navigation: {
  //  nextEl: '.section-video .swiper-button-next',
  //  prevEl: '.section-video .swiper-button-prev',
  //},
  thumbs: {
    swiper: galleryThumbs
  }
});
}

function InitSwiperLeader() {
var swiper = new Swiper('.section-leaders .swiper-container', {
  slidesPerView: 3,
  spaceBetween: 0,
  loop: false,
  navigation: {
    nextEl: '.section-leaders  .swiper-button-next',
    prevEl: '.section-leaders  .swiper-button-prev',
  },
  breakpoints: {
    1199: {
      slidesPerView: 2,
      loop: false,
      noSwiping: true,
      allowSlidePrev: true,
      allowSlideNext: true,
    },
    991: {
      slidesPerView: 3,
      spaceBetween: 30,
      loop: false,
      noSwiping: true,
      allowSlidePrev: true,
      allowSlideNext: true,
    },
    767: {
      slidesPerView: 1.2,
      spaceBetween: 10,
      loop: false,
      noSwiping: true,
      allowSlidePrev: true,
      allowSlideNext: true,
    },
  }
});
}

function InitSwiperOpinion() {
var swiper = new Swiper('.section-opinion .swiper-container', {
  slidesPerView: 4,
  spaceBetween: 30,
  observer: true,
  observeParents: true,
  loop: false,
  noSwiping: false,
  allowSlidePrev: false,
  allowSlideNext: false,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.section-opinion  .swiper-button-next',
    prevEl: '.section-opinion  .swiper-button-prev',
  },
  breakpoints: {
    991: {
      slidesPerView: 2,
      spaceBetween: 0,
      loop: false,
      noSwiping: true,
      allowSlidePrev: true,
      allowSlideNext: true,
    },
    767: {
      slidesPerView: 1.2,
      spaceBetween: 10,
      loop: false,
      noSwiping: true,
      allowSlidePrev: true,
      allowSlideNext: true,
    },
  }
});
}

function _toggler() {
$('.direction-toggler').click(function(){
  $('body').addClass('overlay');
    $('body').toggleClass('direction-ltr direction-rtl');
    $('body').removeClass('overlay');

    if($('body').hasClass('direction-rtl')) {
      $('.swiper-container').addClass('swiper-container-rtl');
      $('.swiper-container').attr('dir','rtl');
    } else {
      $('.swiper-container').removeClass('swiper-container-rtl');
      $('.swiper-container').removeAttr('dir','rtl');
    }
});
}

function languageClasses(){
  if($('body').hasClass('direction-rtl')) {
    $('.swiper-container').addClass('swiper-container-rtl');
    $('.swiper-container').attr('dir','rtl');
  } else {
    $('.swiper-container').removeClass('swiper-container-rtl');
    $('.swiper-container').removeAttr('dir','rtl');
  }
}

function _chartTab() {
$('.chart-tab .tab-item').first().addClass('active-link');
$('.tab-content').first().show();

$('.chart-tab .tab-item').on('click', function(e) {
  $(this).addClass('active-link');
  var getAttr =  $(this).attr('data-link');
  var dataLink = $('#' + getAttr + '.tab-content');
  $(this).siblings().removeClass('active-link');
  console.log( $(this));

  dataLink.siblings('.tab-content').hide();
  dataLink.fadeIn();

  e.preventDefault();
})
}

function InitSwiperRelatedReport() {
var swiper = new Swiper('.swiper-report', {
  slidesPerView: 1,
  navigation: {
    nextEl: '.swiper-report .swiper-button-next',
    prevEl: '.swiper-report .swiper-button-prev',
  },
  on: {
      init: function () {
          var swiper__slidecount = this.slides.length;
          if (swiper__slidecount <= 1) {
              $(this.$el).find('.swiper-button-prev,.swiper-button-next').hide();
          }
      },
  },
});
}

function InitSwiperPartnerCompanies() {
var swiper = new Swiper('.swiper-partners', {
    slidesPerView: 1,
    loop: true,
    navigation: {
        nextEl: '.swiper-partners .swiper-button-next',
        prevEl: '.swiper-partners .swiper-button-prev',
    },
  on: {
      init: function () {
          var swiper__slidecount = this.slides.length;
          if (swiper__slidecount <= 3) {
              $(this.$el).find('.swiper-button-prev,.swiper-button-next').hide();
          }
      },
  },
});
}

function InitSwiperRelatedArticles(html) {
$('.swiper-articles-holder').html(html);

var swiper = new Swiper('.swiper-related-articles', {
  slidesPerView: 6,
  spaceBetween: 10,
  allowSlidePrev: false,
  allowSlideNext: false,
  navigation: {
    nextEl: '.swiper-related-articles .swiper-button-next',
    prevEl: '.swiper-related-articles .swiper-button-prev',
  },
  breakpoints: {
    991: {
      slidesPerView: 'auto',
      allowSlidePrev: true,
      allowSlideNext: true,
    }, 
    767: {
      slidesPerView: 3,
      allowSlidePrev: true,
      allowSlideNext: true,
    }, 
    575 : {
      slidesPerView: 1,
      allowSlidePrev: true,
      allowSlideNext: true,
    }
  }
});
}

function toggleFilterMobile(){
    $('.holder-filter').slideToggle(500);
}

function openFilterMobile() {
var holderFilter = $('.holder-filter');
var html = $('html');
var body = $('body');

holderFilter.addClass('holder-filter-active');  
html.addClass('overflow-hide');
body.addClass('overflow-hide');
}

function closeFilterMobile() {
var holderFilter = $('.holder-filter');
var html = $('html');
var body = $('body');

holderFilter.removeClass('holder-filter-active');
html.removeClass('overflow-hide');
body.removeClass('overflow-hide');
}

function customFilterSelect() {
var selectList = $('.select-list');
var selectBtnMobile = $('.btn-select-trigger');

if (selectList) {
  selectList.on('click', function(e) {
    var selectText = $(this).text();
    var selectParent = $(this).parent().parent().siblings('.field-select').find('option');
    var select = $(this).parent().parent().siblings('.field-select');
    var btnSelect = $(this).parent().siblings('.btn-select-trigger');
    
    selectParent.removeAttr('selected');
    
    selectParent.each(function() {
      if ($(this).text() === selectText) {
        $(this).attr('selected', true);
        btnSelect.html($(this).text())
      }
    })
  })

  selectBtnMobile.on('click', function() {
    var selectMenu = $(this).siblings('ul');

    selectMenu.toggleClass('select-close');
  })
}
}

function openFilterNavMobile(e) {
var event = e.classList[0];
var category = $('.holder-category');
var subcategory = $('.holder-subcategory');
var country = $('.holder-country');

if (event == "btn-category-mobile") {
  category.addClass('holder-category-active');
} else if (event == "btn-subcategory-mobile") {
  subcategory.addClass('holder-category-active');
} else if (event == "btn-country-mobile") {
  country.addClass('holder-category-active');
}
}

function closeFilterNavMobile() {
var category = $('.holder-category');
var subcategory = $('.holder-subcategory');
var country = $('.holder-country');

category.removeClass('holder-category-active');  
subcategory.removeClass('holder-category-active');  
country.removeClass('holder-category-active');  
}

function openPopupDetails() {
  $('body .video-thumb').click(function () {
      //mySwiper.slideToLoop(index, speed, runCallbacks);
      $('.popup-image-wrapper').addClass('open-popup');
      $('body').addClass('no-scroll');
  });

  $('body .image-thumb').click(function () {
      $('body .popup-image-wrapper').addClass('open-popup');
      $('body').addClass('no-scroll');
  });

$('body .article-has-video').click(function () {
    $('body .popup-video-wrapper').addClass('open-popup');
    $('body').addClass('no-scroll');
});

$('body .popup-wrapper .icon-close').click(function (){
  $(this).parents('.popup-wrapper').removeClass('open-popup');
  $('body').removeClass('no-scroll');
  $(window).scrollTop(1);
});

}

function openPopupNewsletter() {
  $(document).on('click', '.btn-news-letter', function (e) {
      e.preventDefault();
      $('#newsLetterForm #email').val($('#newsletterEmail').val());
      $('.modal-newsletter').addClass('open-newsletter');
      $('body').addClass('no-scroll');
      $('main').addClass('is-lock');
  });

  $('.newsletter-wrapper .icon-close').click(function (e) {
      e.preventDefault();
      $('.modal-newsletter').removeClass('open-newsletter');
      $('body').removeClass('no-scroll');
      $('main').removeClass('is-lock');
  });

$(document).on('click', function (e) {
  if (e.target.classList.value === "modal-newsletter open-newsletter") {
    $('.modal-newsletter').removeClass('open-newsletter');
    $('body').removeClass('no-scroll');
    $('main').removeClass('is-lock');
    removeFixed();
  }
});

$('.btn-news-letter').on('click', function() {
  $('.modal-newsletter').addClass('open-newsletter');
  $('body').addClass('no-scroll');
  $('main').addClass('is-lock');
})
}


function _forPreviewOnly() {
if($('.11-popup').length > 0) {
  $('.popup-wrapper').addClass('open-popup');
  $('body').addClass('no-scroll');
}
}

function closeAllPopups() {
$(document).keydown(function(e) {
  if (e.keyCode == 27) { 
    $('.popup-wrapper').removeClass('open-popup');
    $('.modal-newsletter').removeClass('open-newsletter');
    $('body').removeClass('no-scroll');
    $('main').removeClass('is-lock');
    $('header .nav-item').removeClass('open-menu');
    $('header .nav-item .nav-link').removeClass('nav-link-active')
    // $('header .field-search').fadeOut();
    // $('.search-btn-mobile').fadeOut();
    $('.header-logo-menu').removeClass('open-search');
    $('.holder-nav-search').removeClass('holder-nav-search-active');
    $(window).scrollTop(1)
    // $('header .nav-item').children('.menu-dropdown').toggle("slide", { direction: "up" }, 0);
  }

  if (e.keyCode == 9) {
    return false;
  }
});

$(document).on('click', function (e) {
  if ($(e.target).closest(".open-menu").length === 0) {
    //$('header .nav-item').removeClass('open-menu');
    //$('header .nav-item .nav-link').removeClass('nav-link-active')
  }
  
  if (e.target.classList.value != "fas fa-search" && e.target.classList.value != "field-search") {
    // $('header .field-search').fadeOut();
    // $('.search-btn-mobile').fadeOut();
    //$('.header-logo-menu').removeClass('open-search');
    //$('.holder-nav-search').removeClass('holder-nav-search-active');
  }
});
}