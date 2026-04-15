const SUPPORTS_HOVER = window.matchMedia('(hover: hover)').matches;

const SELECTORS = {
	card: '.sphc-people-card',
	wrapper: '.sphc-media-hover',
	video: '.sphc-media__video',
	controls: '.sphc-people-card__media-controls',
	btnStop: '.sphc-people-card__media-controls-button--stop',
	btnPlayPause: '.sphc-people-card__media-controls-button--play-pause',
	btnMute: '.sphc-people-card__media-controls-button--mute',
	cardFeatured: 'sphc-people-card--pattern--featured',
};

const CLASSES = {
	controlsVisible: 'sphc-people-card__media-controls--visible',
	isPlaying: 'is-playing',
	isMuted: 'is-muted',
};

const LAZYLOAD_ROOT_MARGIN = '50px 0px 50px 0px';

const updatePlayButton = (btn, video) => {
	const playing = !video.paused;
	btn.classList.toggle(CLASSES.isPlaying, playing);
	btn.setAttribute('aria-label', playing ? 'Pause profile video' : 'Play profile video');
};

const updateMuteButton = (btn, video) => {
	const muted = video.muted;
	btn.classList.toggle(CLASSES.isMuted, muted);
	btn.setAttribute('aria-label', muted ? 'Unmute profile video' : 'Mute profile video');
};

const setupVideoEvents = (video, btnPlayPause, btnMute) => {
	video.addEventListener('play', () => updatePlayButton(btnPlayPause, video));
	video.addEventListener('pause', () => updatePlayButton(btnPlayPause, video));
	video.addEventListener('volumechange', () => updateMuteButton(btnMute, video));
};

const playVideo = (video, state) => {
	state.preventHoverPlay = false;
	video.play().catch(() => {});
};

const pauseVideo = (video, state) => {
	state.preventHoverPlay = true;
	video.pause();
};

const stopVideo = (video, state) => {
	video.pause();
	video.currentTime = 0;
	state.preventHoverPlay = true;
};

const togglePlay = (video, state) => {
	video.paused ? playVideo(video, state) : pauseVideo(video, state);
};

const setupCardHoverActions = (card, video, controls, state) => {
	card.addEventListener('mouseenter', () => {
		if (video.paused && !state.preventHoverPlay) {
			playVideo(video, state);
		}

		state.hoverTimerId = setTimeout(() => {
			controls.classList.add(CLASSES.controlsVisible);
		}, 1000);
	});

	card.addEventListener('mouseleave', () => {
		if (!video.paused) video.pause();

		if (state.hoverTimerId) {
			clearTimeout(state.hoverTimerId);
			state.hoverTimerId = null;
		}

		controls.classList.remove(CLASSES.controlsVisible);
	});
};

const setupCardClickToggle = (target, video, state) => {
	target.addEventListener('click', (event) => {
		if (event.target.closest('a')) return;
		if (event.target.closest(SELECTORS.controls)) return;

		togglePlay(video, state);
	});
};

const initPeopleCard = (card) => {
	const wrapper  = card.querySelector(SELECTORS.wrapper);
	const video    = wrapper.querySelector(SELECTORS.video);
	const controls = card.querySelector(SELECTORS.controls);

	if (!wrapper || !video || !controls) return;

	const btnStop      = controls.querySelector(SELECTORS.btnStop);
	const btnPlayPause = controls.querySelector(SELECTORS.btnPlayPause);
	const btnMute      = controls.querySelector(SELECTORS.btnMute);

	if (!btnStop || !btnPlayPause || !btnMute) return;

	const state = {
		preventHoverPlay: false,
		hoverTimerId: null,
	};

	controls.hidden = false;
	video.muted = true;

	setupVideoEvents(video, btnPlayPause, btnMute);

	if (SUPPORTS_HOVER) {
		setupCardHoverActions(card, video, controls, state);
	} else {
		controls.classList.add(CLASSES.controlsVisible);
	}

	const isFeatured = card.classList.contains(SELECTORS.cardFeatured);
	setupCardClickToggle(isFeatured ? wrapper : card, video, state);

	btnStop.addEventListener('click', (e) => {
		e.stopPropagation();
		stopVideo(video, state);
	});

	btnPlayPause.addEventListener('click', (e) => {
		e.stopPropagation();
		video.paused ? playVideo(video, state) : pauseVideo(video, state);
	});

	btnMute.addEventListener('click', (e) => {
		e.stopPropagation();
		video.muted = !video.muted;
	});

	updatePlayButton(btnPlayPause, video);
	updateMuteButton(btnMute, video);
};

const loadVideoSources = (video) => {
	if (!video) return;

	video.querySelectorAll('source[data-src]').forEach((source) => {
		const dataSrc = source.getAttribute('data-src');
		if (!dataSrc) return;
		source.removeAttribute('data-src');
		source.src = dataSrc;
	});

	video.load();
};

const createPeopleCardsLazyObserver = () => {
	if (!('IntersectionObserver' in window)) return null;

	return new IntersectionObserver(
		(entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const card = entry.target;
					const video = card.querySelector(SELECTORS.video);
					loadVideoSources(video);
					initPeopleCard(card);
					observer.unobserve(card);
				}
			});
		},
		{
			root: null,
			rootMargin: LAZYLOAD_ROOT_MARGIN,
			threshold: 0.1,
		}

	);
};

const initPeopleCards = () => {
	const cards = document.querySelectorAll(SELECTORS.card);
	const lazyObserver = createPeopleCardsLazyObserver();

	cards.forEach((card) => {
		if (lazyObserver) {
			lazyObserver.observe(card);
		} else {
			initPeopleCard(card);
		}
	});
};

document.addEventListener('DOMContentLoaded', () => {
	initPeopleCards();
});
