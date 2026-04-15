document.addEventListener(
	'DOMContentLoaded',
	() => {
		document.querySelectorAll('.sphc-slider-media__swiper').forEach((sliderEl) => {
			const layout = sliderEl.getAttribute('data-swiper-layout');
			const slidesPerView = layout === '3-3' ? 3 : 1;
			const slidesPerViewMobile = 1;
			const spaceBetween = layout === '3-3' ? 20 : 0;

			new Swiper(sliderEl, {
				navigation: {
					nextEl: '.sphc-slider-media__button--next',
					prevEl: '.sphc-slider-media__button--prev',
				},
				pagination: {
					el: '.sphc-slider-media__pagination',
					type: 'fraction',
				},
				slidesPerView: slidesPerViewMobile,
				spaceBetween,
				breakpoints: {
					'902': {
						slidesPerView,
					}
				}
			});
		});
	}
);
