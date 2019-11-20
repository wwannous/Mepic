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
		  loop: true,
		  noSwiping: true,
		  allowSlidePrev: true,
		  allowSlideNext: true,
		},
		767: {
		  slidesPerView: 1.2,
		  spaceBetween: 10,
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
		  loop: true,
		  noSwiping: true,
		  allowSlidePrev: true,
		  allowSlideNext: true,
		},
		991: {
		  slidesPerView: 2,
		  spaceBetween: 5,
		  loop: true,
		  noSwiping: true,
		  allowSlidePrev: true,
		  allowSlideNext: true,
		},
		767: {
		  slidesPerView: 1,
		  spaceBetween: 0,
		  loop: true,
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
	  loop: true,
	  navigation: {
		nextEl: '.section-leaders  .swiper-button-next',
		prevEl: '.section-leaders  .swiper-button-prev',
	  },
	  breakpoints: {
		1199: {
		  slidesPerView: 2,
		  loop: true,
		  noSwiping: true,
		  allowSlidePrev: true,
		  allowSlideNext: true,
		},
		991: {
		  slidesPerView: 3,
		  spaceBetween: 30,
		  loop: true,
		  noSwiping: true,
		  allowSlidePrev: true,
		  allowSlideNext: true,
		},
		767: {
		  slidesPerView: 1.2,
		  spaceBetween: 10,
		  loop: true,
		  noSwiping: true,
		  allowSlidePrev: true,
		  allowSlideNext: true,
		},
	  }
	});
}
  
function InitSwiperPopup() {
    $('.js-video-btn').on('click', function (event) {
        event.stopPropagation();
        swiper.slideToLoop(parseInt($('#videoIndex').val()), 200, false);
        $('.popup-image-wrapper').addClass('open-popup');
        $('body').addClass('no-scroll');
    });

    $('.js-img-btn, .gallery-thumb-wide:not(.article-has-video)').on('click', function (e) {
        e.stopPropagation();
        swiper.slideToLoop(parseInt($('#picIndex').val()), 200, false);
        $('.popup-image-wrapper').addClass('open-popup');
        $('body').addClass('no-scroll');
  });


  $('.video-thumb').click(function () {
      swiper.slideToLoop(parseInt($('#videoIndex').val()), 200, false);
  });

  $('.image-thumb').click(function () {
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