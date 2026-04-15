const nav = document.querySelector('.site-nav');
document.querySelectorAll('[data-sphc-hero-shuffle]').forEach(button => {
	button.addEventListener('click', handleHeroShuffle);
	nav.appendChild(button);
});

function handleHeroShuffle(e) {
	const button = e.target.closest('button');
	if (!button) return;

	const screens = document.getElementById(button.dataset.sphcHeroShuffle)?.querySelectorAll('.sphc-hero__screen');
	if (!screens) return;

	mayViewTransition(() => {
		const hiddenScreens = Array.from(screens).filter(s => s.hidden);
		const randomIndex = Math.floor(Math.random() * hiddenScreens.length);
		screens.forEach(s => s.setAttribute('hidden', ''));
		hiddenScreens[randomIndex].querySelectorAll('video source').forEach(videoSource => {
			const dataSrc = videoSource.getAttribute('data-src');
			if (!dataSrc) return;
			videoSource.removeAttribute('data-src');
			videoSource.src = dataSrc;
			videoSource.parentNode.load();
		});
		hiddenScreens[randomIndex].removeAttribute('hidden');
	});
}

function mayViewTransition(cb) {
	document.startViewTransition && window.matchMedia('(prefers-reduced-motion: no-preference)').matches
		? document.startViewTransition(cb)
		: cb();
}
