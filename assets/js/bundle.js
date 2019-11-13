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