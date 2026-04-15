const button = document.querySelector('.menu-toggle');
const menu = document.querySelector('#' + button.getAttribute('aria-controls'));
menu.setAttribute('hidden', '');

button.addEventListener('click', (e) => {
	const isExpanded = (button.getAttribute('aria-expanded') === 'true');
	if (isExpanded) {
		closeMenu();
	} else {
		openMenu();
	}
});

function openMenu() {
	button.setAttribute('aria-expanded', 'true');
	menu.removeAttribute('hidden');
	document.body.setAttribute('data-menu-open', '');
}

function closeMenu() {
	button.setAttribute('aria-expanded', 'false');
	menu.setAttribute('hidden', '');
	document.body.removeAttribute('data-menu-open');
}

function mayViewTransition(cb) {
	document.startViewTransition && window.matchMedia('(prefers-reduced-motion: no-preference)').matches
		? document.startViewTransition(cb)
		: cb();
}

const siteHeader = document.querySelector('.site-header');
const defaultToDark = siteHeader.classList.contains('is-style-dark');
window.addEventListener('scroll', () => {
	document.documentElement.dataset.scroll = window.scrollY;
	if ( window.scrollY > 240 && !siteHeader.classList.contains('site-header--sticky')) {
		mayViewTransition(() => {
			siteHeader.classList.add('site-header--sticky');
			siteHeader.classList.remove('is-style-dark');
		})
	} else if ( window.scrollY === 0 && siteHeader.classList.contains('site-header--sticky')) {
		mayViewTransition(() => {
			siteHeader.classList.remove('site-header--sticky');
			if (defaultToDark) siteHeader.classList.add('is-style-dark');
		})
	}
});
